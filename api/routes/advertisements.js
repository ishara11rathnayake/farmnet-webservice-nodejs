const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const multerGoogleStorage = require("multer-google-storage");

const AdvertisementController = require("../controllers/advertisements");

const storage = multerGoogleStorage.storageEngine({
  filename: function(req, file, cb) {
    cb(null, "advertisement/" + Date.now() + file.originalname);
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
});

// router.get("/", QuestionController.questions_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("adsImage"),
  AdvertisementController.advertisements_create_advertisement
);

// router.get("/:questionId", QuestionController.questions_get_question);

// router.delete(
//   "/:questionId",
//   checkAuth,
//   QuestionController.questions_delete_question
// );

// router.patch(
//   "/:questionId",
//   checkAuth,
//   QuestionController.questions_update_question
// );

module.exports = router;
