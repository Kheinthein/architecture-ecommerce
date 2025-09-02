/**
 * Tests unitaires pour CheckoutOrderService
 */

import * as CheckoutOrderService from '../../../src/business/services/CheckoutOrderService.js';
import { state } from '../../../src/data/state.js';

describe('CheckoutOrderService', () => {
  beforeEach(() => {
    // Reset orders
    state.orders.length = 0;
    state.orderIdCounter = 1;
  });

  test('devrait créer une nouvelle commande', () => {
    // When
    const order = CheckoutOrderService.execute();
    
    // Then
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('createdAt');
    expect(order.status).toBe('PENDING');
    expect(typeof order.id).toBe('number');
    expect(order.id).toBeGreaterThan(0);
  });

  test('devrait générer des IDs uniques', () => {
    // When
    const order1 = CheckoutOrderService.execute();
    const order2 = CheckoutOrderService.execute();
    
    // Then
    expect(order1.id).not.toBe(order2.id);
    expect(order2.id).toBeGreaterThan(order1.id);
  });
});
