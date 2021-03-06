const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Product = require("../models/product");
const Article = require("../models/article");
const Advertisement = require("../models/advertisement");

const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

const storage = multerGoogleStorage.storageEngine({
  filename: function(req, file, cb) {
    cb(null, "profile/" + Date.now() + file.originalname);
  },
  bucket: "farmnet-bucket",
  projectId: "farmnet",
  keyFilename: "./api/helpers/farmnet-45e7c587b679.json",
  acl: "publicread",
  contentType: function(req, file) {
    return file.mimetype;
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
}).single("profileImage");

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
                res.status(201).json({
                  message: "User created",
                  userId: user._id,
                  userType: user.user_type,
                  name: user.name,
                  email: user.email,
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
            userType: user[0].user_type,
            name: user[0].name,
            email: user[0].email,
            profileImage: user[0].profileImage,
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
  let updateOps = {};
  upload(req, res, err => {
    if (req.file) {
      updateOps = {
        profileImage: req.file.path
      };
    }

    const id = req.params.userId;

    for (const [key, value] of Object.entries(req.body)) {
      updateOps[key] = value;
    }
    User.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User updated",
          name: result.name,
          email: result.email,
          profileImage: result.profileImage,
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
      if (doc) {
        if (doc.user_type === "Farmer") {
          get_deals_of_farmers(res, id, doc);
        } else if (doc.user_type === "Knowledge Provider") {
          get_article_of_knowledge_providers(res, id, doc);
        } else if (doc.user_type === "Agri Service Provider") {
          get_ads_of_service_provider(res, id, doc);
        } else {
          res.status(200).json({
            user: doc,
            request: {
              type: "GET",
              description: "GET_BUYER_DETAILS"
            }
          });
        }
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

exports.users_get_user_by_id = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select("_id name user_type profileImage")
    .exec()
    .then(doc => {
      res.status(200).json({
        user: doc
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.users_change_pasword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const userId = req.params.userId;

  User.findById(userId)
    .exec()
    .then(user => {
      bcrypt.compare(oldPassword, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        }
        if (result) {
          bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              User.updateOne({ _id: userId }, { $set: { password: hash } })
                .then(result => {
                  res.status(200).json({
                    message: "Password change successfully.",
                    statusCode: "200"
                  });
                })
                .catch(err => {
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        } else {
          return res.status(200).json({
            message: "Old password mismatch",
            statusCode: "409"
          });
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.users_search_user = (req, res, next) => {
  const searchText = req.query.searchText;
  const minRating = req.query.minRating;
  const regex = new RegExp(escapeRegex(searchText), "gi");

  const query = {
    $and: [
      { rating: { $gte: minRating } },
      { $or: [{ name: regex }, { email: regex }] }
    ]
  };

  User.find(query)
    .select("_id name user_type profileImage rating")
    .sort({ name: 1 })
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            user_type: doc.user_type,
            profileImage: doc.profileImage,
            rating: doc.rating,
            request: {
              type: "GET",
              url:
                "https://farmnet-app-webservice.herokuapp.com/user/" + doc._id
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

const escapeRegex = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const get_deals_of_farmers = async (res, userId, doc) => {
  try {
    const result = await Product.find({ user: userId })
      .select(
        "user name price _id productImage amount description location date timelineId latitude longitude likes"
      )
      .populate("user", "email name _id profileImage")
      .sort({ date: -1 });

    res.status(200).json({
      user: doc,
      deals: result,
      request: {
        type: "GET",
        description: "GET_USER"
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const get_article_of_knowledge_providers = async (res, userId, doc) => {
  try {
    const result = await Article.find({ userId: userId })
      .select("_id userId articleTitle content thumbnailUrl date")
      .populate("userId", "_id name profileImage")
      .sort({ date: -1 });

    res.status(200).json({
      user: doc,
      articles: result,
      request: {
        type: "GET",
        description: "GET_ARTICLE"
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const get_ads_of_service_provider = async (res, userId, doc) => {
  try {
    const result = await Advertisement.find({ user: userId })
      .select(
        "_id adTitle adDescription price adsImage contactNumber hashtags date user"
      )
      .populate("user", "_id name profileImage email")
      .sort({ date: -1 });

    res.status(200).json({
      user: doc,
      advertisements: result,
      request: {
        type: "GET",
        description: "GET_ADVERTISEMENTS"
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
