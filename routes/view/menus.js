var express = require('express');
var router = express.Router();

var Menu = require('../../models/menu');
var System = require('../../models/system');

var conf = require('../../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/create', function(req, res) {
	res.render('menus', { user : req.user });
});

router.get('/list', function(req, res) {
	System.find({}, function(err, systems) {
		if(err) {
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
			res.render('menus', { user : req.user, system : systems[0], menus : docs });
		});
	});
});

router.get('/detail', function(req, res) {
	
});

router.get('/update', function(req, res) {
	
});

router.get('/delete', function(req, res) {
	
});

router.get('/', function(req, res){
	logger.log(JSON.stringify(req.body));
	logger.log(JSON.stringify(req.params));
	logger.log(JSON.stringify(req.query.mode));
	if(req.query.mode == 'model') {
		res.render('menus', { });
	} else if(req.query.mode == 'view') {
		Menu.find({}, function(err, docs) {
			res.render('menus', { menus : docs });
		});
	} else {
		
	}
});

router.post('/', function(req, res){
	var menu = new Menu({menuname:req.body.menuname});
	menu.save(function(err,silence){
		if(err){
			logger.err(err);
			throw err;
		}
	    res.send("menu!", 200);
	});
});

router.get('/view/create', function(req, res) {
	res.render('menus', { });
});

module.exports = router;
