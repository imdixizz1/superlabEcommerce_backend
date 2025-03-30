const mongoose = require("mongoose");

const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    values: [
      {
        type: String,
        required: true,
      },
    ],
    category:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

const Attribute = mongoose.model("Attribute", AttributeSchema);

module.exports = Attribute;
