/**
 * Products Domain - Entité Product
 * Logique métier pure pour les produits du catalogue
 */
import { BusinessRuleError, ValidationError } from '../../../shared-kernel/errors/DomainError.js';
import { Money } from '../../../shared-kernel/value-objects/Money.js';
import { PositiveInt } from '../../../shared-kernel/value-objects/PositiveInt.js';

export class Product {
  constructor(id, name, price, stock = 0) {
    this.#validateId(id);
    this.#validateName(name);
    
    this.id = new PositiveInt(id);
    this.name = this.#sanitizeName(name);
    this.price = price instanceof Money ? price : Money.euro(price);
    this.stock = new PositiveInt(stock);
    this.createdAt = new Date();
  }

  // 🔒 Validation des règles métier
  #validateId(id) {
    try {
      new PositiveInt(id);
    } catch (error) {
      throw new ValidationError('Product ID must be a positive integer', 'id', id);
    }
  }

  #validateName(name) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new ValidationError('Product name cannot be empty', 'name', name);
    }
    if (name.length > 100) {
      throw new ValidationError('Product name cannot exceed 100 characters', 'name', name);
    }
  }

  #sanitizeName(name) {
    return name.trim();
  }

  // 📝 Méthodes métier
  isAvailable() {
    return !this.stock.isZero();
  }

  hasStock(quantity) {
    if (!(quantity instanceof PositiveInt)) {
      quantity = new PositiveInt(quantity);
    }
    return this.stock.isGreaterThan(quantity) || this.stock.equals(quantity);
  }

  reduceStock(quantity) {
    if (!(quantity instanceof PositiveInt)) {
      quantity = new PositiveInt(quantity);
    }

    if (!this.hasStock(quantity)) {
      throw new BusinessRuleError(
        `Insufficient stock. Available: ${this.stock.value}, requested: ${quantity.value}`,
        'INSUFFICIENT_STOCK'
      );
    }

    const newStock = this.stock.subtract(quantity);
    return new Product(this.id.value, this.name, this.price, newStock.value);
  }

  increaseStock(quantity) {
    if (!(quantity instanceof PositiveInt)) {
      quantity = new PositiveInt(quantity);
    }

    const newStock = this.stock.add(quantity);
    return new Product(this.id.value, this.name, this.price, newStock.value);
  }

  changePrice(newPrice) {
    if (!(newPrice instanceof Money)) {
      newPrice = Money.euro(newPrice);
    }

    return new Product(this.id.value, this.name, newPrice, this.stock.value);
  }

  // 🔄 Méthodes utilitaires
  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      price: this.price.toJSON(),
      stock: this.stock.value,
      available: this.isAvailable(),
      createdAt: this.createdAt.toISOString()
    };
  }

  static fromJSON(data) {
    const product = new Product(
      data.id,
      data.name,
      Money.fromJSON(data.price),
      data.stock
    );
    
    if (data.createdAt) {
      product.createdAt = new Date(data.createdAt);
    }
    
    return product;
  }

  equals(other) {
    return other instanceof Product && 
           this.id.equals(other.id) &&
           this.name === other.name &&
           this.price.equals(other.price) &&
           this.stock.equals(other.stock);
  }
}
