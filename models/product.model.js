import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Commercial Hex Dumbbells"
  description: { type: String, required: true },
  sku: { type: String, required: true, unique: true }, // Industrial code tracker
  basePrice: { type: Number, required: true }, // Price per unit/pair
  bulkPriceTier: { type: Number }, // Discounted price per unit for commercial bulk orders
  minBulkQuantity: { type: Number, default: 10 }, // Threshold to unlock bulk pricing
  weightKg: { type: Number, required: true }, // Critical for gym logistics & shipping calculations
  status: { type: Boolean, default: true }, // Active / Out of production
  stock: { type: Number, required: true }, 
  category: { type: String, required: true, index: true }, // e.g., "Free Weights", "Cardio", "Racks"
  thumbnails: { type: [String], default: [] }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model('Product', productSchema, 'products');

export default productModel;
