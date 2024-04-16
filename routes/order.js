const express = require("express");
const orderController = require("../controllers/order");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");

router.post("/checkout", verify, productController.checkout);

module.exports = router;