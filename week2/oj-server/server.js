const express = require('express')
const app = express()

const mongoose = require('mongoose');
// connect to mongodb
mongoose.connect("mongodb://user:test@ds023550.mlab.com:23550/cs503");

const restRouter = require('./routes/rest');
const indexRouter = require('./routes/index');
const path = require('path')
app.use(express.static(path.join(__dirname, '../public/')));

app.use('/', indexRouter);

app.use('/api/v1/', restRouter);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

