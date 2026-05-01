const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: true, // Snapshot price at time of adding
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Virtual for total amount
cartSchema.virtual('totalAmount').get(function () {
  return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
