const express = require('express')
const app = express()

const mongoose = require('mongoose');
mongoose.connect(
"mongodb://user:test@ds023550.mlab.com:23550/cs503"
);


const restRouter = require('./routes/rest')

app.get('/', function (req, res) {
  res.send('Hello word!')
})

app.use('/api/v1/', restRouter)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

