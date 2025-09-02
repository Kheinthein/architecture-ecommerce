/**
 * Tests unitaires pour RemoveFromCartService
 */

import * as AddToCartService from '../../../src/business/services/AddToCartService.js';
import * as ClearCartService from '../../../src/business/services/ClearCartService.js';
import * as GetCartService from '../../../src/business/services/GetCartService.js';
import * as RemoveFromCartService from '../../../src/business/services/RemoveFromCartService.js';

describe('RemoveFromCartService', () => {
  beforeEach(() => {
    ClearCartService.execute();
  });

  test('devrait retirer un produit du panier', () => {
    // Given
    AddToCartService.execute(1, 2);
    AddToCartService.execute(2, 1);
    expect(GetCartService.execute().length).toBe(2);
    
    // When
    RemoveFromCartService.execute(1);
    
    // Then
    const cart = GetCartService.execute();
    expect(cart.length).toBe(1);
    expect(cart[0]).toEqual({ productId: 2, quantity: 1 });
  });

  test('devrait lever une erreur pour un productId invalide', () => {
    // Given & When & Then
    expect(() => RemoveFromCartService.execute(null)).toThrow('productId est requis et doit être un nombre positif');
    expect(() => RemoveFromCartService.execute(0)).toThrow('productId est requis et doit être un nombre positif');
    expect(() => RemoveFromCartService.execute(-1)).toThrow('productId est requis et doit être un nombre positif');
  });

  test('ne devrait rien faire si le produit n\'existe pas dans le panier', () => {
    // Given
    AddToCartService.execute(1, 2);
    const initialCart = GetCartService.execute();
    
    // When
    RemoveFromCartService.execute(99); // Produit inexistant
    
    // Then
    const finalCart = GetCartService.execute();
    expect(finalCart).toEqual(initialCart);
  });
});
