const express = require("express");
const orderController = require("../controllers/order");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");

router.post("/checkout", verify, productController.checkout);

router.get("/my-orders", verify, orderController.getUserOrder);

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrder);

module.exports = router;