const Category = require('../models/Category');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/error');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, count: categories.length, categories });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }
  res.status(200).json({ success: true, category });
});

// @desc    Create category (Admin)
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, message: 'Category created!', category });
});

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }
  res.status(200).json({ success: true, message: 'Category updated!', category });
});

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  // Check if products exist under this category
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category. ${productCount} product(s) exist under it. Reassign or delete them first.`,
    });
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }
  res.status(200).json({ success: true, message: 'Category deleted.' });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
