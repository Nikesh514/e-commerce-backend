import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'user id is required']
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'product id is required']
      },
      quantity: {
        type: Number,
        min: 1,
        required: [true, 'quantity is required']
      }
    }
  ]
}, { timestamps: true });

const Cart = mongoose.model('cart', cartSchema);

export default Cart;
