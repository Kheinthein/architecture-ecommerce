/**
 * Tests d'intégration pour les routes cart (version KISS)
 */

import express from 'express';
import request from 'supertest';
import { router as cartRoutes } from '../../src/routes/cartRoutes.js';
import * as cartService from '../../src/services/cartService.js';

// Création d'une app de test
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/cart', cartRoutes);
  return app;
};

describe('Cart API Integration', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    // Vider le panier avant chaque test
    cartService.clearCart();
  });

  describe('GET /cart', () => {
    test('devrait retourner un panier vide par défaut', async () => {
      const response = await request(app)
        .get('/cart')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('devrait retourner le panier avec les produits ajoutés', async () => {
      // Ajouter un produit au panier d'abord
      await request(app)
        .post('/cart')
        .send({ productId: 1, quantity: 2 })
        .expect(200);

      const response = await request(app)
        .get('/cart')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0]).toEqual({ productId: 1, quantity: 2 });
    });
  });

  describe('POST /cart', () => {
    test('devrait ajouter un produit valide au panier', async () => {
      const response = await request(app)
        .post('/cart')
        .send({ productId: 1, quantity: 2 })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Produit ajouté au panier');
    });

    test('devrait retourner 400 pour des paramètres invalides', async () => {
      const invalidRequests = [
        {},
        { productId: 1 },
        { quantity: 2 },
        { productId: null, quantity: 2 },
        { productId: 1, quantity: null },
        { productId: 0, quantity: 2 },
        { productId: -1, quantity: 2 },
        { productId: 1, quantity: 0 },
        { productId: 1, quantity: -1 },
        { productId: 'invalid', quantity: 2 },
        { productId: 1, quantity: 'invalid' }
      ];

      for (const invalidRequest of invalidRequests) {
        await request(app)
          .post('/cart')
          .send(invalidRequest)
          .expect(400);
      }
    });
  });

  describe('DELETE /cart', () => {
    test('devrait vider complètement le panier', async () => {
      // Ajouter quelques produits
      await request(app)
        .post('/cart')
        .send({ productId: 1, quantity: 2 });
      
      await request(app)
        .post('/cart')
        .send({ productId: 2, quantity: 1 });

      // Vider le panier
      const response = await request(app)
        .delete('/cart')
        .expect(200);

      expect(response.body.message).toBe('Panier vidé');

      // Vérifier que le panier est vide
      const cartResponse = await request(app)
        .get('/cart')
        .expect(200);

      expect(cartResponse.body.length).toBe(0);
    });

    test('devrait fonctionner même avec un panier vide', async () => {
      const response = await request(app)
        .delete('/cart')
        .expect(200);

      expect(response.body.message).toBe('Panier vidé');
    });
  });
});