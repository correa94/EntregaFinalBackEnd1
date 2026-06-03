import { Router } from 'express';
import productDAO from '../dao/managers/Product.dao.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    
    let filters = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filters.stock = query === 'true' ? { $gt: 0 } : 0;
      } else {
        filters.category = query;
      }
    }

    // manejo de paginacion
    let options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };
    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const result = await productDAO.getAll(filters, options);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const queryString = `${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${queryString}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${queryString}` : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productDAO.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await productDAO.create(req.body);
    req.app.get('socketio').emit('updateProducts', await productDAO.getAll({}, { limit: 50 }));
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const updated = await productDAO.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Product not found' });
    req.app.get('socketio').emit('updateProducts', await productDAO.getAll({}, { limit: 50 }));
    res.json({ status: 'success', payload: updated });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await productDAO.delete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Product not found' });
    req.app.get('socketio').emit('updateProducts', await productDAO.getAll({}, { limit: 50 }));
    res.json({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;