import mongoose from 'mongoose';

const orderRequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    },
    price: { 
      type: Number, 
      required: true,
      min: 100 // Минимальная цена
    },
    daysLeft: { 
      type: Number, 
      required: true,
      min: 1 // Минимальный срок
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    adminComment: { type: String, default: '' }
  }, { timestamps: true });
orderRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const OrderRequest = mongoose.model('OrderRequest', orderRequestSchema);

export default OrderRequest;