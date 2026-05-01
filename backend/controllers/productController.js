const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/error');

// @desc    Get all products (with filters, pagination, search)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const query = { isActive: true };

  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.status(200).json({ success: true, product });
});

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  await product.populate('category', 'name slug');
  res.status(201).json({ success: true, message: 'Product created!', product });
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.status(200).json({ success: true, message: 'Product updated!', product });
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.status(200).json({ success: true, message: 'Product deleted.' });
});

// @desc    Get all products including inactive (Admin)
// @route   GET /api/products/admin/all
// @access  Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate('category', 'name').sort('-createdAt');
  res.status(200).json({ success: true, count: products.length, products });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAdminProducts };
