import mongoose from 'mongoose';

const subtopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orders: { type: Number, default: 0 }
});

const categorySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  services: [String],
  subtopics: [subtopicSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Автоматически генерируем ссылку, если она не указана
  if (!this.link && this.title) {
    this.link = `/category/${this.title.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;