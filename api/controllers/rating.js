const mongoose = require("mongoose");

const User = require("../models/user");
const Rating = require("../models/rating");

exports.rating_rate_users = (req, res, next) => {
  const userId = req.params.userId;
  const ratedUserId = req.params.ratedUserId;
  const rating = req.params.ratingScore;

  Rating.find({ userId: userId, ratedUserId: ratedUserId })
    .select("_id")
    .exec()
    .then(results => {
      if (results.length != 0) {
        Rating.updateOne(
          { _id: results[0]._id },
          { $set: { ratingScore: rating } }
        )
          .exec()
          .then(results => {
            res.status(200).json({
              message: "Successfully rated."
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      } else {
        const ratingObject = new Rating({
          _id: new mongoose.Types.ObjectId(),
          userId: userId,
          ratedUserId: ratedUserId,
          ratingScore: rating
        });

        ratingObject
          .save()
          .then(results => {
            res.status(200).json({
              message: "Successfully rated."
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.ratings_get_rating = (req, res, next) => {
  const id = req.params.userId;
  Rating.find({ userId: id })
    .then(results => {
      let sum = 0;
      const count = results.length;
      results.forEach(item => {
        sum += item.ratingScore;
      });
      res.status(200).json({
        userId: id,
        ratingScore: sum / count
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.ratings_get_rated_user_rating = (req, res, next) => {
  const userId = req.params.userId;
  const ratedUserId = req.params.ratedUserId;
  Rating.find({ userId: userId, ratedUserId: ratedUserId })
    .select("ratingScore")
    .exec()
    .then(results => {
      if (results.length != 0) {
        res.status(200).json({
          ratingScore: results[0].ratingScore
        });
      } else {
        res.status(200).json({
          ratingScore: 0.0
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
