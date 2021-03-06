const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");
const multerGoogleStorage = require("multer-google-storage");

const articleController = require("../controllers/article");

const storage = multerGoogleStorage.storageEngine({
  filename: function(req, file, cb) {
    cb(null, "article/" + Date.now() + file.originalname);
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

router.post(
  "/thumbnails",
  checkAuth,
  upload.single("thumbnail"),
  articleController.get_thumbnail_url
);

router.post("/", checkAuth, articleController.articles_create_article);

router.get("/", articleController.articles_get_all_articles);

router.delete(
  "/:articleId&:userId",
  checkAuth,
  articleController.articles_delete_article
);

module.exports = router;
