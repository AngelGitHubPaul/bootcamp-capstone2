const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth")

router.post("/login", userController.loginUser);

router.patch(":userId/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

module.exports = router;