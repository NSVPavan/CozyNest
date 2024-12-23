const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

const { validateReviewSchema } = require("../middleware.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//reviews
//review create route
router.post(
  "/",
  isLoggedIn,
  validateReviewSchema,
  wrapAsync(reviewController.createReview)
);

//review destroy route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
