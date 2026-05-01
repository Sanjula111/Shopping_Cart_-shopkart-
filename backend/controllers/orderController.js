const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/error');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty.' });
  }

  // Build order items with product snapshots
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.image,
    price: item.price,
    quantity: item.quantity,
  }));

  const subtotal = cart.totalAmount;
  const shippingCharge = subtotal > 1000 ? 0 : 100; // Free shipping over 1000
  const totalAmount = subtotal + shippingCharge;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCharge,
    totalAmount,
    notes,
  });

  // Deduct stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Clear the cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, message: 'Order placed successfully!', order });
});

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  // Ensure user can only view their own order
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }
  res.status(200).json({ success: true, order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  res.status(200).json({ success: true, count: orders.length, totalRevenue, orders });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
    { new: true }
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  res.status(200).json({ success: true, message: 'Order updated!', order });
});

module.exports = { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
