var express = require('express');
var router = express.Router();

var Menu = require('../../models/menu');

var conf = require('../../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/', function(req, res){
	Menu.find({enabled : true}, function(err, docs) {
		var length = docs.length;
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
		res.send({ menus : docs });
	});
});

router.post('/', function(req, res){
	logger.log(JSON.stringify(req.body));
	var menu = new Menu({
		menu_name : req.body.menu_name,
		pid : req.body.pid,
		create_user : req.user.username,
		create_date : new Date(),
		enabled : true,
		sub_menus : []
	});
	if(req.body.pid) {
		logger.log(">>>>> Update");
		Menu.find({_id : req.body.pid}, function(err, docs) {
			docs[0].sub_menus.push(menu);
			Menu.update({_id : req.body.pid}, docs[0], function(err) {
				if(err){
					logger.err(err);
					throw err;
				}
				res.send({menu : menu});
			});
		});
	} else {
		menu.save(function(err,silence){
			if(err){
				logger.err(err);
				throw err;
			}
		    res.send({menu : silence});
		});
	}
});

router.delete('/:id', function(req, res){
	Menu.find({enabled : true}, function(err, docs) {
		var length = docs.length;
		var finded = false;
		for(var i = 0; i < length && !finded; i++) {
			logger.log(">>>>> i : " + i);
			if(docs[i]._id == req.params.id) {
				logger.log(">>>>> checked 1");
				finded = true;
				docs[i].enabled = false;
				Menu.update({_id : req.params.id},
					{enabled : false, delete_user : req.user.username, delete_date : new Date()},
					function(err) {
						if(err){
							logger.err(err);
							throw err;
						}
						res.send({msg : "success"});
				});
			} else {
				logger.log(">>>>> checked 2");
				var sub_length = docs[i].sub_menus.length;
				logger.log(">>>>> sub_length : " + sub_length);
				for(var j = 0; j < sub_length; j++) {
					logger.log(">>>>> j : " + j);
					if(docs[i].sub_menus[j]._id == req.params.id) {
						finded = true;
						docs[i].sub_menus[j].enabled = false;
						docs[i].update({sub_menus : docs[i].sub_menus}, function(err) {
							if(err){
								logger.err(err);
								throw err;
							}
							res.send({msg : "success1"});
						});
					}
				}
			}
		}
		logger.log(">>>>> checked 3 finded : " + finded);
		if(!finded) {
			res.send({msg : "not found"});
		}
	});
	
	
});

router.get('/view/create', function(req, res) {
	res.render('menus', { });
});

module.exports = router;
