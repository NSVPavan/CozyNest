const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/cozynest";

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

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
})

//show route
app.get('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/show.ejs",{listing});
})

//create route
app.post('/listings',async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    console.log("added successfully!");
    res.redirect('/listings');
})
