const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const QuestionController = require("../controllers/questions");

router.get("/", QuestionController.questions_get_all);

router.post("/", checkAuth, QuestionController.questions_create_question);

router.get("/:questionId", QuestionController.questions_get_question);

router.delete(
  "/:questionId/:userId",
  checkAuth,
  QuestionController.questions_delete_question
);

router.patch(
  "/:questionId",
  checkAuth,
  QuestionController.questions_update_question
);

router.get(
  "/search/:searchText",
  checkAuth,
  QuestionController.quetions_search_question
);

router.patch(
  "/answer/:questionId",
  checkAuth,
  QuestionController.questions_increase_no_of_answers
);

router.get(
  "/byUser/:userId",
  checkAuth,
  QuestionController.questions_get_questions_by_userId
);

module.exports = router;
