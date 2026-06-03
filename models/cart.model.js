import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  gymDetails: {
    corporateName: { type: String, default: '' },
    taxId: { type: String, default: '' },
    contactPhone: { type: String, default: '' }
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
      negotiatedUnitPrice: { type: Number, default: 0 }
    }
  ],
  totalWeightKg: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  cartStatus: { type: String, enum: ['Pending Quote', 'Approved', 'Dispatched', 'Delivered'], default: 'Pending Quote' }
}, { timestamps: true });

cartSchema.pre(/^find/, function(next) {
  this.populate('products.product');
  next();
});

export default mongoose.model('Cart', cartSchema, 'carts');