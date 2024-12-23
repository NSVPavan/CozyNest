const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//create route
module.exports.createReview = async (req, res) => {
  let id = req.params.id;
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  let listing = await Listing.findById(id);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added!");
  res.redirect(`/listings/${id}`);
};

//destroy route
module.exports.destroyReview = async (req, res) => {
  let { id: listingId, reviewId } = req.params;
  await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${listingId}`);
};
