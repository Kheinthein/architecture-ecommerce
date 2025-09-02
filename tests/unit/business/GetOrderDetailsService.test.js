/**
 * Tests unitaires pour GetOrderDetailsService
 */

import * as CheckoutOrderService from '../../../src/business/services/CheckoutOrderService.js';
import * as GetOrderDetailsService from '../../../src/business/services/GetOrderDetailsService.js';
import { state } from '../../../src/data/state.js';

describe('GetOrderDetailsService', () => {
  beforeEach(() => {
    // Reset orders
    state.orders.length = 0;
    state.orderIdCounter = 1;
  });

  test('devrait retourner null pour un ID inexistant', () => {
    // When
    const order = GetOrderDetailsService.execute(999);
    
    // Then
    expect(order).toBeNull();
  });

  test('devrait retourner les détails d\'une commande existante', () => {
    // Given
    const createdOrder = CheckoutOrderService.execute();
    
    // When
    const order = GetOrderDetailsService.execute(createdOrder.id);
    
    // Then
    expect(order).toEqual(createdOrder);
    expect(order.id).toBe(createdOrder.id);
    expect(order.status).toBe('PENDING');
  });
});
