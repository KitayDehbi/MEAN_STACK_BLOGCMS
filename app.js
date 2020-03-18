var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var auth = require('./routes/auth');
var category = require('./routes/category');
var post = require('./routes/post');
const cors = require('cors');
app.use(passport.initialize());
app.use('/api/auth', auth);
app.use('/api/category', category);
app.use('/api/post', post);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cors);
mongoose.connect('mongodb://localhost/blog-cms', {
 promiseLibrary: require('bluebird'),
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex: true
}).then(() => console.log('connection successful'))
 .catch((err) => console.error(err));


module.exports = app;
