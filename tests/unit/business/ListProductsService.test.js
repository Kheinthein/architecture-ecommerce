/**
 * Tests unitaires pour ListProductsService
 */

import * as ListProductsService from '../../../src/business/services/ListProductsService.js';

describe('ListProductsService', () => {
  test('devrait retourner tous les produits triés par ID', () => {
    // When
    const products = ListProductsService.execute();
    
    // Then
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Vérifier le tri par ID
    for (let i = 1; i < products.length; i++) {
      expect(products[i].id).toBeGreaterThan(products[i - 1].id);
    }
  });
});
