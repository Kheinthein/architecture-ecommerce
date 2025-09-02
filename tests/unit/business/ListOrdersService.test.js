/**
 * Tests unitaires pour ListOrdersService
 */

import * as CheckoutOrderService from '../../../src/business/services/CheckoutOrderService.js';
import * as ListOrdersService from '../../../src/business/services/ListOrdersService.js';
import { state } from '../../../src/data/state.js';

describe('ListOrdersService', () => {
  beforeEach(() => {
    // Reset orders
    state.orders.length = 0;
    state.orderIdCounter = 1;
  });

  test('devrait retourner une liste vide par défaut', () => {
    // When
    const orders = ListOrdersService.execute();
    
    // Then
    expect(orders).toEqual([]);
  });

  test('devrait retourner toutes les commandes', () => {
    // Given
    const order1 = CheckoutOrderService.execute();
    const order2 = CheckoutOrderService.execute();
    
    // When
    const orders = ListOrdersService.execute();
    
    // Then
    expect(orders.length).toBe(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});
