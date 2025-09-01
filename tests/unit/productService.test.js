/**
 * Tests unitaires pour productService (version KISS)
 */

import * as productService from '../../src/services/productService.js';

describe('ProductService', () => {
  describe('getAllProducts', () => {
    test('devrait retourner tous les produits triés par ID', () => {
      // When
      const products = productService.getAllProducts();
      
      // Then
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      
      // Vérifier le tri par ID
      for (let i = 1; i < products.length; i++) {
        expect(products[i].id).toBeGreaterThan(products[i - 1].id);
      }
    });

    test('devrait retourner des produits avec la structure correcte', () => {
      // When
      const products = productService.getAllProducts();
      
      // Then
      products.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(typeof product.id).toBe('number');
        expect(typeof product.name).toBe('string');
        expect(typeof product.price).toBe('number');
      });
    });
  });
});