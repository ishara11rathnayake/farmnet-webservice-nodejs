const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const commentsController = require("../controllers/comments");

router.get("/:productId", commentsController.comments_get_all);
router.post("/", commentsController.comments_create_comment);
//router.delete("/", LikeController.likes_delete_like);

module.exports = router;
