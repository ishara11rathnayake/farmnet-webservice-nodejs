const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const multerGoogleStorage = require("multer-google-storage");

const ProductController = require("../controllers/products");

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

router.get("/", ProductController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.products_create_product
);

router.get("/:productId", ProductController.products_get_product);

router.patch(
  "/:productId",
  checkAuth,
  ProductController.products_update_product
);

router.delete(
  "/:productId",
  checkAuth,
  ProductController.products_delete_product
);

router.get(
  "/search/:searchText",
  checkAuth,
  ProductController.products_search_product
);

router.get(
  "/filter/bypriceandamount",
  checkAuth,
  ProductController.products_filter_product
);

router.patch("/like/like", checkAuth, ProductController.products_add_like);

module.exports = router;
