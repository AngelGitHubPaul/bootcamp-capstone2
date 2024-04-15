const express = require("express");
const cartController = require("../controllers/cart");
const router = express.Router();
const { verify } = require("../auth");

router.post("/add-to-cart", verify, cartController.addToCart);

router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

module.exports = router;