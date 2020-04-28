var express = require("express");
var router  = express.Router(); 
var passport  = require("passport");
var  User          = require("../models/user");



router.get("/", function (req, res){ 
    res.render("landing.ejs");
});



//==============
//auth routes
//==============
router.get("/register", function(req, res){
    res.render("register.ejs");
});
//handel sign up
router.post("/register", function(req, res){
    var newUser= new User({username: req.body.username});
    User.register(newUser,req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "successfully signed up! Welcome to Yelpcamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});
// show login form
router.get("/login", function(req, res){
    res.render("login.ejs");
});
// login logic
router.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}) , function(req, res){
});
// log out route
router.get("/logout",function(req, res){
    req.logout(); 
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }  
    req.flash("error","please login first");
    res.redirect("/login");
}
module.exports=router;