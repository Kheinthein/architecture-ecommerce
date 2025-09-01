/**
 * Tests unitaires pour orderService (version KISS)
 */

import * as orderService from '../../src/services/orderService.js';

describe('OrderService', () => {
  describe('getAllOrders', () => {
    test('devrait retourner un tableau', () => {
      // When
      const orders = orderService.getAllOrders();
      
      // Then
      expect(Array.isArray(orders)).toBe(true);
    });
  });

  describe('createOrder', () => {
    test('devrait créer une nouvelle commande', () => {
      // When
      const newOrder = orderService.createOrder();
      
      // Then
      expect(newOrder).toBeDefined();
      expect(newOrder.id).toBeDefined();
      expect(typeof newOrder.id).toBe('number');
      expect(newOrder.status).toBe('PENDING');
      expect(newOrder.createdAt).toBeDefined();
      
      // Vérifier les timestamps
      expect(new Date(newOrder.createdAt)).toBeInstanceOf(Date);
    });

    test('devrait générer des IDs uniques pour chaque commande', () => {
      // When
      const order1 = orderService.createOrder();
      const order2 = orderService.createOrder();
      
      // Then
      expect(order1.id).not.toBe(order2.id);
      expect(order2.id).toBeGreaterThan(order1.id);
    });
  });
});