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
    res.json(subjects);
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
    res.json(topics);
  });
});

app.post('/newcourse', (req, res) => {
  let course = req.body.course;

  Course
  .create({name: course, subjects: []}, (err, sub) => {
    if (err) {
      console.log(err);
    }
    res.status(200).redirect('file:///home/aditya/coursecoach-form/form.html');
  });
});

app.post('/newsubject', (req, res) => {
  let course = req.body.course;
  let subject = req.body.subject;

  Subject
  .create({name: subject, topics: []}, (err, sub) => {
    if (err) {
      console.log(err);
    }
    Course
    .findOne({name: course})
    .exec( (ferr, crs) => {
      if (ferr) {
        console.log(ferr);
      }
      let subarr = crs.subjects;
      subarr.push(sub._id);
      Course
      .updateOne({name: course}, {subjects: subarr}, (uperr) => {
        if (uperr) {
          console.log(uperr);
        }
        res.status(200).redirect('file:///home/aditya/coursecoach-form/form.html');
      });
    });
  });
});

app.post('/newtopic', (req, res) => {
  let subject = req.body.subject;
  let topic = req.body.topic;
  let link = req.body.link;

  Topic
  .create({name: topic, link: link}, (err, tp) => {
    if (err) {
      console.log(err);
    }
    Subject
    .findOne({name: subject})
    .exec( (ferr, sub) => {
      if (ferr) {
        console.log(ferr);
      }
      let topicarr = sub.topics;
      topicarr.push(tp._id);
      Subject
      .updateOne({name: subject}, {topics: topicarr}, (uperr) => {
        if (uperr) {
          console.log(uperr);
        }
        res.status(200).redirect('file:///home/aditya/coursecoach-form/form.html');
      });
    });
  });
});

app.get('/courselist', (req, res) => {
  Course
  .find()
  .exec( (err, crs) => {
    if (err) {
      console.log(err);
    }
    let list = crs.map((c) => {
      return c.name;
    });
    console.log(list);
    res.send(list);
  });
});

app.get('/subjectlist', (req, res) => {
  let course = req.query.crs;
  Course
  .findOne({name: course})
  .populate('subjects')
  .exec( (err, crs) => {
    if (err) {
      console.log(err);
    }
    let list = crs.subjects.map((s) => {
      return s.name;
    });
    res.send(list);
  });
});

server.listen(port, () =>{
  console.log(`Server is running on ${port}`);
});
