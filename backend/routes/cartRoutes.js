const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Products");

// ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const { product_id, user_id, quantity, size } = req.body; // size is a single object

    // Check if the same product with same size exists in cart
    const existing = await Cart.findOne({
      user_id,
      product_id,
      "size.label": size?.label || null
    });

    if (existing) {
      existing.quantity += Number(quantity);
      await existing.save();
      return res.json(existing);
    }

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const cartItem = new Cart({
      product_id,
      user_id,
      name: product.name,
      image: product.image,
      quantity: Number(quantity),
      size // store the selected size object
    });

    const savedItem = await cartItem.save();
    res.status(201).json(savedItem);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});



// GET CART ITEMS FOR USER
router.get("/user/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ user_id: req.params.userId })
      // .populate("product_id");
    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});


// UPDATE CART ITEM
router.put("/update/:id", async (req, res) => {
  try {
    const { quantity, sizes } = req.body;

    const updated = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        quantity: Number(quantity),
        sizes: Array.isArray(sizes) ? sizes : []
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});


// DELETE CART ITEM
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Cart.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Cart item deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

module.exports = router;