const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

const UserController = require("../controllers/user");

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

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete_user);

router.patch("/:userId", checkAuth, UserController.users_update_user);

router.get("/:userId", checkAuth, UserController.users_get_user);

router.patch("/rate/:userId", checkAuth, UserController.users_rate_user);

module.exports = router;
