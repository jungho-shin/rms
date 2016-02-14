var express = require('express');
var router = express.Router();

var Menu = require('../models/menu');

var conf = require('../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/', function(req, res){
	Menu.find({enabled : true}, function(err, docs) {
		var length = docs.length;
		logger.log(">>>>> length : " + length);
		for(var i = 0; i < length; i++) {
			var sub_length = docs[i].sub_menus.length;
			var sub_menus = [];
			for(var j = 0; j < sub_length; j++) {
				if(docs[i].sub_menus[j].enabled) {
					sub_menus.push(docs[i].sub_menus[j]);
				}
			}
			docs[i].sub_menus = sub_menus;
		}
		res.render('main', { user : req.user, menus : docs });
	});
});

module.exports = router;
