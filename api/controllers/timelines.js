const mongoose = require("mongoose");

const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

const Timeline = require("../models/timeline");
const { TaskModel, Task } = require("../models/timelinetask");
const User = require("../models/user");

const storage = multerGoogleStorage.storageEngine({
  filename: function(req, file, cb) {
    cb(null, "timeline/" + Date.now() + file.originalname);
  },
  bucket: "farmnet-bucket",
  projectId: "farmnet",
  keyFilename: "./api/helpers/farmnet-45e7c587b679.json",
  acl: "publicread",
  contentType: function(req, file) {
    return file.mimetype;
  }
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
}).single("timelineImage");

exports.timelines_create_timeline = (req, res, next) => {
  User.findById(req.body.userId)
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      } else {
        const task = new TaskModel({
          _id: new mongoose.Types.ObjectId(),
          content: "Timeline created for " + req.body.productName,
          date: new Date()
        });

        const tasks = [task];

        const timeline = new Timeline({
          _id: new mongoose.Types.ObjectId(),
          userId: req.body.userId,
          productName: req.body.productName,
          description: req.body.description,
          tasks: tasks,
          date: new Date()
        });

        timeline
          .save()
          .then(results => {
            res.status(200).json({
              message: "Created timeline succesfully"
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

exports.timelines_get_timelines_by_user = (req, res, next) => {
  const id = req.params.userId;
  Timeline.find({ userId: id })
    .populate("userId", "email name _id profileImage")
    .exec()
    .then(docs => {
      res.status(200).json({
        timelines: docs
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.timelines_add_new_task = (req, res, next) => {
  id = req.params.timelineId;
  console.log(req.params.timelineId);
  Timeline.findById(id)
    .select("tasks")
    .exec()
    .then(timeline => {
      if (!timeline) {
        return res.status(404).json({
          message: "Timeline not found"
        });
      } else {
        upload(req, res, err => {
          const task = new TaskModel({
            _id: new mongoose.Types.ObjectId(),
            content: req.body.content,
            date: new Date()
          });

          if (req.file) {
            task = new TaskModel({
              _id: new mongoose.Types.ObjectId(),
              content: req.body.content,
              imageUrl: req.file.path,
              date: new Date()
            });
          }

          Timeline.updateOne({ _id: id }, { $push: { tasks: task } })
            .exec()
            .then(results => {
              res.status(200).json({
                message: "Timeline successfully updated"
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ error: err });
            });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
