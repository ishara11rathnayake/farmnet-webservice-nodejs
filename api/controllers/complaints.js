const mongoose = require("mongoose");

const Complaint = require("../models/complaint");

exports.complaints_create_conplaint = (req, res, next) => {
  const complaint = new Complaint({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    complainedUserId: req.body.complainedUserId,
    content: req.body.content,
    date: Date.now()
  });

  complaint
    .save()
    .then(results => {
      res.status(200).json({
        message: "We got your complaint. We will check it ASAP."
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
