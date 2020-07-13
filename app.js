let express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds")

//requiring routes 
let commentRoutes = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		authRoutes = require("./routes/index")

mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
//mongoose.connect("mongodb://localhost/yelp_camp_v11");
mongoose.connect("mongodb+srv://mgouw:Speedy@cluster0.mdapz.mongodb.net/yelpcamp?retryWrites=true&w=majority")
.then(() => {
	console.log("connected to db");
}).catch (err => {
	console.log("ERROR", err.message);
});

process.env.databaseURL

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database 

//PASSPORT Configuration
app.use(require("express-session")({
	secret: "mongeese",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//so all pages can get vars
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("The YelpCamp server has started");
});