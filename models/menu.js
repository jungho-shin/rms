var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var Menu = new Schema({
	menu_name: String,
	pid: String,
	create_user: String,
	create_date: Date,
	enabled: Boolean,
	delete_user: String,
	delete_date: Date,
	sub_menus : Array
});

Menu.plugin(passportLocalMongoose);

module.exports = mongoose.model('Menu', Menu);