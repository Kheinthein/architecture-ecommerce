import express from 'express';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { router as cartRoutes } from './routes/cartRoutes.js';
import { router as orderRoutes } from './routes/orderRoutes.js';
import { router as productRoutes } from './routes/productRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Route d'accueil
app.get('/', (req, res) => {
  res.send('API E-commerce');
});

// Route de test d'erreur (pour tester le middleware)
app.get('/test-error', (req, res, next) => {
  const error = new Error('Erreur de test pour valider le middleware');
  error.name = 'TestError';
  next(error); // Passer l'erreur au middleware
});

// Route de test ValidationError
app.get('/test-validation-error', (req, res, next) => {
  const error = new Error('Données invalides');
  error.name = 'ValidationError';
  next(error);
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

// Export de l'application pour réutilisation
export default app;