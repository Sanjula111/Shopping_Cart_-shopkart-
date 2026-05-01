const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: String, // Snapshot
  image: String, // Snapshot
  price: Number, // Snapshot
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'Sri Lanka' },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'online'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
