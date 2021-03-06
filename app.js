var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var model = require('./routes/model');
var model_register = require('./routes/model/register');
var model_login = require('./routes/model/login');
var model_logout = require('./routes/model/logout');
var model_menus = require('./routes/model/menus');
var model_systems =  require('./routes/model/systems');

var view = require('./routes/view');
var view_register = require('./routes/view/register');
var view_login = require('./routes/view/login');
var view_menu = require('./routes/view/menus');
var view_system = require('./routes/view/systems')

var routes = require('./routes/index');
var users = require('./routes/users');
var ping = require('./routes/ping');
var deploy = require('./routes/deploy');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('your secret here'));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/model', model);
app.use('/model/register', model_register);
app.use('/model/login', model_login);
app.use('/model/logout', model_logout);
app.use('/model/menus', model_menus);
app.use('/model/systems', model_systems);

app.use('/view', view);
app.use('/view/register', view_register);
app.use('/view/login', view_login);
app.use('/view/menus', view_menu);
app.use('/view/systems', view_system);

app.use('/', routes);
app.use('/users', users);
app.use('/ping', ping);
app.use('/deploy', deploy);

//passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;