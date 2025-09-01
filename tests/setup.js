/**
 * Configuration globale pour Jest
 * Exécuté avant chaque suite de tests
 */

// Configuration globale des timeouts
jest.setTimeout(10000);

// Mock console pour réduire le bruit pendant les tests
global.console = {
  ...console,
  // Garder les erreurs importantes
  error: jest.fn(),
  warn: jest.fn(),
  // Masquer les logs de debug
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Helpers de test globaux
global.testHelpers = {
  /**
   * Crée un produit de test standard
   */
  createTestProduct: (overrides = {}) => ({
    id: 1,
    name: 'Test Product',
    price: 100,
    ...overrides
  }),

  /**
   * Crée un item de panier de test
   */
  createTestCartItem: (overrides = {}) => ({
    productId: 1,
    quantity: 2,
    ...overrides
  }),

  /**
   * Crée une commande de test
   */
  createTestOrder: (overrides = {}) => ({
    id: 1,
    items: [testHelpers.createTestCartItem()],
    customerInfo: { name: 'Test User', email: 'test@example.com' },
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  })
};
