const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    image: String, // local storage for image
    name: String,
    role: String,
    text: String
});

module.exports = mongoose.model('Orders', orderSchema);