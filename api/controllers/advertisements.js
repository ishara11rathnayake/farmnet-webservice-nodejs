const Advertisement = require("../models/advertisement");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.advertisements_create_advertisement = (req, res, next) => {
  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else if (user.user_type != "Agri Service Provider") {
        return res.status(401).json({
          message: "You don't have permission to create advertisement."
        });
      }

      console.log(req.body);

      const advertisement = new Advertisement({
        _id: mongoose.Types.ObjectId(),
        adTitle: req.body.adTitle,
        adDescription: req.body.adDescription,
        price: req.body.price,
        hashtags: req.body.hashtags,
        contactNumber: req.body.contactNumber,
        date: new Date(),
        user: req.body.userId,
        adsImage: req.file.path
      });

      advertisement
        .save()
        .then(result => {
          res.status(201).json({
            message: "Advertisement were created",
            createdAdvertisement: {
              _id: result._id,
              adTitle: result.adTitle,
              hashtags: result.hashtags,
              user: result.userId,
              date: result.date
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/advertisements/" + result._id
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

exports.advertisements_get_all = (req, res, next) => {
  Advertisement.find()
    .select(
      "_id adTitle adDescription price adsImage contactNumber hashtags date user"
    )
    .populate("user", "_id name profileImage")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        advertisements: docs.map(doc => {
          return {
            _id: doc._id,
            adTitle: doc.adTitle,
            hashtags: doc.hashtags,
            adDescription: doc.adDescription,
            price: doc.price,
            date: doc.date,
            user: doc.user,
            adsImage: doc.adsImage,
            contactNumber: doc.contactNumber,
            request: {
              type: "GET",
              url: "http://localhost:3000/advertisements/" + doc._id
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

exports.advertisements_delete_advertisement = (res, req, next) => {
  const id = req.params.adsId;
  Advertisement.findById(id)
    .select("user")
    .populate("user", "_id")
    .exec()
    .then(result => {
      if (result.user._id != req.body.userId) {
        res.status(401).json({
          message: "You don't have permission to delete this advertisements."
        });
      } else {
        Advertisement.deleteOne({ _id: id })
          .exec()
          .then(result => {
            res.status(200).json({
              message: "Advertisement deleted",
              request: {
                type: "GET",
                description: "GET_ALL_Advertisement",
                url: "http://localhost:3000/advertisements/"
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

exports.advertisements_get_advertisement = (req, res, next) => {
  const id = req.params.adsId;
  Advertisement.findById(id)
    .select(
      "_id adTitle adDescription price adsImage contactNumber hashtags date user"
    )
    .populate("user", "_id name profileImage email")
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          advertisement: doc,
          request: {
            type: "GET",
            description: "GET_ALL_QUESTIONS",
            url: "http://localhost:3000/advertisements/"
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

exports.advertisements_update_advertisement = (req, res, next) => {
  const id = req.params.adsId;
  const updateOps = { adsImage: req.file.path };
  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }
  Advertisement.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Advertisement updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/advertisements/" + id
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

exports.advertisements_search_advertisement = (req, res, next) => {
  const searchText = req.params.searchText;
  const regex = new RegExp(escapeRegex(searchText), "gi");
  Advertisement.find({ $or: [{ hashtags: regex }, { adTitle: regex }] })
    .select(
      "_id adTitle adDescription price adsImage contactNumber hashtags date user"
    )
    .populate("user", "_id name profileImage")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        advertisements: docs.map(doc => {
          return {
            _id: doc._id,
            adTitle: doc.adTitle,
            hashtags: doc.hashtags,
            adDescription: doc.adDescription,
            price: doc.price,
            date: doc.date,
            user: doc.user,
            adsImage: doc.adsImage,
            contactNumber: doc.contactNumber,
            request: {
              type: "GET",
              url: "http://localhost:3000/advertisements/" + doc._id
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
