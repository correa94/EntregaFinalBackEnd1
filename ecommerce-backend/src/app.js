import express from 'express';
import mongoose from 'mongoose';
//const { Server } = require('socket.io');
import { Server } from 'socket.io';
import productsRouter from '../../routes/products.router.js';
import cartsRouter from '../../routes/carts.router.js';
import productDAO from '../../dao/managers/Product.dao.js';

const app = express();
const PORT = 8080;

mongoose.connect('mongodb://localhost:24017/ecommerce')
  .then(() => console.log('Connected natively to MongoDB ("ecommerce")'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});

const io = new Server(httpServer);
app.set('socketio', io); // Share socket instance with routers

io.on('connection', async (socket) => {
  console.log('Client connected via WebSockets');
  
  const dynamicProducts = await productDAO.getAll({}, { limit: 50 });
  socket.emit('updateProducts', dynamicProducts);
});