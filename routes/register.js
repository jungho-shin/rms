var express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');

var conf = require('../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/', function(req, res) {
	res.render('register', { });
});

router.post('/', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
    });
});


module.exports = router;
