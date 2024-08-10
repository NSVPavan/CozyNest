const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const ejsMate= require('ejs-mate');
const methodeOverride = require('method-override');
const path = require('path');

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/cozynest";

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
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
app.get('/listings',async (req,res)=>{
    let all_listings = await Listing.find({});
    res.render("listings/index.ejs",{all_listings});
});

//new route
app.get('/listings/new',(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create route
app.post('/listings',async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    console.log("added successfully!");
    res.redirect('/listings');
});

//edit route
app.get('/listings/:id/edit',async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    console.log(req.params);
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update route
app.put('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//destroy route
app.delete('/listings/:id',async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})