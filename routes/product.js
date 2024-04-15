const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

//Route for creating a product
router.post("/", verify, verifyAdmin, productController.addProduct);

//Route for retrieving all product
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

//Route for retrieving all active product
router.get("/", productController.getAllActive);

module.exports = router;