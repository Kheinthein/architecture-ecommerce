/**
 * Tests d'intégration API - Architecture n-tiers
 */

import request from 'supertest';
import app from '../../src/presentation/http/app.js';

describe('API Integration Tests', () => {
  // Utilisation directe de l'app principale

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