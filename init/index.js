const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');
const MONGO_URL = "mongodb://127.0.0.1:27017/cozynest";

main().
then(()=>{
    console.log("Connection to database successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data initialized");
};

initDB();