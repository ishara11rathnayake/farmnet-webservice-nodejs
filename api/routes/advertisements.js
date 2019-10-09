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
    fileSize: 1024 * 1024 * 10
  }
});

router.get("/", AdvertisementController.advertisements_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("adsImage"),
  AdvertisementController.advertisements_create_advertisement
);

router.get("/:adsId", AdvertisementController.advertisements_get_advertisement);

router.delete(
  "/:adsId",
  checkAuth,
  AdvertisementController.advertisements_delete_advertisement
);

router.patch(
  "/:adsId",
  checkAuth,
  upload.single("adsImage"),
  AdvertisementController.advertisements_update_advertisement
);

router.get(
  "/search/:searchText",
  checkAuth,
  AdvertisementController.advertisements_search_advertisement
);

// router.get("/get/:userId", AdvertisementController.advertisements_get_test);

module.exports = router;
