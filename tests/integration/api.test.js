/**
 * Tests d'intégration API - Architecture n-tiers
 */

import express from 'express';
import request from 'supertest';
import { errorMiddleware } from '../../src/presentation/http/middlewares/errorMiddleware.js';
import { router as cartRoutes } from '../../src/presentation/http/routes/cartRoutes.js';
import { router as orderRoutes } from '../../src/presentation/http/routes/orderRoutes.js';
import { router as productRoutes } from '../../src/presentation/http/routes/productRoutes.js';

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/products', productRoutes);
  app.use('/cart', cartRoutes);
  app.use('/orders', orderRoutes);
  app.use(errorMiddleware);
  return app;
};

describe('API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Products API', () => {
    test('GET /products - devrait retourner la liste des produits', async () => {
      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body).toEqual([
        { id: 1, name: 'Figurine', price: 20 },
        { id: 2, name: 'Poster', price: 10 }
      ]);
    });
  });

  describe('Cart API', () => {
    test('GET /cart - devrait retourner un panier vide', async () => {
      const response = await request(app)
        .get('/cart')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('POST /cart - devrait ajouter un produit au panier', async () => {
      const response = await request(app)
        .post('/cart')
        .send({ productId: 1, quantity: 2 })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    test('DELETE /cart - devrait vider le panier', async () => {
      await request(app)
        .post('/cart')
        .send({ productId: 1, quantity: 2 });

      const response = await request(app)
        .delete('/cart')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Orders API', () => {
    test('GET /orders - devrait retourner la liste des commandes', async () => {
      const response = await request(app)
        .get('/orders')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /orders - devrait créer une nouvelle commande', async () => {
      const response = await request(app)
        .post('/orders')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status', 'PENDING');
    });
  });
});
