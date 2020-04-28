var mongoose      = require("mongoose"),
    Campground=     require("./models/campground"),
    Comment=        require("./models/comment")

var data=[
    {
        name:"KHEERGANGA", 
        image:"https://static2.tripoto.com/media/filter/tst/img/74482/TripDocument/1451741585_21.jpg",
        description:"DescriptionA hill is a landform that extends above the surrounding terrain. It often has a distinct summit, although in areas with scarp or dip topography a hill may refer to the particular section of flat terrain without a massive summit"
    },
    {
        name:"MANALI", 
        image:"https://q-cf.bstatic.com/images/hotel/max1024x768/175/175214002.jpg",
        description:"DescriptionA hill is a landform that extends above the surrounding terrain. It often has a distinct summit, although in areas with scarp or dip topography a hill may refer to the particular section of flat terrain without a massive summit"
    },
    {
        name:"MECLEODGANJ", 
        image:"https://storage.googleapis.com/ehimages/2018/3/6/img_39b9d29d56957a465dd2475766b85e2d_1520370888407_processed_original.jpg",
        description:"DescriptionA hill is a landform that extends above the surrounding terrain. It often has a distinct summit, although in areas with scarp or dip topography a hill may refer to the particular section of flat terrain without a massive summit"
    }
]
function seedDB(){
    //remove all campground
Campground.deleteMany({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("removed campgrounds");
    // add a few campground
    data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log("added a new campground");
            // create a comment
            Comment.create(
                { 
                    text:"this place is great",
                    author:"aditi"
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    }else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log("created a new comment");
                    }
                });
            }
     });
    });
 });

}
module.exports= seedDB; 
  // add a few campground
//  data.forEach(function(seed){
//      Campground.create(seed, function(err, data){
//          if(err){
//              console.log(err);
//          }else{
//              console.log("added a new campground");
//          }
//      });
//  });
  //add a few comments



