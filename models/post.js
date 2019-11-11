var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
	image		: String,
	description : String,
	category	: String
});

module.exports = mongoose.model("Post", postSchema);