//express
const express = require("express");
const router = express.Router();


//require  route.js
const category = require("./category.route");
const attribute = require("./attribute.route");
const product = require("./product.route");

router.use("/category", category);
router.use("/attributes", attribute);
router.use("/product", product);


module.exports = router;  // This must be a router obje