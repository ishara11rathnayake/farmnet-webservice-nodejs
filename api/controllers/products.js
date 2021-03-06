const Product = require("../models/product");
const mongoose = require("mongoose");
const User = require("../models/user");

const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

const storage = multerGoogleStorage.storageEngine({
  filename: function(req, file, cb) {
    cb(null, "product/" + Date.now() + file.originalname);
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
}).single("productImage");

exports.products_get_all = (req, res, next) => {
  const userId = req.query.userId;
  Product.find()
    .select(
      "user name price _id productImage amount description location date timelineId latitude longitude likes"
    )
    .populate("user", "email name _id profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          const like = doc.likes.includes(userId);
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            amount: doc.amount,
            description: doc.description,
            location: doc.location,
            date: doc.date,
            user: doc.user,
            productImage: doc.productImage,
            timelineId: doc.timelineId,
            latitude: doc.latitude,
            longitude: doc.longitude,
            like: like,
            likeCount: doc.likes.length,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
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

exports.products_create_product = (req, res, next) => {
  console.log(req.body.userId);
  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        location: req.body.location,
        description: req.body.description,
        date: new Date(),
        user: req.body.userId,
        productImage: req.file.path,
        timelineId: req.body.timelineId,
        latitude: req.body.latitude,
        longitude: req.body.longitude
      });

      product
        .save()
        .then(result => {
          User.findById(result.user)
            .exec()
            .then(doc => {
              res.status(201).json({
                message: "Created product succesfully",
                userName: doc,
                productId: result._id,
                date: result.date,
                user: result.user,
                name: result.name,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/products/" + result._id
                }
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
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id amount description location")
    .exec()
    .then(doc => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "GET_ALL_PRODUCTS",
            url: "http://localhost:3000/products/"
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

/**
 * update product
 */
exports.products_update_product = (req, res, next) => {
  let updateOps = {};

  upload(req, res, err => {
    if (req.file) {
      updateOps = {
        profileImage: req.file.path
      };
    }

    const id = req.params.productId;

    for (const [key, value] of Object.entries(req.body)) {
      updateOps[key] = value;
    }

    Product.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Product updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + id
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

/**
 * delete product
 */
exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products/",
          body: { name: "String", price: "Number" }
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

exports.products_search_product = (req, res, next) => {
  const searchText = req.params.searchText;
  const regex = new RegExp(escapeRegex(searchText), "gi");
  const userId = req.userData.userId;
  Product.find({ $or: [{ name: regex }, { location: regex }] })
    .select(
      "user name price _id productImage amount description location date timelineId latitude longitude likes"
    )
    .populate("user", "email name _id profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          const like = doc.likes.includes(userId);
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            amount: doc.amount,
            description: doc.description,
            location: doc.location,
            date: doc.date,
            user: doc.user,
            productImage: doc.productImage,
            timelineId: doc.timelineId,
            latitude: doc.latitude,
            longitude: doc.longitude,
            like: like,
            likeCount: doc.likes.length,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
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

exports.products_filter_product = (req, res, next) => {
  const maxPice = req.query.maxprice;
  const minPice = req.query.minprice;
  const maxAmount = req.query.maxAmount;
  const minAmount = req.query.minAmount;
  const userId = req.userData.userId;

  let query = {};
  if (maxPice != 0 && minPice != 0 && maxAmount != 0 && minAmount != 0) {
    query = {
      $and: [
        { price: { $gt: minPice, $lt: maxPice } },
        { amount: { $gt: minAmount, $lt: maxAmount } }
      ]
    };
  } else if (maxPice != 0 && minPice != 0) {
    query = { price: { $gt: minPice, $lt: maxPice } };
  } else if (maxAmount != 0 && minAmount != 0) {
    query = { amount: { $gt: minAmount, $lt: maxAmount } };
  }

  Product.find(query)
    .select(
      "user name price _id productImage amount description location date timelineId latitude longitude likes"
    )
    .populate("user", "email name _id profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          const like = doc.likes.includes(userId);
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            amount: doc.amount,
            description: doc.description,
            location: doc.location,
            date: doc.date,
            user: doc.user,
            productImage: doc.productImage,
            timelineId: doc.timelineId,
            latitude: doc.latitude,
            longitude: doc.longitude,
            like: like,
            likeCount: doc.likes.length,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
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

const escapeRegex = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.products_add_like = (req, res, next) => {
  const productId = req.query.productId;
  const userId = req.query.userId;
  Product.findById(productId)
    .exec()
    .then(result => {
      if (result) {
        let alreadyliked = result.likes.includes(userId);
        console.log(alreadyliked);
        let likes = [];
        if (!alreadyliked) {
          console.log(userId);
          likes = result.likes;
          likes.push(userId);
        } else {
          likes = result.likes.filter(like => {
            return like != userId;
          });
        }
        console.log(likes);
        Product.updateOne({ _id: productId }, { $set: { likes: likes } })
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
          message: "Product not found."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
