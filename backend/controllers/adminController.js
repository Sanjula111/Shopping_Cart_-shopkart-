const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { asyncHandler } = require('../middleware/error');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, totalCategories, orders] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Product.countDocuments(),
    Order.countDocuments(),
    Category.countDocuments(),
    Order.find().select('totalAmount orderStatus createdAt'),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'placed').length;
  const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(5);

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalAmount' },
        orders: { $count: {} },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: { totalUsers, totalProducts, totalOrders, totalCategories, totalRevenue, pendingOrders },
    recentOrders,
    monthlyData,
  });
});

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, user });
});

module.exports = { getDashboardStats, getAllUsers, toggleUserStatus };
