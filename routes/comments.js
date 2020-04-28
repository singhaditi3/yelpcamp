var express = require("express");
var router  = express.Router({mergeParams:true});
var Campground= require("../models/campground");
var Comment= require("../models/comment");

// ========================
//comments routes
//=========================
router.get("/new", isLoggedIn,  function (req, res) {
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new.ejs", { campground: campground });
        }
    });
});
// create route
router.post("/", isLoggedIn, function (req, res) {
    //lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to connect
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment  
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success", "comment added successfully");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
//comments edit route
router.get("/:comment_id/edit",checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
res.render("comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        } 
       });
}); 
//comment update
router.put("/:comment_id", checkCommentOwnership,  function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updateComment){
      if(err){
          res.redirect("back");
      }else{
          res.redirect("campgrounds/" + req.params.id);
      }
   });
});
//comment destroy route
router.delete("/:comment_id",checkCommentOwnership, function(req, res){
    //findbyidandremove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "comment deleted");
            res.redirect("/campgrounds" + req.params.id);
        }
    });
});
//middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }  
    req.flash("error","please login first");
    res.redirect("/login");
}
//adding authorization
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back"); 
 
                }
            }
        });

    } else {
        res.redirect("back");
    }
}
module.exports=router;