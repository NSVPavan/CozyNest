const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ejsMate= require('ejs-mate');
const methodeOverride = require('method-override');
const wrapAsync =  require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');
const {reviewSchema} = require('./schema.js');
const listings =require('./routes/listing.js');
const path = require('path');

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/cozynest";

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodeOverride("_method"));
app.engine("ejs",ejsMate);

main().
then(()=>{
    console.log("Connection to database successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

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

app.listen(8080,()=>{
    console.log('listening on port 8080');
});

app.get('/',(req,res)=>{
    res.send('Hi! this the home page');
});

//express router for /listings
app.use("/listings",listings)

//privacy 
app.get('/privacy',(req,res)=>{
    res.send('Yet to be built');
});

//terms 
app.get('/terms',(req,res)=>{
    res.send('Yet to be built');
});

//reviews
//review create route
app.post('/listings/:id/reviews',validateReviewSchema,wrapAsync(async(req,res)=>{
    let id = req.params.id;
    let newReview = new Review(req.body.review);
    let listing =await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}))

//review destroy route
app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async(req,res)=>{
    let {id:listingId,reviewId}=req.params;
    await Listing.findByIdAndUpdate(listingId,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${listingId}`);
}));

//path does not exist error
app.get("*",(req,res,next)=>{
    let err= new ExpressError("404","Page Not Found!");
    next(err);
})
//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode="500",message="Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
})