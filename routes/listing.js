const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync =  require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');
const {isLoggedIn} = require('../middleware.js');
//schema validation 
validateListingSchema=function(req,res,next){
    console.log(req.body);
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//index route
router.get('/',wrapAsync(async (req,res)=>{
    let all_listings = await Listing.find({});
    res.render("listings/index.ejs",{all_listings});
}));

//new route
router.get('/new',isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get('/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","404! Listing not found.");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post('/',isLoggedIn,validateListingSchema,wrapAsync(async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    console.log("added successfully!");
    req.flash("success","New listing is added!");
    res.redirect('/listings');
}));

//edit route
router.get('/:id/edit',isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","404! Listing not found.");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put('/:id',isLoggedIn,validateListingSchema,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing edited!");
    res.redirect(`/listings/${id}`);
}));

//destroy route
router.delete('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!")
    res.redirect("/listings");
}));

module.exports = router;