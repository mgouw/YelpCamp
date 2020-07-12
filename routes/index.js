let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");

//route route 
router.get("/", function(req, res) {
	res.render("landing");
});

//AUTH ROUTES 

//show register form
router.get("/register", function(req, res) {
	res.render("register");
});

//handle signup logic
router.post("/register", function(req, res) {
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", `Welcome to YelpCamp ${user.username}`);
			res.redirect("/campgrounds");
		});
	});
});

//show login form 
router.get("/login", function(req, res) {
	res.render("login");
});

//handle login logic
//user is presumed to exist 
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
	 	failureRedirect: "/login"
	}), function(req, res) {	
});

//logout route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/campgrounds");
});

module.exports = router;