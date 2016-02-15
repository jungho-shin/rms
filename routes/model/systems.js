var express = require('express');
var router = express.Router();

var System = require('../../models/system');

var conf = require('../../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.post('/', function(req, res) {
	logger.log(">>>>> put system");
	System.find({}, function(err, docs) {
		logger.log(">>>>> length : " + docs.length);
		logger.log(">>>>> _id : " + docs[0]._id);
		logger.log(">>>>> req.body : " + req.body.system_name);
		logger.log(">>>>> req.body.system_name : " + req.body.system_name);
		System.update({_id : docs[0]._id}, {system_name : req.body.system_name},
			function(err) {
				if(err) {
					logger.err(err);
					throw err;
				}
				res.send({msg : "success"});
		});
	});
});

module.exports = router;
