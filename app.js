var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var ping = require('./routes/ping');
//var deploy = require('./routes/deploy'); test15
var exec = require('child_process').exec;

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

app.use(function(req, res, next) {
	
	logger.log(JSON.stringify(req.body));//post params...
	logger.log(JSON.stringify(req.params));//path params...
	logger.log(JSON.stringify(req.query));//query params...
	
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
	next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/ping', ping);
//app.use('/deploy', deploy);


/*
 * Deploy
 * 
 */
app.post('/deploy' , function(req,res){
	logger.log("POST /do/deploy");
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('post deploy test 02');
	
//	exec('sudo ./rms.do',
//	  function (error, stdout, stderr) {
//	    logger.log('stdout: ' + stdout);
//	    logger.log('stderr: ' + stderr);
//	    if (error !== null) {
//	      logger.log('exec error: ' + error);
//	    }
//	});	
});


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
// deploy test3.