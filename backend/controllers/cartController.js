const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/error');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name image price stock isActive',
  });

  if (!cart) {
    cart = { items: [], totalAmount: 0, totalItems: 0 };
  }

  res.status(200).json({ success: true, cart });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: `Only ${product.stock} units available in stock.` });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    const existingIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (existingIndex > -1) {
      // Update quantity if product already in cart
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} units available.` });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
  }

  await cart.populate({ path: 'items.product', select: 'name image price stock isActive' });
  res.status(200).json({ success: true, message: 'Item added to cart!', cart });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (quantity > product.stock) {
    return res.status(400).json({ success: false, message: `Only ${product.stock} units available.` });
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found.' });
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not in cart.' });
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  await cart.populate({ path: 'items.product', select: 'name image price stock isActive' });

  res.status(200).json({ success: true, message: 'Cart updated!', cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found.' });
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
  await cart.save();
  await cart.populate({ path: 'items.product', select: 'name image price stock isActive' });

  res.status(200).json({ success: true, message: 'Item removed from cart.', cart });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(200).json({ success: true, message: 'Cart cleared.' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
