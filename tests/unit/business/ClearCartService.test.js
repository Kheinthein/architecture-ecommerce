/**
 * Tests unitaires pour ClearCartService
 */

import * as AddToCartService from '../../../src/business/services/AddToCartService.js';
import * as ClearCartService from '../../../src/business/services/ClearCartService.js';
import * as GetCartService from '../../../src/business/services/GetCartService.js';

describe('ClearCartService', () => {
  test('devrait vider le panier', () => {
    // Given
    AddToCartService.execute(1, 2);
    expect(GetCartService.execute().length).toBe(1);
    
    // When
    ClearCartService.execute();
    
    // Then
    expect(GetCartService.execute()).toEqual([]);
  });

  test('devrait fonctionner avec un panier déjà vide', () => {
    // Given
    expect(GetCartService.execute()).toEqual([]);
    
    // When
    ClearCartService.execute();
    
    // Then
    expect(GetCartService.execute()).toEqual([]);
  });
});
