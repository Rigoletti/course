import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  daysLeft: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [String],
  price: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subtopic: {
    type: String,
    required: true // Добавляем обязательное поле для подкатегории
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Добавляем индексы для ускорения поиска
orderSchema.index({ category: 1 });
orderSchema.index({ subtopic: 1 });
orderSchema.index({ category: 1, subtopic: 1 });

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;