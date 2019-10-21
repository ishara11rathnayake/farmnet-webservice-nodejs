const mongoose = require("mongoose");

const Article = require("../models/article");
const User = require("../models/user");

exports.get_thumbnail_url = (req, res, next) => {
  res.status(200).json({
    url: req.file.path
  });
};

exports.articles_create_article = (req, res, next) => {
  User.findById(req.body.userId)
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
        const article = new Article({
          _id: new mongoose.Types.ObjectId(),
          userId: req.body.userId,
          articleTitle: req.body.articleTitle,
          content: req.body.content,
          thumbnailUrl: req.body.thumbnailUrl,
          date: new Date()
        });

        article
          .save()
          .then(results => {
            res.status(200).json({
              message: "Created article succesfully"
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
      res.status(500).json({ error: err });
    });
};

exports.articles_get_all_articles = (req, res, next) => {
  Article.find()
    .select("_id userId articleTitle content thumbnailUrl date")
    .populate("userId", "_id name profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        articles: docs.map(doc => {
          return {
            _id: doc._id,
            userId: doc.userId,
            articleTitle: doc.articleTitle,
            content: doc.content,
            thumbnailUrl: doc.thumbnailUrl,
            date: doc.date,
            request: {
              type: "GET",
              url:
                "https://farmnet-app-webservice.herokuapp.com/articles/" +
                doc._id
            }
          };
        })
      };
      if (docs.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found"
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

exports.articles_delete_article = (req, res, next) => {
  const id = req.params.articleId;
  const userId = req.params.userId;

  Article.findById(id)
    .select("userId")
    .exec()
    .then(results => {
      if (results.userId == userId) {
        Article.deleteOne({ _id: id })
          .exec()
          .then(results => {
            res.status(200).json({
              message: "Article deleted"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
          });
      } else {
        res.status(200).json({
          message: "You don't have permission to delete this article."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
