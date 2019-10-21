const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const UserController = require("../controllers/user");

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/:userId", checkAuth, UserController.user_delete_user);

router.patch("/:userId", checkAuth, UserController.users_update_user);

router.get("/:userId", checkAuth, UserController.users_get_user);

router.patch("/rate/:userId", checkAuth, UserController.users_rate_user);

router.get("/user/:userId", checkAuth, UserController.users_get_user_by_id);

router.patch(
  "/password/:userId",
  checkAuth,
  UserController.users_change_pasword
);

router.get("/search/byname", checkAuth, UserController.users_search_user);

module.exports = router;
