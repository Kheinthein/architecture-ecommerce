/**
 * Infrastructure Memory - Repository Cart
 * Implémentation en mémoire du CartRepository pour le domaine Cart
 */
import { Cart } from '../../../src/cart/domain/entities/Cart.js';

export class InMemoryCartRepository {
  constructor(dataStore) {
    if (!dataStore) {
      throw new Error('Data store is required');
    }
    this.dataStore = dataStore;
  }

  async findById(id) {
    const raw = this.dataStore.carts.find(cart => cart.id === id);
    return raw ? this.#toDomainEntity(raw) : null;
  }

  async save(cart) {
    if (!(cart instanceof Cart)) {
      throw new Error('Object must be a Cart instance');
    }

    const rawData = this.#toInfrastructureData(cart);
    const existingIndex = this.dataStore.carts.findIndex(c => c.id === rawData.id);
    
    if (existingIndex >= 0) {
      // Mise à jour
      this.dataStore.carts[existingIndex] = rawData;
    } else {
      // Création
      this.dataStore.carts.push(rawData);
    }

    return this.#toDomainEntity(rawData);
  }

  async delete(id) {
    const index = this.dataStore.carts.findIndex(cart => cart.id === id);
    if (index >= 0) {
      this.dataStore.carts.splice(index, 1);
    }
  }

  async exists(id) {
    return this.dataStore.carts.some(cart => cart.id === id);
  }

  // 🔄 Méthodes de transformation
  #toDomainEntity(rawData) {
    if (!rawData) return null;
    
    return Cart.fromJSON(rawData);
  }

  #toInfrastructureData(cart) {
    return cart.toJSON();
  }
}
