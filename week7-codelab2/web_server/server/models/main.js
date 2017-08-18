const mongoose = require('mongoose')

module.exports.connect = (uri) => {
  mongoose.connect(uri);

  mongoose.connect.on('error', (err) => {
    console.error(`mongoose connection error: ${err}`);
    process.exit(1);
  });

  // load models
  require('./user')
}
