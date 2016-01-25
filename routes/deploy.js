var express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');

var conf = require('../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.post('/', function(req, res){
	console.log("POST /do/deploy");
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('post deploy test 02');
	
	exec('sudo ./../rms.do',
	  function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});	
});

module.exports = router;
