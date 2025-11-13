const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    tag: String,
    image: String, // local storage for image
    description: String,
    rating: Number,
    reviews: Number,
    note: String,
    returnPolicy: String,
    sizes: [
    {
      id: Number,
      label: String,
      price: Number
    }
  ]
});

module.exports = mongoose.model('Products', productSchema);