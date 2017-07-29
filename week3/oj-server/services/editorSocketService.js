const redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {

    // map the socketId to sessionId
    const socketIdToSessionId = {};
    // mao sessionId to participants
    const collaborations = {};
    const sessionPath = '/ojserver/'; // for redis
    io.on('connection', (socket) => {
        // console.log(socket);
        // first connection: handshake
        const sessionId = socket.handshake.query['sessionId'];
        // console.log(message)
        // // use the socket.id to determine who sent the message to server, then send back
        // io.to(socket.id).emit('message', 'hahaha from server');
        socketIdToSessionId[socket.id] = sessionId;

        // if(!(sessionId in collaborations)) {
        //     collaborations[sessionId] = {
        //         'participants': []
        //     };
        // }
        // collaborations[sessionId]['participants'].push(socket.id);

        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            // if there is no one in the collaborations, then get the previous change from redis
            redisClient.get(sessionPath + sessionId, function(data) {
                if (data) {
                    console.log('session terminated previously');
                    collaborations[sessionId] = {
                        'participants': [],
                        'cachedInstructions': JSON.parse(data)
                    };
                } else {
                    collaborations[sessionId] = {
                        'participants': [],
                        'cachedInstructions': []
                    };
                }
                collaborations[sessionId]['participants'].push(socket.id);
            });
        }

        // event listener
        // when receive a change event from one participant, send the change to others
        socket.on('change', delta => {
            // store the change 
            const sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                collaborations[sessionId]['cachedInstructions'].push(['change', delta, Date.now()])
            } else {
                console.log('DEBUG: sessionId not in collaborations, but receive a change event')
            }
            forwardEvent('change', socket.id, delta);
        })

        // when receive a cursorMove event from one participant, send the change to others
        socket.on('cursorMove', cursorPostition => {
            const cursor = JSON.parse(cursorPostition);
            cursor['socketId'] = socket.id;
            const cursorString = JSON.stringify(cursor);
            forwardEvent('cursorMove', socket.id, cursorString);
        });

        socket.on('restoreBuffer', () => {
            const sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                const cachedInstructions = collaborations[sessionId]['cachedInstructions'];
                for (let ins of cachedInstructions) {
                    socket.emit(ins[0], ins[1])
                }
            } else {
                console.log('DEBUG: sessionId not in collaborations, but receive a restoreBuffer event')
            }
        });

        socket.on('disconnect', () => {
            const sessionId = socketIdToSessionId[socket.id];
            let foundAndRemove = false;
            if (sessionId in collaborations) {
                const participants = collaborations[sessionId]['participants'];
                const index = participants.indexOf(socket.id)
                if (index >= 0) {
                    participants.splice(index, 1);
                    foundAndRemove = true;

                    if (participants.length === 0) {
                        const key = sessionPath + sessionId;
                        const value = JSON.stringify(collaborations[sessionId]['cachedInstructions']);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
            } else {
                console.log('DEBUG: sessionId not in collaborations, but receive a disconnect event')
            }

            if (!foundAndRemove) {
                console.log('ERROR: participant does not found')
            }
        });
    });

    const forwardEvent = function(eventName, socketId, dataString) {
        const sessionId = socketIdToSessionId[socketId];
        if (sessionId in collaborations) {
            const participants = collaborations[sessionId]['participants'];
            for (let p of participants) {
                if (socketId != p) {
                    io.to(p).emit(eventName, dataString);
                }
            }
        } else {
            console.log('DEBUG: sessionId not in collaborations, but receive a change event')
        }
    }
}