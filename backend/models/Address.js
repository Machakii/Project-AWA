const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressName: String,
    fullname: String,
    phone: Number,
    street: String,
    city: String,
    postal: Number,
    country: String,
    tag: String
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
