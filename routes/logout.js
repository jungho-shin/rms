var express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');

var conf = require('../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
