const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user.js');
const wrapAsync =  require('../utils/wrapAsync.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

module.exports = router;