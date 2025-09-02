/**
 * Tests d'intégration pour la gestion d'erreurs
 */

import request from 'supertest';
import app from '../../src/presentation/http/app.js';

describe('Error Handling Integration Tests', () => {
  
  describe('404 Errors', () => {
    test('devrait retourner 404 pour une route inexistante', async () => {
      const response = await request(app)
        .get('/route-inexistante')
        .expect(404);

      expect(response.body).toEqual({ error: 'Not Found' });
    });
  });

  describe('JSON Malformé', () => {
    test('devrait gérer les erreurs de JSON malformé', async () => {
      const response = await request(app)
        .post('/cart')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}') // JSON malformé
        .expect(500); // Express traite les erreurs de parsing comme des erreurs internes

      expect(response.body).toEqual({
        error: 'Erreur interne du serveur',
        message: 'Une erreur inattendue s\'est produite'
      });
    });
  });

  describe('Validation Errors', () => {
    test('devrait retourner 400 pour des paramètres invalides', async () => {
      const response = await request(app)
        .post('/cart')
        .send({ productId: 'invalid', quantity: 'invalid' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Middleware', () => {
    test('devrait catcher les erreurs et retourner 500', async () => {
      const response = await request(app)
        .get('/test-error')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Erreur interne du serveur',
        message: 'Une erreur inattendue s\'est produite'
      });
    });

    test('devrait catcher les ValidationError et retourner 400', async () => {
      const response = await request(app)
        .get('/test-validation-error')
        .expect(400);

      expect(response.body).toEqual({
        error: 'Erreur de validation',
        message: 'Données invalides'
      });
    });
  });
});
