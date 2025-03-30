const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer'); // Import the updated Multer config
const categoryController = require('../controllers/category.controller');

const checkAccess = require('../middleware/checkAccess'); 

router.use(checkAccess());
// Create a new category with an image
router.post('/', upload.single('image'), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);


// Get all category for user
router.get('/fetch', categoryController.getCategoriesForUser);


module.exports = router;
