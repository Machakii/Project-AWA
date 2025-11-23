const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Products");

// ADD TO WISHLIST
router.post("/add", async (req, res) => {
  try {
    const { product_id, user_id } = req.body;

    // Check if item already exists for this user
    const exists = await Wishlist.findOne({ product_id, user_id });
    if (exists) {
      return res.status(400).json({ error: "Item already in wishlist" });
    }

    // Get product details
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const wishlistItem = new Wishlist({
      product_id,
      user_id,
      name: product.name,
      image: product.image,
      category: product.category
    });

    const savedItem = await wishlistItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item to wishlist" });
  }
});

// GET WISHLIST FOR SPECIFIC USER
router.get("/user/:userId", async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user_id: req.params.userId })
      // .populate("product_id"); // optional if you want full product details

    res.json(wishlistItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wishlist items" });
  }
});

// DELETE WISHLIST ITEM
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Wishlist.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }
    res.json({ message: "Wishlist item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete wishlist item" });
  }
});

module.exports = router;
