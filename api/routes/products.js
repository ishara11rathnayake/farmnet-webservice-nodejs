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
  console.log(req.file);
  console.log(req.productImage);
  console.log(
    "======================================================================================================================="
  );
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
  },
  fileFilter: fileFilter
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

module.exports = router;
