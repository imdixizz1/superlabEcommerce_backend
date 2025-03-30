const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: '',
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
    versionKey: false
}
);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
