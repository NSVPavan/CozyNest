const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res,next) => {
    try {
      let { email, username, password } = req.body;
      const newUser = new User({ email, username });
      let registeredUser = await User.register(newUser, password);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to cozynest!");
        res.redirect("/listings");
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
   req.flash("success",`Welcome back ${req.body.username}`);
   let redirectUrl = (res.locals.redirectUrl) || "/listings";
   console.log(redirectUrl);
   res.redirect(redirectUrl);
  })
);

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out");
    res.redirect("/listings");
  })
})
module.exports = router;
