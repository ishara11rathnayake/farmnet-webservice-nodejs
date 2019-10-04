const Product = require("../models/product");
const mongoose = require("mongoose");
const User = require("../models/user");

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select(
      "user name price _id productImage amount description location date timelineId"
    )
    .populate("user", "email name _id profileImage")
    .sort({ date: -1 })
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
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
        timelineId: req.body.timelineId
      });

      product
        .save()
        .then(result => {
          res.status(201).json({
            message: "Created product succesfully",
            createdProduct: {
              name: result.name,
              price: result.price,
              _id: result._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/products/" + result._id
              }
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

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  console.log(req.body);
  const updateOps = {
    productImage: req.file.path
  };
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
};

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
