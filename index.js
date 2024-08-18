const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const ejsMate= require('ejs-mate');
const methodeOverride = require('method-override');
const wrapAsync =  require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
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

app.listen(8080,()=>{
    console.log('listening on port 8080');
});

app.get('/',(req,res)=>{
    res.send('Hi! this the home page');
});

//index route
app.get('/listings',wrapAsync(async (req,res)=>{
    let all_listings = await Listing.find({});
    res.render("listings/index.ejs",{all_listings});
}));

//new route
app.get('/listings/new',(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get('/listings/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//create route
app.post('/listings',wrapAsync(async(req,res)=>{
    if(!req.body.listing) throw (new ExpressError("400","Send valid data"));
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    console.log("added successfully!");
    res.redirect('/listings');
}));

//edit route
app.get('/listings/:id/edit',wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put('/listings/:id',wrapAsync(async(req,res)=>{
    if(!req.body.listing) throw (new ExpressError("400","Send valid data"));
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//destroy route
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//privacy 
app.get('/privacy',(req,res)=>{
    res.send('Yet to be built');
});

//terms 
app.get('/terms',(req,res)=>{
    res.send('Yet to be built');
});

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