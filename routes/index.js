var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const listings = require("./models/listing")
const review = require("./models/review")
const initDb = require("./init/initdb")
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError")
const {listingsSchema,reviewSchema}=require("../schema")
const Joi = require('../schema');
const app = require('../app');
const session = require('express-session');
const flash = require('connect-flash')



const sessionOptions = {
  secret: "mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};



router.use(session(sessionOptions));
router.use(flash());




const validateListing =(req,res,next)=>{
     let {error} =listingsSchema.validate(req.body);
  if(error){
    let errmsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg)
  } else {
    next();

  }
}

const validateReview =(req,res,next)=>{
   let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  } else {
    next();
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.use((req,res,next)=>{
  res.locals.success= req.flash("success");
  next();
})
 /* listings */
router.get("/listings",wrapAsync(async (req,res)=>{
 const allListings = await listings.find({});
 res.render("./listing/index",{allListings});
}));
/* New Route */
router.get("/listings/new",(req,res)=>{
  res.render("./listing/new")
});


/* show route */
router.get("/listings/:id",wrapAsync(async (req,res)=>{
  let {id}= req.params;
  const listingdata = await listings.findById(id);
  res.render("./listing/show",{listingdata});
}));

/* create route */
router.post('/listings',validateListing,wrapAsync(async(req,res,next)=> {
    const newlistings = new listings({
    title:req.body.title,
    price:req.body.price,
    location:req.body.location,
    country:req.body.country,
    image:req.body.image,
    description:req.body.description
  })
  await newlistings.save();
  req.flash("success", "succesfully created new listing");
  res.redirect("/listings")
}));


/* edit route */

router.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
  let {id}= req.params;
  const listingdata = await listings.findById(id);
  res.render("./listing/edit",{listingdata});
}));

/* update */
router.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
    throw new ExpressError(404,"Send Valid data for listing");
  };
  let {id}=req.params;
  await listings.findByIdAndUpdate(id,{...
  {title:req.body.title,
  price:req.body.price,
  location:req.body.location,
  country:req.body.country,
  image:req.body.image,
  description:req.body.description}
  });
  res.redirect("/listings")
}));

//post request
//review form
router.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
  let listing = await listings.findById(req.params.id)
  let newReview = new review(req.body.review);

  listing.review.push(newReview);
  await newReview.save();
  await listing.save();

  console.log("new review saved");
  res.redirect(`/listings/${listing._id}`);
}));


/*  Delete */
router.delete("/listings/:id",wrapAsync(async (req,res)=>{
  let {id}= req.params;
  const delist = await listings.findByIdAndDelete(id);
  res.redirect("/listings")
}));

/* handling error */ 

router.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found!"))
})
/* error handling middleware */

router.use((err,req,res,next)=>{
  let{status=500,message="Something went wrong!"}= err;
  res.status(status).render("../views/error",{err});
})



module.exports = router;
