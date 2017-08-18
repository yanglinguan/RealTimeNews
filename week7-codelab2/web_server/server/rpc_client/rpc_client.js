var jayson = require('jayson');

// create a client connected to backend server
var client = jayson.client.http({
  port: 4040,
  hostname: 'localhost'
});

function add(a, b, callback) {
  // err: network error (e.g server not found)
  // error: parameter error
  client.request('add', [a, b], function(err, error, response) {
    if (err) throw err;
    console.log(response);
    callback(response);
  });
}

module.exports = {
  add: add
}
