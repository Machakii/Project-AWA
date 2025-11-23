const express = require("express");
const router = express.Router();
const Address = require("../models/Address");


// ADD ADDRESS (with user_id)
router.post("/add", async (req, res) => {
  try {
    const { user_id, tag } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    // If setting new address as default → remove other defaults for this user only
    if (tag === "default") {
      await Address.updateMany(
        { user_id }, 
        { $set: { tag: "" } }
      );
    }

    const newAddress = new Address({ ...req.body });
    const savedAddress = await newAddress.save();

    res.status(201).json(savedAddress);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add address" });
  }
});


// GET ALL ADDRESSES FOR SPECIFIC USER
router.get("/all/:user_id", async (req, res) => {
  try {
    const addresses = await Address.find({ user_id: req.params.user_id });

    res.json(addresses);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});


// GET ONE ADDRESS BY ID
router.get("/:id", async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(address);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch address" });
  }
});


// UPDATE ADDRESS
router.put("/edit/:id", async (req, res) => {
  try {
    const { tag, user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "user_id is required when updating address" });
    }

    // If setting this as default → clear other default addresses for this user
    if (tag === "default") {
      await Address.updateMany(
        { user_id, _id: { $ne: req.params.id } },
        { $set: { tag: "" } }
      );
    }

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update address" });
  }
});


// DELETE ADDRESS
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Address.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json({ message: "Address deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

module.exports = router;
