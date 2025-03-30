const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Attribute = require("../models/attribute.model");

exports.createProduct = async (req, res) => {
  console.log("req.body", req.body);
  const {
    name,
    description,
    price,
    mrp,
    specialPrice,
    category,
    attributes,
    stock,
    brand,
    imageLink,
  } = req.body;

  try {
    if (
      !imageLink ||
      !brand ||
      !name ||
      !description ||
      !price ||
      !mrp ||
      !category ||
      !attributes
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "images, brand, name, description, price, mrp, category, attributes are required.",
      });
    }
    // Check if the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        status: "error",
        message: "Category not found.",
      });
    }

    

    // Check if the attributes exist and validate their values
    const attributesExists = await Attribute.find({
      _id: { $in: attributes.map((attr) => attr._id) },
    });

    if (attributesExists.length !== attributes.length) {
      return res.status(400).json({
        status: "error",
        message: "Some attributes do not exist.",
      });
    }

    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      const attributeInDb = attributesExists.find(
        (attr) => attr._id.toString() === attribute._id
      );

      // If the attribute has predefined values (e.g., ["4 GB", "6 GB"])
      if (
        attributeInDb.values &&
        attribute.value.some((value) => !attributeInDb.values.includes(value))
      ) {
        return res.status(400).json({
          status: "error",
          message: `Invalid values '${attribute.value.join(
            ", "
          )}' for attribute '${
            attributeInDb.name
          }'. Allowed values are: ${attributeInDb.values.join(", ")}`,
        });
      }
    }

    // Prepare the attributes to save in the product
    const productAttributes = attributes.map((attr) => {
      const attributeInDb = attributesExists.find(
        (attribute) => attribute._id.toString() === attr._id
      );

      return {
        _id: attr._id,
        name: attributeInDb.name,
        value: attr.value, // Store the array of values
      };
    });

    // const images = req.files.map((file) => file.path); // Multer stores file info in req.files

    // // Check if the images exist (Optional: to ensure images are uploaded)
    // if (!images.length) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "No images uploaded.",
    //   });
    // }

    const images = imageLink;

    // Create the new product
    const newProduct = new Product({
      name,
      description,
      price,
      mrp,
      specialPrice: specialPrice || price,
      category,
      attributes: productAttributes, // Store attributes with id, name, and value
      stock: stock || 50,
      images,
      frontImage: images[0],
      brand,
    });

    // Save the product
    await newProduct.save();

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error creating product",
      error: error.message,
    });
  }
};

exports.searchAndFilterProducts = async (req, res) => {
  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = req.query;

  const filterConditions = {};

  if (keyword) {
    const regex = new RegExp(keyword, "i");
    filterConditions.$or = [
      { name: { $regex: regex } },
      { description: { $regex: regex } },
    ];
  }

  if (category) {
    filterConditions.category = category;
  }

  if (brand) {
    filterConditions.brand = brand;
  }

  if (minPrice) {
    filterConditions.price = { $gte: minPrice };
  }
  if (maxPrice) {
    filterConditions.price = { ...filterConditions.price, $lte: specialPrice };
  }

  try {
    const [products, totalProducts] = await Promise.all([
      Product.find(filterConditions)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("category")
        .populate("attributes")
        .lean(),
      Product.countDocuments(filterConditions),
    ]);

    return res.status(200).json({
      status: "success",
      data: {
        products,
        totalProducts,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error retrieving products",
      error: error.message,
    });
  }
};

exports.manageProducts = async (req, res) => {
  try {
    if (!req.query.productId || !req.query.type) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid request" });
    }

    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    if (req.query.type === "isTrending") {
      product.isTrending = !product.isTrending;
      await product.save();

      return res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: product,
      });
    } else if (req.query.type === "isJustLaunched") {
      product.isJustLaunched = !product.isJustLaunched;
      await product.save();
      return res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: product,
      });
    } else if (req.query.type === "isBestSeller") {
      product.isBestSeller = !product.isBestSeller;
      await product.save();
      return res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: product,
      });
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid request" });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.getProductsByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        status: "error",
        message: "Type query parameter is required",
      });
    }

    const filterOptions = {
      justLaunched: { isJustLaunched: true },
      bestSeller: { isBestSeller: true },
      trending: { isTrending: true },
    };

    if (!filterOptions[type]) {
      return res.status(400).json({
        status: "error",
        message: "Something went wrong",
      });
    }

    const products = await Product.find(filterOptions[type]).lean();
    return res.status(200).json({ status: "success", data: products });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching products",
      error: error.message,
    });
  }
};
