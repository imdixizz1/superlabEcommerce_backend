const express = require("express");
const router = express.Router();
const attributeController = require("../controllers/attribute.controller");

// Create a new attribute
router.post("/", attributeController.createAttribute);

// Get all attributes
router.get("/", attributeController.getAttributes);

// Delete an attribute by ID
router.delete("/:id", attributeController.deleteAttribute);

module.exports = router;
