const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Author = require('../models/author');

module.exports = function(passport) {
  passport.use('local', new LocalStrategy(
    function(username, password, done) {
      Author
      .findOne({ username: username })
      .exec( (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (user.password !== password) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Author.findById(id, function(err, user) {
      done(err, user);
    });
  });
}