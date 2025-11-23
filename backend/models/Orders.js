const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: String,
   
    order_id: {
        type: String,
        unique: true
    },

    shipping_address: String,

    eta: {
        type: Date,
        default: function () {
            const today = new Date();
            const daysToAdd = Math.floor(Math.random() * 2) + 3; // 3–4 days
            today.setDate(today.getDate() + daysToAdd);
            return new Date(today.toDateString());
        }
    },

    status: {
        type: String,
        default: "Processing"
    },

    product: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",
                required: true
            },
            amount: Number,
            price: Number
        }
    ]
});


// Generate unique order_id before saving
orderSchema.pre("save", async function (next) {
    const Order = mongoose.model("Orders");

    // Generate ETA if not manually changed
    if (!this.isModified("eta")) {
        const today = new Date();
        const daysToAdd = Math.floor(Math.random() * 2) + 3;
        today.setDate(today.getDate() + daysToAdd);
        this.eta = new Date(today.toDateString());
    }

    // Generate unique order_id only if none exists
    if (!this.order_id) {
        let isUnique = false;

        while (!isUnique) {
            const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digits
            const newId = `#${randomNum}`;

            // Check if ID already exists
            const existing = await Order.findOne({ order_id: newId });
            if (!existing) {
                this.order_id = newId;
                isUnique = true;
            }
        }
    }

    next();
});

module.exports = mongoose.model('Orders', orderSchema);
