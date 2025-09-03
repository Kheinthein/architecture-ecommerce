/**
 * Configuration DI - Bindings InMemory
 * Injection de dépendances pour les implémentations en mémoire
 */

// Infrastructure InMemory
import { InMemoryCartRepository } from '../infrastructure/memory/cart/CartRepositoryInMemory.js';
import { InMemoryProductRepository } from '../infrastructure/memory/products/ProductRepositoryInMemory.js';

// Use Cases
import { AddToCartUseCase } from '../src/cart/application/usecases/AddToCartUseCase.js';
import { ListProductsUseCase } from '../src/products/application/usecases/ListProductsUseCase.js';

// Data Store
class DataStore {
  constructor() {
    this.products = [
      { id: 1, name: "MacBook Pro 14\"", price: { amount: 1999.99, currency: 'EUR' }, stock: 5 },
      { id: 2, name: "iPhone 15", price: { amount: 999.99, currency: 'EUR' }, stock: 10 },
      { id: 3, name: "AirPods Pro", price: { amount: 249.99, currency: 'EUR' }, stock: 8 }
    ];
    this.carts = [];
  }
}

export class DIMemoryContainer {
  constructor() {
    this.#setupDependencies();
  }

  #setupDependencies() {
    // 🔴 Infrastructure Layer
    this.dataStore = new DataStore();
    this.productRepo = new InMemoryProductRepository(this.dataStore);
    this.cartRepo = new InMemoryCartRepository(this.dataStore);

    // 🟢 Application Layer
    this.listProductsUseCase = new ListProductsUseCase(this.productRepo);
    this.addToCartUseCase = new AddToCartUseCase(this.cartRepo, this.productRepo);
  }

  // Getters pour accès aux use cases
  getListProductsUseCase() {
    return this.listProductsUseCase;
  }

  getAddToCartUseCase() {
    return this.addToCartUseCase;
  }
}
