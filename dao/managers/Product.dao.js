import ProductModel from '../../models/product.model.js';

class ProductDAO {
  async getAll(filters = {}, options = {}) {
    return await ProductModel.paginate(filters, options);
  }

  async getById(id) {
    return await ProductModel.findById(id);
  }

  async create(data) {
    return await ProductModel.create(data);
  }

  async update(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductDAO();