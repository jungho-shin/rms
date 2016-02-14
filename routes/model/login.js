var express = require('express');
var router = express.Router();

var passport = require('passport');

var conf = require('../../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.post('/', passport.authenticate('local'), function(req, res) {
    res.redirect('/view');
});

module.exports = router;
