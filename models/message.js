var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
	author		: String,
	email		: String,
	text		: String,
	createdAt	: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Message", messageSchema);