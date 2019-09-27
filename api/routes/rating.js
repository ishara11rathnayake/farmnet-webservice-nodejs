const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const ratingController = require("../controllers/rating");

router.post(
  "/:userId&:ratedUserId&:ratingScore",
  checkAuth,
  ratingController.rating_rate_users
);

router.get("/:userId", checkAuth, ratingController.ratings_get_rating);

router.get(
  "/userrating/:userId&:ratedUserId",
  checkAuth,
  ratingController.ratings_get_rated_user_rating
);

module.exports = router;
