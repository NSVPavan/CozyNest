const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review.js');
const wrapAsync =  require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {validateReviewSchema} = require('../middleware.js');
const {isLoggedIn} = require('../middleware.js');
//reviews
//review create route
router.post('/',isLoggedIn,validateReviewSchema,wrapAsync(async(req,res)=>{
    let id = req.params.id;
    let newReview = new Review(req.body.review);
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