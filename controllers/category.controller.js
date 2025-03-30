const { deleteFile } = require('../middleware/deleteFile');
const Category = require('../models/category.model');
const path = require('path');

// Create a new category with an image
exports.createCategory = async (req, res) => {

  console.log("req.body", req.body);

  const { name, description } = req.body;
  const image = req.file ? req.file.path : ''; 

  // Validate image type
  if (req.file && !['image/jpeg', 'image/png', 'image/jpg'].includes(req.file.mimetype)) {
    deleteFile(req.file);
    return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG are allowed.' });
  }

  try {
    // Check if the category with the same name already exists
    const existingCategory = await Category.findOne({ name: name.trim() });

    if (existingCategory) {
      deleteFile(req.file);
      return res.status(400).json({
        status: 'error',
        message: 'Category with this name already exists.',
      });
    }

    // Create and save new category
    const newCategory = new Category({ name, description, image });
    await newCategory.save();

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    deleteFile(req.file);
    res.status(500).json({
      status: 'error',
      message: 'Error creating category',
      error: error.message,
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.status(200).json({
      status: 'success',
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// Get all categories
exports.getCategoriesForUser = async (req, res) => {
  try {
    const categories = await Category.find().select('name image').lean();
    res.status(200).json({
      status: 'success',
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};


