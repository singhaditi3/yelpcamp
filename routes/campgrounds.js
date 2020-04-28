var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");



//==============
//campground routes
//============== 

//index -show all campgrounds
router.get("/", function (req, res) {
    // get allcampgrounds from db 
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs", { campgrounds: allcampgrounds });
        }
    });
});

//create- add campgrounds to database
router.post("/", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price =req.body.price;
    var image = req.body.image;
    var desc = req.body.description;

    var author = {
        id:     req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author, price:price}

    
    //create a new campground and save to db
    Campground.create(newCampground, function (err, respp) {
        if (err) {
            console.log("error");
        } else {
            //redirect back to campgrounds page
            console.log(respp);
            res.redirect("/campgrounds");
        }
    });

});

//new- show form to create new campground
router.get("/new",isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});
// show- shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
            console.log("error at show");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show.ejs", { campground: foundCampground });
        }
    });
});
//edit campground route
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
             if(err){
                 res.redirect("/campgrounds")
             } else{
                res.render("campgrounds/edit.ejs", {campground: foundCampground });

             }

        });
    }); 
//update campground route
router.put("/:id",checkCampgroundOwnership, function(req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //redirect on show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});
//destroy campground routes
router.delete("/:id",checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/campgrounds");

        } else {
            res.redirect("/campgrounds");
        }
    });

});
//middleware
//checking login
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","you need to be logged in first");
    res.redirect("/login");
}
//adding authorization
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                //does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "permission denied");
                    res.redirect("back");

                }
            }
        });

    } else {
        res.redirect("back");
    }
}
module.exports = router;