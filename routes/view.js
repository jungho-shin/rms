var express = require('express');
var router = express.Router();

var Menu = require('../models/menu');
var System = require('../models/system');

var conf = require('../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/', function(req, res){
	System.find({}, function(err, systems) {
		if(err){
			logger.err(err);
			throw err;
		}
		
		if(systems.length > 0) {
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
				res.render('main', { user : req.user, system : systems[0], menus : docs });
			});
		} else {
			var system = new System({system_name : "RMS"});
			system.save(function(err, silence){
				if(err){
					logger.err(err);
					throw err;
				}
				
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
					res.render('main', { user : req.user, system : slience, menus : docs });
				});
			});
		}
	});
});

module.exports = router;
