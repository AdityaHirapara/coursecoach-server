const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Course = require('./models/course');
const Subject = require('./models/subject');
const Topic = require('./models/topic');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect('link');

app.post('/subjects', (req, res) => {
  let course = req.body.course;

  Course
  .findOne({ name: course })
  .populate('subjects')
  .exec( (err, crs ) => {
    if(err) {
      console.log(err);
    }
    let subjects = crs.subjects.map((x) => {
      return x.name;
    });
    return subjects;
  });
});

app.post('/topics', (req, res) => {
  let subject = req.body.subject;

  Subject
  .findOne({ name: subject })
  .populate('topics')
  .exec( (err, sub ) => {
    if(err) {
      console.log(err);
    }
    let topics = sub.topics.map((x) => {
      return { name: x.name, link: x.link };
    });
    return topics;
  });
});

server.listen(port, () =>{
  console.log(`Server is running on ${port}`);
});
