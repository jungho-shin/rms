var express = require('express');
var router = express.Router();

var passport = require('passport');

var conf = require('../../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/', function(req, res) {
    res.render('login', { user : req.user });
});

module.exports = router;
