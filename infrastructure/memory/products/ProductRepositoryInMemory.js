/**
 * Infrastructure Memory - Repository Products
 * Implémentation en mémoire du ProductRepository pour le domaine Products
 */
import { Product } from '../../../src/products/domain/entities/Product.js';
import { Money } from '../../../src/shared-kernel/value-objects/Money.js';
import { PositiveInt } from '../../../src/shared-kernel/value-objects/PositiveInt.js';

export class InMemoryProductRepository {
  constructor(dataStore) {
    if (!dataStore) {
      throw new Error('Data store is required');
    }
    this.dataStore = dataStore;
  }

  async findAll() {
    return this.dataStore.products
      .map(raw => this.#toDomainEntity(raw))
      .sort((a, b) => a.id.value - b.id.value);
  }

  async findById(id) {
    if (!(id instanceof PositiveInt)) {
      id = new PositiveInt(id);
    }

    const raw = this.dataStore.products.find(product => product.id === id.value);
    return raw ? this.#toDomainEntity(raw) : null;
  }

  async findByIds(ids) {
    const idValues = ids.map(id => 
      id instanceof PositiveInt ? id.value : new PositiveInt(id).value
    );
    
    return this.dataStore.products
      .filter(product => idValues.includes(product.id))
      .map(raw => this.#toDomainEntity(raw));
  }

  async save(product) {
    if (!(product instanceof Product)) {
      throw new Error('Object must be a Product instance');
    }

    const rawData = this.#toInfrastructureData(product);
    const existingIndex = this.dataStore.products.findIndex(p => p.id === rawData.id);
    
    if (existingIndex >= 0) {
      // Mise à jour
      this.dataStore.products[existingIndex] = rawData;
    } else {
      // Création
      this.dataStore.products.push(rawData);
    }

    return this.#toDomainEntity(rawData);
  }

  async exists(id) {
    if (!(id instanceof PositiveInt)) {
      id = new PositiveInt(id);
    }
    
    return this.dataStore.products.some(product => product.id === id.value);
  }

  // 🔄 Méthodes de transformation
  #toDomainEntity(rawData) {
    if (!rawData) return null;
    
    return new Product(
      rawData.id,
      rawData.name,
      Money.fromJSON(rawData.price),
      rawData.stock
    );
  }

  #toInfrastructureData(product) {
    return {
      id: product.id.value,
      name: product.name,
      price: product.price.toJSON(),
      stock: product.stock.value
    };
  }
}
