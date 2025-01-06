const Listing = require("../models/listing.js");

//index route
module.exports.index = async (req, res) => {
  let all_listings = await Listing.find({});
  res.render("listings/index.ejs", { all_listings });
};

//new route
module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

//show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "404! Listing not found.");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//create route
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image.url=url;
  newListing.image.filename=filename;
  await newListing.save();
  req.flash("success", "New listing is added!");
  res.redirect("/listings");
};

//edit route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let original_image_url=listing.image.url;
  original_image_url=original_image_url.replace("/upload","/upload/h_300");
  if (!listing) {
    req.flash("error", "404! Listing not found.");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing,original_image_url });
};

//update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    let image={url,filename};
    await Listing.findByIdAndUpdate(id,{image});
  }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing edited!");
  res.redirect(`/listings/${id}`);
};

//destroy route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
