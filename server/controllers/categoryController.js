const Category = require("../models/Category");

async function getCategories(req, res) {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function createCategory(req, res) {
  try {
    const name = (req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({
      user: req.user._id,
      name: { $regex: "^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", $options: "i" },
    });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ user: req.user._id, name: name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getCategories, createCategory, deleteCategory };