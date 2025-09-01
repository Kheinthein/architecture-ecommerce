import express from 'express';
import { router as cartRoutes } from './routes/cartRoutes.js';
import { router as orderRoutes } from './routes/orderRoutes.js';
import { router as productRoutes } from './routes/productRoutes.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Route d'accueil
app.get('/', (req, res) => {
  res.send('API E-commerce');
});

// Montage des routes
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
