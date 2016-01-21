var express = require('express');
var router = express.Router();

var conf = require('./../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
