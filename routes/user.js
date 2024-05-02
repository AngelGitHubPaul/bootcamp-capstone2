const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth")

router.post("/", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/find-user", verify, verifyAdmin, userController.findUser);

router.get("/details", verify, userController.getProfile);

router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

router.patch("/update-password", verify, userController.resetPassword);

module.exports = router;