const mongoose = require("mongoose");
const Product = require("../models/product");
const Comment = require("../models/comment");
const User = require("../models/user");

exports.comments_get_all = (req, res, next) => {
  Comment.find({ product: req.params.productId })
    .select("product content user date _id")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        comments: docs.map(doc => {
          return {
            _id: doc._id,
            content: doc.content,
            product: doc.product,
            user: doc.user,
            date: doc.date,
            request: {
              type: "GET",
              url: "http://localhost:3000/comments/" + doc._id
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

exports.comments_create_comment = (req, res, next) => {
  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        content: req.body.content,
        date: Date.now(),
        postType: req.body.postType,
        product: req.body.productId,
        user: req.body.userId
      });
      return comment.save();
    })
    .then(result => {
      res.status(201).json({
        message: "succesfully commented on the product"
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
