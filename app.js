var express                = require("express"),
    app                    = express(),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    Campground             = require("./models/campground.js"),
    Comment                = require("./models/comment.js"),
    flash                  =require("connect-flash"),
    methodOverride         =require("method-override"),
    User                   = require("./models/user.js"),
    // seedDB        = require("./seeds")

 // requring routes   
    commentRoutes     = require("./routes/comments.js"),
    campgroundRoutes   = require("./routes/campgrounds.js"),
    authRoutes         = require("./routes/auth.js")


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seed database
// seedDB();    

// passport config
app.use(require("express-session")({
    secret: "this camp is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();

});


app.use("/", authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000, function () {
    console.log("the YelpCamp has started");
});
