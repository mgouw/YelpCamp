let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let middleware = require("../middleware/index.js");
//add all routes to router 

//INDEX route - show all campgrounds
router.get("/", function(req, res) {
	//res.render("campgrounds", {campgrounds: campgrounds});

	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

//CREATE Route - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name: name, price: price, image: image, description: desc, author: author}
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});

});

//NEW - show form to create new database
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");

});

//SHOW Route - shows campground information based on campground id
router.get("/:id", function(req, res) {
	//find campground with ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUNDS ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	//is user logged in
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
}); 

// UPDATE CAMPGROUND ROUTE 
router.put("/:id", function(req, res) {
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect somewhere (show page)
});

//DESTROY CAMPGROUND ROUTE 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;