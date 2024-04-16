const express = require("express");
const cartController = require("../controllers/cart");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");

//Route for retrieving user's cart
router.get("/get-cart", verify, cartController.getCart);

router.post("/add-to-cart", verify, cartController.addToCart);

router.patch("/update-cart-quantity", verify, cartController.updateQuantity)

router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart)

router.post("/products/searchByName", cartController.searchByName);

module.exports = router;