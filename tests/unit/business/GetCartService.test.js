/**
 * Tests unitaires pour GetCartService
 */

import * as AddToCartService from '../../../src/business/services/AddToCartService.js';
import * as ClearCartService from '../../../src/business/services/ClearCartService.js';
import * as GetCartService from '../../../src/business/services/GetCartService.js';

describe('GetCartService', () => {
  beforeEach(() => {
    ClearCartService.execute();
  });

  test('devrait retourner un panier vide par défaut', () => {
    // When
    const cart = GetCartService.execute();
    
    // Then
    expect(cart).toEqual([]);
  });

  test('devrait retourner les articles du panier', () => {
    // Given
    AddToCartService.execute(1, 2);
    AddToCartService.execute(2, 1);
    
    // When
    const cart = GetCartService.execute();
    
    // Then
    expect(cart.length).toBe(2);
    expect(cart).toContainEqual({ productId: 1, quantity: 2 });
    expect(cart).toContainEqual({ productId: 2, quantity: 1 });
  });
});
