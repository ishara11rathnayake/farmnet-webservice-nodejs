const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const QuestionController = require("../controllers/questions");

router.get("/", QuestionController.questions_get_all);

router.post("/", checkAuth, QuestionController.questions_create_question);

router.get("/:questionId", QuestionController.questions_get_question);

router.delete(
  "/:questionId",
  checkAuth,
  QuestionController.questions_delete_question
);

router.patch(
  "/:questionId",
  checkAuth,
  QuestionController.questions_update_question
);

module.exports = router;
