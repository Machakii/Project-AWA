const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const multer = require("multer");
const path = require("path");

// MULTER STORAGE (save image in backend/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ADD PRODUCT
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : null,
      sizes: req.body.sizes ? JSON.parse(req.body.sizes) : []
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product" });
  }
});

// GET ALL PRODUCTS
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// UPDATE PRODUCT
router.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      sizes: req.body.sizes ? JSON.parse(req.body.sizes) : []
    };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE PRODUCT
router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
