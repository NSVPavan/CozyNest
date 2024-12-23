const User = require("../models/user.js");
//get request for signup
module.exports.signupPage = (req, res) => {
  res.render("users/signup.ejs");
};

//post request for signup
module.exports.signup = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to cozynest!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//get request for login page
module.exports.loginPage = (req, res) => {
  res.render("users/login.ejs");
};

//post request for login page
module.exports.login = async (req, res) => {
  req.flash("success", `Welcome back ${req.body.username}`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  console.log(redirectUrl);
  res.redirect(redirectUrl);
};

//logout route
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
