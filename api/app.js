var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

var User = require('./user');




var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
	console.log(JSON.stringify(req.body));//post params...
	console.log(JSON.stringify(req.params));//path params...
	console.log(JSON.stringify(req.query));//query params...
	
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
	next();
});

app.get('/', function (req, res) {
	res.send('Hello World!!!');
});



var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});



/*
 * Deploy
 * 
 */
app.post('/do/deploy' , function(req,res){
	console.log("POST /do/deploy");
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('post deploy test 02');
	
	exec('sudo ./../kcii_deploy.do',
	  function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});	
});
