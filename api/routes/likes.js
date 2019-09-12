const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const LikeController = require("../controllers/likes");

router.get("/:productId", LikeController.likes_get_all);
router.post("/", LikeController.likes_create_like);
router.delete("/", LikeController.likes_delete_like);
router.delete("/:productId", LikeController.likes_delete_all_likes_of_product);

module.exports = router;
