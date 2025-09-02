/**
 * Tests unitaires pour AddToCartService
 */

import * as AddToCartService from '../../../src/business/services/AddToCartService.js';
import * as ClearCartService from '../../../src/business/services/ClearCartService.js';
import * as GetCartService from '../../../src/business/services/GetCartService.js';

describe('AddToCartService', () => {
  beforeEach(() => {
    ClearCartService.execute();
  });

  test('devrait ajouter un nouveau produit au panier', () => {
    // Given
    const productId = 1;
    const quantity = 2;
    
    // When
    AddToCartService.execute(productId, quantity);
    
    // Then
    const cart = GetCartService.execute();
    expect(cart.length).toBe(1);
    expect(cart[0]).toEqual({ productId, quantity });
  });

  test('devrait lever une erreur pour des paramètres invalides', () => {
    // Given & When & Then
    expect(() => AddToCartService.execute(null, 1)).toThrow('productId et quantity sont requis');
    expect(() => AddToCartService.execute(1, null)).toThrow('productId et quantity sont requis');
  });
});
