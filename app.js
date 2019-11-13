//ThariqPhoto V5 Deployed
require("dotenv").config();

var express 	 			= require("express"),
	mongoose	 			= require("mongoose"),
	bodyParser	 			= require("body-parser"),
	methodOverride			= require("method-override"),
	cloudinary				= require("cloudinary"),
	multer					= require("multer"),
	passport				= require("passport"),
	passportLocal			= require("passport-local"),
	passportLocalMongoose	= require("passport-local-mongoose"),
	flash					= require("connect-flash"),
	User					= require("./models/user"),
	Post		 			= require("./models/post"),
	Message					= require("./models/message"),
	app 					= express();
	
//APP and DB CONFIG
// mongoose.connect("mongodb://localhost:27017/thariqPhoto_v5");
mongoose.connect("mongodb+srv://thariqwarsa:" + process.env.DB_PASSWORD + "@cluster0-x1dzn.mongodb.net/test?retryWrites=true&w=majority");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.locals.moment = require("moment");

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ //pass req.user to all route ejs
	res.locals.currentUser	= req.user;
	res.locals.success 	    = req.flash("success");
	res.locals.error		= req.flash("error");
	next();
});

//=========================================================
//================= RESTful ROUTE =========================
//=========================================================
	
//ROOT ROUTE
app.get("/", function(req, res){
	res.redirect("gallery");
});

//ABOUT PAGE ROUTE
app.get("/about", function(req, res){
	res.render("about");
});

//INDEX ROUTE
app.get("/gallery", function(req, res){
	var selectedCategory = "All";
	
	Post.find({}, function(err, allPost){
		var selectedCategory = "All";
		if(err){
			req.flash("error", "Error find all posts!");
			res.redirect("/gallery");
		} else{
			res.render("index", {posts:allPost, selectedCategory:selectedCategory});
		}
	});
});

app.get("/gallery/category/:category", function(req, res){
	var selectedCategory = req.params.category;
	Post.find({category:req.params.category}, function(err, spesificPost){
		if(err){
			res.redirect("/gallery");
			req.flash("error", "Eror find all posts!");
		} else{
			res.render("index", {posts:spesificPost, selectedCategory:selectedCategory});
		}
	});
});

//NEW ROUTE
app.get("/gallery/new", isLoggedIn, function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/gallery", isLoggedIn, function(req, res){  		
	Post.create(req.body.post, function(err, newlyCreatedPost) {
		if (err) {
			req.flash("error", "Error create new post!");
			return res.redirect("/gallery");
		} else{
			req.flash("success", "New Post Created");
			res.redirect("/gallery");
		}	 
	});
});	

//EDIT ROUTE
app.get("/gallery/:id/edit", isLoggedIn, function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if(err){
			req.flash("error", "Post not found!");
			res.redirect("/gallery");
		} else{
			req.flash("success", "Post edited");
			res.render("edit", {post:foundPost});
		}
	});
});

//UPDATE POST
app.put("/gallery/:id", isLoggedIn, function(req, res){
	Post.findByIdAndUpdate(req.params.id, req.body, function(err, updatedPost){
		if(err){
			req.flash("error", "Error updating post!");
			res.redirect("/gallery");
		}else{
			req.flash("success", "Post updated");
			res.redirect("/gallery");	
		}
	});
});

//DESTROY ROUTE
app.delete("/gallery/:id", isLoggedIn, function(req, res){
	Post.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Error deleting post");
			res.redirect("/gallery");
		} else{
			req.flash("success", "Post Deleted");
			res.redirect("/gallery");
		}
	});
});

//MESSAGE ROUTE
app.get("/message", function(req, res){
	Message.find({}, function(err, allMessage){
		if(err){
			req.flash("eror", "All Message not found");
			res.redirect("/gallery");
		} else{
			res.render("message", {allMessage:allMessage});
		}
	});
});

//SEND MESSAGE ROUTE
app.post("/message", function(req, res){
	Message.create(req.body.message, function(err, newMessage){
		if(err){
			req.flash("error", "Error sending message");
			res.redirect("/message");
		}  else{
			req.flash("success", "Message sent");
			res.redirect("/message");
		}
	});	 
});

//DESTROY MESSAGE ROUTE
app.delete("/message/:id", isLoggedIn, function(req, res){
	Message.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("FAILED DELETE MESSAGE!");
		} else{
			req.flash("success", "Message deleted");
			res.redirect("/message");
		}
	});
});
	
//================================================================
//================= AUTHENTICATION ROUTE =========================
//================================================================
	
//REGISTER ROUTE
app.get("/register", function(req, res){
	res.render("register");
});	

//HANDLE SIGNUP LOGIC
app.post("/register", function(req, res){
	if(req.body.adminCode === process.env.SECRET_CODE){
		var newUser = {username: req.body.username, isAdmin: true};;
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash("error", "Failed register");
				return res.redirect("/register");
			} else{
				passport.authenticate("local")(req, res, function(){
					req.flash("success", "New user registered")
					res.redirect("/gallery"); 
				});
			}
		});
	} else{
		req.flash("error", "Wrong secret code");
		res.redirect("/register");
	}
});	
	
//LOGIN ROUTE
app.get("/login", function(req, res){
	res.render("login");
});	
	
//HANDLE LOGIN LOGIC
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/gallery",
		failureRedirect: "/login"
	}), function(req, res){
});
	
//LOGOUT
app.get("/logout", function(req, res){
	req.logout();
	req.flash("error", "Logged out")
	res.redirect("/gallery");
});

//USER PAGE
app.get("/user/:id", isLoggedIn, function(req, res){
	res.render("user");
});

//DESTROY USER
app.delete("/user/:id", isLoggedIn, function(req, res){
	req.logout();
	User.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("FAILED DELETE USER!");
		} else{
			req.flash("success", "User deleted");
			res.redirect("/gallery");
		}
	});
});


//MIDDLEWARE
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", "Login first");
	res.redirect("/login");
}

app.get("*", function(req, res){
	req.flash("error", "Invalid URL");
	res.redirect("/");
});

//SETUP SERVER
// app.listen(5000, function(){
// 	console.log("ThariqPhoto Server is Running!")
// });

//HEROKU LISTEN CONFIIG
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("ThariqPhoto Server is Running!");
});