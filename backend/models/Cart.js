const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    image: String,
    quantity: { type: Number, default: 1 },
    size: {
        id: Number,
        label: String,
        price: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
