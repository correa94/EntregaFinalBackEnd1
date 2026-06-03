import { Router } from 'express';
import cartDAO  from '../dao/managers/Cart.dao.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await cartDAO.create();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.getById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
    res.json({ status: 'success', payload: cart.products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await cartDAO.getById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const itemIndex = cart.products.findIndex(p => p.product._id?.toString() === req.params.pid || p.product.toString() === req.params.pid);
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await cartDAO.getById(req.params.cid);
    cart.products = cart.products.filter(p => p.product._id?.toString() !== req.params.pid && p.product.toString() !== req.params.pid);
    await cart.save();
    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.getById(req.params.cid);
    cart.products = req.body.products || []; // Replaces entire array
    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await cartDAO.getById(req.params.cid);
    const item = cart.products.find(p => p.product._id?.toString() === req.params.pid || p.product.toString() === req.params.pid);
    if (!item) return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
    
    item.quantity = quantity;
    await cart.save();
    res.json({ status: 'success', message: 'cantidad actualizada' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await cartDAO.getById(req.params.cid);
    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'el carrito quedo vacio' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;