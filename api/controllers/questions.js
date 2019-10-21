const Question = require("../models/question");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.questions_get_all = (req, res, next) => {
  Question.find()
    .select("_id question description hashtags date user numberOfAnswers")
    .populate("user", "_id name profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        questions: docs.map(doc => {
          return {
            _id: doc._id,
            question: doc.question,
            description: doc.description,
            hashtags: doc.hashtags,
            date: doc.date,
            user: doc.user,
            numberOfAnswers: doc.numberOfAnswers,
            request: {
              type: "GET",
              url: "http://localhost:3000/questions/" + doc._id
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

exports.questions_create_question = (req, res, next) => {
  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const question = new Question({
        _id: mongoose.Types.ObjectId(),
        question: req.body.question,
        description: req.body.description,
        hashtags: req.body.hashtags,
        date: new Date(),
        user: req.body.userId
      });

      question
        .save()
        .then(result => {
          res.status(201).json({
            message: "Question were created",
            createdQusetion: {
              _id: result._id,
              question: result.question,
              description: result.description,
              hashtags: result.hashtags,
              user: result.userId,
              date: result.date,
              numberOfAnswers: result.numberOfAnswers
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/questions/" + result._id
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.questions_get_question = (req, res, next) => {
  const id = req.params.questionId;
  Question.findById(id)
    .select("_id question description hashtags date user numberOfAnswers")
    .populate("user", "_id name profileImage")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          question: doc,
          request: {
            type: "GET",
            description: "GET_ALL_QUESTIONS",
            url: "http://localhost:3000/questions/"
          }
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.questions_update_question = (req, res, next) => {
  const id = req.params.questionId;
  const updateOps = {};
  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }
  Question.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Question updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/questions/" + id
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

exports.questions_delete_question = (req, res, next) => {
  const id = req.params.questionId;
  const userId = req.params.userId;
  Question.findById(id)
    .select("user")
    .populate("user", "_id")
    .exec()
    .then(result => {
      if (result.user._id != userId) {
        res.status(200).json({
          message: "You don't have permission to delete this question."
        });
      } else {
        Question.deleteOne({ _id: id })
          .exec()
          .then(result => {
            res.status(200).json({
              message: "Question deleted",
              request: {
                type: "GET",
                description: "GET_ALL_QUESTIONS",
                url: "http://localhost:3000/questions/"
              }
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

exports.quetions_search_question = (req, res, next) => {
  const searchText = req.params.searchText;
  const regex = new RegExp(escapeRegex(searchText), "gi");
  Question.find({ $or: [{ hashtags: regex }, { question: regex }] })
    .select("_id question description hashtags date user numberOfAnswers")
    .populate("user", "_id name profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        questions: docs.map(doc => {
          return {
            _id: doc._id,
            question: doc.question,
            description: doc.description,
            hashtags: doc.hashtags,
            date: doc.date,
            user: doc.user,
            numberOfAnswers: doc.numberOfAnswers,
            request: {
              type: "GET",
              url: "http://localhost:3000/questions/" + doc._id
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

exports.questions_increase_no_of_answers = (req, res, next) => {
  const id = req.params.questionId;
  Question.findById(id)
    .exec()
    .then(result => {
      if (result) {
        let noOfAnswers = result.numberOfAnswers + 1;
        Question.updateOne(
          { _id: id },
          { $set: { numberOfAnswers: noOfAnswers } }
        )
          .then(doc => {
            res.status(200).json({
              message: "updated successfully"
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      } else {
        res.status(404).json({
          message: "Question not found."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

const escapeRegex = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.questions_get_questions_by_userId = (req, res, next) => {
  const userId = req.params.userId;
  Question.find({ user: userId })
    .select("_id question description hashtags date user numberOfAnswers")
    .populate("user", "_id name profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        questions: docs.map(doc => {
          return {
            _id: doc._id,
            question: doc.question,
            description: doc.description,
            hashtags: doc.hashtags,
            date: doc.date,
            user: doc.user,
            numberOfAnswers: doc.numberOfAnswers,
            request: {
              type: "GET",
              url: "http://localhost:3000/questions/" + doc._id
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

exports.questions_get_paginate_question = (req, res, next) => {
  const query = {};
  const options = {
    select: "_id question description hashtags date user numberOfAnswers",
    populate: "user",
    lean: true,
    page: 1,
    limit: 2
  };
  Question.paginate(query, options)
    .then(result => {
      res.status(200).json({
        doc: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
