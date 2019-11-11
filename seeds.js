var mongoose = require("mongoose");
var Post = require("./models/post");
var Message = require("./models/message");

var postData = [
	{
		image : "https://res.cloudinary.com/thariqphoto/image/upload/v1572526004/thariqphoto_source/Monumen_nasional_aqzysz.jpg",
		title : "National Monument",
		description: "National Monument"
	},
	{
		image: "https://res.cloudinary.com/thariqphoto/image/upload/v1572525980/thariqphoto_source/LRM_EXPORT_20180818_163727_y43vag.jpg",
		title: "Swirling Tree",
		description: "Swirling Tree",
	},
	{
		image: "https://res.cloudinary.com/thariqphoto/image/upload/v1572525973/thariqphoto_source/LRM_EXPORT_20180818_171902_ap3r1w.jpg",
		title: "Spider",
		description: "Spider"
	},
	{
		image: "https://res.cloudinary.com/thariqphoto/image/upload/v1572525977/thariqphoto_source/LRM_EXPORT_710601784238769_20190213_215912854_uuspne.jpg",
		title: "Jakarta",
		description: "Jakarta"
	},
	{
		image: "https://res.cloudinary.com/thariqphoto/image/upload/v1572525958/thariqphoto_source/LRM_EXPORT_20180818_170929_fmiheb.jpg",
		title: "Climbing together",
		description: "Climbing together"
	},
	{
		image: "https://res.cloudinary.com/thariqphoto/image/upload/v1572526008/thariqphoto_source/Perbukitan_karang_sambung_whbmul.jpg",
		title: "Karangsambung",
		description: "Karangsambung"
	}
];

var messageData = [
	{
		author: "Dilarang Nungging",
		email: "dilarangnungging@nungging.com",
		text: "jangan alay alay amat lah"
	},
	{
		author: "manjat lover",
		email: "manjatlover@manjat.com",
		text: "sombong gak ngajak ngajak"
	}
];

function seedDB(){
	//Remove All Post and Message
	Message.remove({}, function(err){
		if(err){		
		} else{
		}
	});
	Post.remove({}, function(err){
		if(err){
			console.log("ERROR");
		} else{
			//Add a Post	
			postData.forEach(function(seed){
				Post.create(seed, function(err, newPost){
					if(err){
						console.log("ERROR ADDING POST");
					} else{
						console.log("NEW POST CREATED");
					}
				});
			});
			messageData.forEach(function(seed){
				Post.create(seed, function(err, newPost){
					if(err){
						console.log("ERROR ADDING MESSAGE");
					} else{
						console.log("NEW MESSAGE CREATED");
					}
				});
			});
		}
	});
	
}
module.exports = seedDB;

