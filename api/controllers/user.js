const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Product = require("../models/product");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already used"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              name: req.body.name,
              password: hash,
              user_type: req.body.user_type
            });

            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "60d"
              }
            );

            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  userId: user._id,
                  name: user.name,
                  token: token
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "60d"
            }
          );
          return res.status(200).json({
            userId: user[0]._id,
            message: "Auth successful",
            token: token
          });
        }

        res.status(401).json({
          message: "Auth failed"
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

exports.user_delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.users_update_user = (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {
    profileImage: req.file.path
  };
  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }
  User.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/users/" + id
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

exports.users_get_user = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select(
      "_id email name user_type profileImage address contactNumber nic dob rating"
    )
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        Product.find({ user: id })
          .select(
            "user name price _id productImage amount description location date"
          )
          .populate("user", "email name _id profileImage")
          .exec()
          .then(result => {
            res.status(200).json({
              user: doc,
              product: result,
              request: {
                type: "GET",
                description: "GET_USER"
              }
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
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
