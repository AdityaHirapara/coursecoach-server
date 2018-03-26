const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const Course = require('./models/course');
const Subject = require('./models/subject');
const Topic = require('./models/topic');

mongoose.connect('link');

server.listen(port, () =>{
  console.log(`Server is running on ${port}`);
});
