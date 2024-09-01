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

getRandomOwner = function(){
  let owners = ["66d1fee3938d5e1afd8c5b8c","66d1fcf616bd75824d40b53e","66cf9053dc5fbd26cef9a69c","66d4481119aa4350248ed516"];
  return owners[Math.floor(Math.random()*(4))];
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj,owner: getRandomOwner()}));
    await Listing.insertMany(initData.data);
    console.log("Data initialized");
};

initDB();