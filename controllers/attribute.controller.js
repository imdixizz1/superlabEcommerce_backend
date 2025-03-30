const Attribute = require("../models/attribute.model");
const Category = require("../models/category.model");

// Create a new attribute
exports.createAttribute = async (req, res) => {
  const { name, value, categoryId } = req.body;

  try {
    // Check if the attribute already exists

    const [existingAttribute, category] = await Promise.all([
      Attribute.findOne({ name: name.trim() }),
      Category.findOne({ _id: categoryId }),
    ]);

    if (!category) {
      return res.status(400).json({
        status: "error",
        message: "Category not found",
      });
    }

    if (existingAttribute) {
      return res.status(400).json({
        status: "error",
        message: `Attribute with name '${name}' already exists.`,
      });
    }

    const newAttribute = new Attribute({
      name,
      values: value,
      category: category._id,
    });
    await newAttribute.save();

    return res.status(201).json({
      status: "success",
      message: "Attribute created successfully",
      data: newAttribute,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error creating attribute",
      error: error.message,
    });
  }
};

// Get all attributes
exports.getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find().lean();
    return res.status(200).json({ status: "success", data: attributes });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching attributes",
      error: error.message,
    });
  }
};

// Delete an attribute by ID
exports.deleteAttribute = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAttribute = await Attribute.findByIdAndDelete(id);

    if (!deletedAttribute) {
      return res.status(404).json({
        status: "error",
        message: "Attribute not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Attribute deleted successfully",
      data: deletedAttribute,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error deleting attribute",
      error: error.message,
    });
  }
};
