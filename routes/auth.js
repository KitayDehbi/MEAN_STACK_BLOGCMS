//variable declaration for mongoosebd
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/User");
//router to register the user
router.post('/register', function (req, res) {
   if (!req.username || !req.password) {
      res.json({ success: false, msg: 'Please pass username and password.' });
   } else {
      var newUser = new User({
         username: req.username,
         password: req.password
      });
      // save the user
      newUser.save(function (err) {
         if (err) {
            return res.json({ success: false, msg: 'Username already exists.' });
         }
         res.json({ success: true, msg: 'Successful created new user.' });
      });
   }
});
//router to register the new user

router.post('/login', function (req, res) {
   User.findOne({
      username: req.username
   }, function (err, user) {
      if (err) throw err;
      if (!user) {
         res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
      } else {
         // check if password matches
         user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
               // if user is found and password is right create a token
               var token = jwt.sign(user.toJSON(), config.secret);
               // return the information including token as JSON
               res.json({ success: true, token: 'JWT ' + token });
            } else {
               res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
         });
      }
   });
});
//router for logout
router.post('/logout', passport.authenticate('jwt', { session: false }), function (req, res) {
   req.logout();
   res.json({ success: true });
});
//exporting router as a module
module.exports = router;
