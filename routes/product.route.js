const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // Import the updated Multer config for image upload
const productController = require('../controllers/product.controller'); // Import the controller for products

const checkAccess = require('../middleware/checkAccess'); // Middleware to check access permissions

router.use(checkAccess());

// Create a new product with images
router.post('/', upload.array('images', 5), productController.createProduct); // Upload multiple images

// Get all products
router.get('/', productController.searchAndFilterProducts);

// // Get a single product by its ID
// router.get('/:id', productController.getProductById);

// // Get products by category
// router.get('/category/:categoryId', productController.getProductsByCategory);

// // Update a product
// router.put('/:id', upload.array('images', 5), productController.updateProduct); // Upload multiple images

// // Delete a product
// router.delete('/:id', productController.deleteProduct);

module.exports = router;
