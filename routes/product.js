const express = require("express");
const productController = require("../controllers/product");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth")

router.get("/:productId", productController.getSingleProduct);

router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);