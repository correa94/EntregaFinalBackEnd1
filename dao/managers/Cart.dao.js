import CartModel from '../../models/cart.model.js';

class CartDAO {
  async create(cartData = {}) { return await CartModel.create(cartData); }
  async getById(id) { return await CartModel.findById(id); }
  async updateStatus(id, status) { return await CartModel.findByIdAndUpdate(id, { cartStatus: status }, { new: true }); }
}

export default new CartDAO();