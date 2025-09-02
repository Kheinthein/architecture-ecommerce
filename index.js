import express from 'express';
import { errorMiddleware } from './src/presentation/http/middlewares/errorMiddleware.js';
import { router as cartRoutes } from './src/presentation/http/routes/cartRoutes.js';
import { router as orderRoutes } from './src/presentation/http/routes/orderRoutes.js';
import { router as productRoutes } from './src/presentation/http/routes/productRoutes.js';

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

// Middleware de gestion d'erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Middleware de gestion d'erreurs globales
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});