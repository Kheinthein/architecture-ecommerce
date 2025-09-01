/**
 * Tests d'intégration pour l'application
 */

import express from 'express';
import request from 'supertest';
import { router as cartRoutes } from '../../src/routes/cartRoutes.js';
import { router as orderRoutes } from '../../src/routes/orderRoutes.js';
import { router as productRoutes } from '../../src/routes/productRoutes.js';

// Création d'une app de test
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Routes de test
  app.use('/products', productRoutes);
  app.use('/cart', cartRoutes);
  app.use('/orders', orderRoutes);
  
  // Route de fallback pour les tests
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
  
  return app;
};

describe('API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Server Health', () => {
    test('devrait retourner 404 pour les routes inexistantes', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toEqual({ error: 'Not Found' });
    });
  });

  describe('Error Handling', () => {
    test('devrait gérer les erreurs JSON malformées', async () => {
      await request(app)
        .post('/cart')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });
  });
});
