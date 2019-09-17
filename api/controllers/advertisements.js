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
        return res.status(500).json({
          message: "You don't have permission to delete thise advertisement."
        });
      }

      const advertisement = new Advertisement({
        _id: mongoose.Types.ObjectId(),
        description: req.body.description,
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
              description: result.description,
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
