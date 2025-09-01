/**
 * Tests unitaires pour cartService (version KISS)
 */

import * as cartService from '../../src/services/cartService.js';

describe('CartService', () => {
  // Reset du panier avant chaque test
  beforeEach(() => {
    cartService.clearCart();
  });

  describe('getCart', () => {
    test('devrait retourner un panier vide par défaut', () => {
      // When
      const cart = cartService.getCart();
      
      // Then
      expect(cart).toBeDefined();
      expect(Array.isArray(cart)).toBe(true);
      expect(cart.length).toBe(0);
    });
  });

  describe('addToCart', () => {
    test('devrait ajouter un nouveau produit au panier', () => {
      // Given
      const productId = 1;
      const quantity = 2;
      
      // When
      cartService.addToCart(productId, quantity);
      
      // Then
      const cart = cartService.getCart();
      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual({ productId, quantity });
    });

    test('devrait mettre à jour la quantité pour un produit existant', () => {
      // Given
      const productId = 1;
      cartService.addToCart(productId, 2);
      
      // When
      cartService.addToCart(productId, 3);
      
      // Then
      const cart = cartService.getCart();
      expect(cart.length).toBe(1);
      expect(cart[0].quantity).toBe(5);
    });

    test('devrait lever une erreur pour des paramètres invalides', () => {
      // Given & When & Then
      expect(() => cartService.addToCart(null, 1)).toThrow('productId et quantity sont requis');
      expect(() => cartService.addToCart(1, null)).toThrow('productId et quantity sont requis');
      expect(() => cartService.addToCart(0, 1)).toThrow('productId et quantity sont requis');
      expect(() => cartService.addToCart(1, 0)).toThrow('productId et quantity sont requis');
      expect(() => cartService.addToCart(-1, 1)).toThrow('productId et quantity sont requis');
      expect(() => cartService.addToCart(1, -1)).toThrow('productId et quantity sont requis');
      expect(() => cartService.addToCart('invalid', 1)).toThrow('productId et quantity sont requis');
      expect(() => cartService.addToCart(1, 'invalid')).toThrow('productId et quantity sont requis');
    });
  });

  describe('clearCart', () => {
    test('devrait vider complètement le panier', () => {
      // Given
      cartService.addToCart(1, 2);
      cartService.addToCart(2, 1);
      
      // When
      cartService.clearCart();
      
      // Then
      const cart = cartService.getCart();
      expect(cart.length).toBe(0);
    });

    test('devrait fonctionner même avec un panier vide', () => {
      // When
      cartService.clearCart();
      
      // Then
      const cart = cartService.getCart();
      expect(cart.length).toBe(0);
    });
  });
});