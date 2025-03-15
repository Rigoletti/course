import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  daysLeft: { type: Number, required: true },
  description: { type: String, required: true },
  skills: [{ type: String }],
  price: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;