var express = require('express');
var router = express.Router();

var conf = require('../config');
var logger = require('tracer')[conf.log.strategy](conf.log.setting.log);

router.get('/', function(req, res){
    res.send("model!", 200);
});

module.exports = router;
