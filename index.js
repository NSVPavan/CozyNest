const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/cozynest";

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
})

app.get('/',(req,res)=>{
    res.send('Hi! this the home page');
})

app.get('/testListing',async (req,res)=>{
    let sampleListing = new Listing({
        title: "Heaven",
        description: "Literally the heaven",
        price : 1500,
        location: "Swarg",
        country: "India"
    });
    await sampleListing.save();
    console.log("Sample listing saved");
    res.send("Done creating test listing");
})