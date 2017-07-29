module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log(socket);
        // first connection: handshake
        const message = socket.handshake.query['message'];
        console.log(message)
        // use the socket.id to determine who sent the message to server, then send back
        io.to(socket.id).emit('message', 'hahaha from server');
    })
}