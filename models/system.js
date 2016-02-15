var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var System = new Schema({
	system_name: String
});

System.plugin(passportLocalMongoose);

module.exports = mongoose.model('System', System);