/**
 * Tests d'intégration pour les routes products (version KISS)
 */

import express from 'express';
import request from 'supertest';
import { router as productRoutes } from '../../src/routes/productRoutes.js';

// Création d'une app de test
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/products', productRoutes);
  return app;
};

describe('Products API Integration', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /products', () => {
    test('devrait retourner tous les produits', async () => {
      const response = await request(app)
        .get('/products')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Vérifier la structure des produits
      response.body.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(typeof product.id).toBe('number');
        expect(typeof product.name).toBe('string');
        expect(typeof product.price).toBe('number');
      });
    });

    test('devrait retourner les produits triés par ID', async () => {
      const response = await request(app)
        .get('/products')
        .expect(200);

      const products = response.body;
      for (let i = 1; i < products.length; i++) {
        expect(products[i].id).toBeGreaterThan(products[i - 1].id);
      }
    });
  });
});