// Factory pour choisir entre repositories memory et SQLite
import { CartRepositoryInMemory } from './memory/CartRepositoryInMemory.js';
import { OrderRepositoryInMemory } from './memory/OrderRepositoryInMemory.js';
import { ProductRepositoryInMemory } from './memory/ProductRepositoryInMemory.js';

import { CartRepositorySQLite } from './sqlite/CartRepositorySQLite.js';
import { OrderRepositorySQLite } from './sqlite/OrderRepositorySQLite.js';
import { ProductRepositorySQLite } from './sqlite/ProductRepositorySQLite.js';

const DATA_DRIVER = process.env.DATA_DRIVER || 'memory';

// Factory pour créer les repositories selon le driver configuré
export class RepositoryFactory {
  static createProductRepository() {
    switch (DATA_DRIVER) {
      case 'sqlite':
        return new ProductRepositorySQLite();
      case 'memory':
      default:
        return new ProductRepositoryInMemory();
    }
  }

  static createCartRepository() {
    switch (DATA_DRIVER) {
      case 'sqlite':
        return new CartRepositorySQLite();
      case 'memory':
      default:
        return new CartRepositoryInMemory();
    }
  }

  static createOrderRepository() {
    switch (DATA_DRIVER) {
      case 'sqlite':
        return new OrderRepositorySQLite();
      case 'memory':
      default:
        return new OrderRepositoryInMemory();
    }
  }

  static getDataDriver() {
    return DATA_DRIVER;
  }
}
