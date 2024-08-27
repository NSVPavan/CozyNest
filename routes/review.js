const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review.js');
const wrapAsync =  require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {reviewSchema} = require('../schema.js');

//schema validation 
validateReviewSchema=function(req,res,next){
    console.log(req.body);
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//reviews
//review create route
router.post('/',validateReviewSchema,wrapAsync(async(req,res)=>{
    let id = req.params.id;
    let newReview = new Review(req.body.review);
    let listing =await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added!");
    res.redirect(`/listings/${id}`);
}))

//review destroy route
router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let {id:listingId,reviewId}=req.params;
    await Listing.findByIdAndUpdate(listingId,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${listingId}`);
}));

module.exports = router;