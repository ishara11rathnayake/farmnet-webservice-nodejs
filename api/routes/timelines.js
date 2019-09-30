const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const timelineController = require("../controllers/timelines");

router.post("/", checkAuth, timelineController.timelines_create_timeline);

router.get(
  "/:userId",
  checkAuth,
  timelineController.timelines_get_timelines_by_user
);

router.patch(
  "/tasks/:timelineId",
  checkAuth,
  timelineController.timelines_add_new_task
);

module.exports = router;
