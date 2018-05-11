const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Course = require('./models/course');
const Subject = require('./models/subject');
const Topic = require('./models/topic');
const Author = require('./models/author');
const Config = require('./config');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('./config/passport')(passport);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(session({ secret: Config.secret }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(Config.link);

app.post('/login', passport.authenticate('local', {
  successRedirect : 'https://adityahirapara.github.io/coursecoach-uploader/upload.html',
  failureRedirect : 'https://adityahirapara.github.io/coursecoach-uploader',
  failureFlash : false
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('https://adityahirapara.github.io/coursecoach-uploader');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('https://adityahirapara.github.io/coursecoach-uploader');
}

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
    let general = sub.topics.filter( t => t.typ == "general" ).map((x) => {
      return { name: x.name, link: x.link };
    });
    let books = sub.topics.filter( t => t.typ == "book" ).map((x) => {
      return { name: x.name, link: x.link };
    });
    let papers = sub.topics.filter( t => t.typ == "paper" ).map((x) => {
      return { name: x.name, link: x.link };
    });
    let topics = {
      general: general,
      books: books,
      papers: papers
    };
    res.json(topics);
  });
});

app.post('/newcourse', isLoggedIn, (req, res) => {
  let course = req.body.course;

  Course
  .create({name: course, subjects: []}, (err, sub) => {
    if (err) {
      console.log(err);
    }
    res.status(200).redirect('https://adityahirapara.github.io/coursecoach-uploader/upload.html');
  });
});

app.post('/newsubject', isLoggedIn, (req, res) => {
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
        res.status(200).redirect('https://adityahirapara.github.io/coursecoach-uploader/upload.html');
      });
    });
  });
});

app.post('/newtopic', isLoggedIn, (req, res) => {
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
        res.status(200).redirect('https://adityahirapara.github.io/coursecoach-uploader/upload.html');
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
    res.send(list);
  });
});

app.get('/subjectlist/:crs', (req, res) => {
  let course = req.params.crs;
  Course
  .findOne({ name: course })
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
