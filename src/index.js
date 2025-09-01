import express from 'express';
import { router as cartRouter } from './cart.js';
import { router as ordersRouter } from './orders.js';
import { router as productsRouter } from './products.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Route d'accueil
app.get('/', (req, res) => {
  res.send('API E-commerce');
});

// Montage des routes
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
