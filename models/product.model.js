const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    specialPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    attributes: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attribute",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        value: {
          type: [String], // Array of possible values for the attribute (e.g., ["4 GB", "6 GB"])
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    frontImage: {
      type: String,
      required: true,
    },
    brand:{
      type: String,
      required: true
    },
    isTrending:{
      type: Boolean,
      default: true
    },
    isJustLaunched: {
      type: Boolean,
      default: true
    },
    isBestSeller: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
