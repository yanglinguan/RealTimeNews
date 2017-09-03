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

// Get news summaries for a user
function get_news_summaries_for_user(user_id, page_num, callback) {
  client.request('get_news_summaries_for_user', [user_id, page_num], function(err, error, response) {
    if (err) throw err;
    console.log(response);
    callback(response);
  });
}

module.exports = {
  add: add,
  get_news_summaries_for_user : get_news_summaries_for_user
}
