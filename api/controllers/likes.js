const mongoose = require("mongoose");
const Product = require("../models/product");
const Like = require("../models/like");
const User = require("../models/user");

exports.likes_get_all = (req, res, next) => {
  Like.find({ product: req.params.productId })
    .select("product user date _id")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        likes: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            user: doc.user,
            date: doc.date,
            request: {
              type: "GET",
              url: "http://localhost:3000/likes/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.likes_create_like = (req, res, next) => {
  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const like = new Like({
        _id: new mongoose.Types.ObjectId(),
        date: Date.now(),
        postType: req.body.postType,
        product: req.body.productId,
        user: req.body.userId
      });

      like
        .save()
        .then(result => {
          res.status(201).json({
            message: "succesfully liked the product"
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.likes_delete_like = (req, res, next) => {
  Like.deleteOne({ product: req.body.productId, user: req.body.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Like deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/likes/"
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.likes_delete_all_likes_of_product = (req, res, next) => {
  Like.deleteMany({ product: req.params.productId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "deleted all likes related to product",
        request: {
          type: "POST",
          url: "http://localhost:3000/likes/"
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
