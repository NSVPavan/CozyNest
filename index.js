// Required dependencies
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

// Models and Utilities
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');

// Schema validation
const { listingSchema, reviewSchema } = require('./schema.js');

// Middleware and Engine setup
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

// Route Handlers
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

// Initialize express app
const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/cozynest";

// Set EJS as view engine and configure views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(express.static(path.join(__dirname, "/public"))); // Serves static files
app.use(methodOverride("_method")); // Override method for RESTful routes

// Connect to MongoDB
main().then(() => {
    console.log("Connection to database successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Start the server
app.listen(8080, () => {
    console.log('listening on port 8080');
});

//session creation
let sessionOptions ={
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

// Root Route
app.get('/', (req, res) => {
    res.send('Hi! This is the home page');
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
});

// Express Router for /listings
app.use("/listings", listings);

// Express Router for /reviews under specific listings
app.use("/listings/:id/reviews", reviews);

// Privacy Route (Yet to be built)
app.get('/privacy', (req, res) => {
    res.send('Yet to be built');
});

// Terms Route (Yet to be built)
app.get('/terms', (req, res) => {
    res.send('Yet to be built');
});

// Error Handling

// Handle non-existent routes (404)
app.get("*", (req, res, next) => {
    let err = new ExpressError("404", "Page Not Found!");
    next(err);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = "500", message = "Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});
