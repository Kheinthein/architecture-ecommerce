/**
 * Données de test réutilisables
 */

export const testProducts = [
  { id: 1, name: 'Figurine Test', price: 20 },
  { id: 2, name: 'Poster Test', price: 10 },
  { id: 3, name: 'Livre Test', price: 15 }
];

export const testCartItems = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 }
];

export const testOrders = [
  {
    id: 1,
    items: [{ productId: 1, quantity: 2 }],
    customerInfo: { name: 'John Doe', email: 'john@test.com' },
    status: 'PENDING',
    createdAt: '2025-01-09T15:00:00.000Z',
    updatedAt: '2025-01-09T15:00:00.000Z'
  },
  {
    id: 2,
    items: [{ productId: 2, quantity: 1 }],
    customerInfo: { name: 'Jane Smith', email: 'jane@test.com' },
    status: 'CONFIRMED',
    createdAt: '2025-01-09T16:00:00.000Z',
    updatedAt: '2025-01-09T16:00:00.000Z'
  }
];

export const validOrderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
export const invalidOrderStatuses = ['INVALID', 'TEST', ''];

export const testCustomerInfo = {
  name: 'Test Customer',
  email: 'customer@test.com',
  address: '123 Test Street',
  phone: '+33123456789'
};
