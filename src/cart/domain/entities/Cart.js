/**
 * Cart Domain - Entité Cart
 * Logique métier pure pour la gestion du panier d'achat
 */
import { BusinessRuleError, ValidationError } from '../../../shared-kernel/errors/DomainError.js';
import { Money } from '../../../shared-kernel/value-objects/Money.js';
import { PositiveInt } from '../../../shared-kernel/value-objects/PositiveInt.js';
import { Quantity } from '../value-objects/Quantity.js';

export class Cart {
  constructor(id, items = []) {
    this.#validateId(id);
    this.#validateItems(items);

    this.id = id;
    this.items = [...items]; // Copie défensive
    this.createdAt = new Date();
  }

  #validateId(id) {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Cart ID must be a non-empty string', 'id', id);
    }
  }

  #validateItems(items) {
    if (!Array.isArray(items)) {
      throw new ValidationError('Cart items must be an array', 'items', items);
    }
  }

  // 📝 Méthodes métier
  addItem(productId, quantity = 1) {
    if (!(productId instanceof PositiveInt)) {
      productId = new PositiveInt(productId);
    }
    if (!(quantity instanceof Quantity)) {
      quantity = new Quantity(quantity);
    }

    const existingItemIndex = this.items.findIndex(
      item => item.productId.equals(productId)
    );
    const newItems = [...this.items];

    if (existingItemIndex >= 0) {
      // Mise à jour de la quantité existante
      const currentQuantity = newItems[existingItemIndex].quantity;
      const newQuantity = currentQuantity.add(quantity);
      
      // Vérifier la limite max
      if (newQuantity.value > Quantity.MAX_QUANTITY) {
        throw new BusinessRuleError(
          `Total quantity would exceed maximum allowed (${Quantity.MAX_QUANTITY})`,
          'MAX_QUANTITY_EXCEEDED'
        );
      }

      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: new Quantity(newQuantity.value)
      };
    } else {
      // Nouvel item
      newItems.push({
        productId,
        quantity
      });
    }

    return new Cart(this.id, newItems);
  }

  removeItem(productId) {
    if (!(productId instanceof PositiveInt)) {
      productId = new PositiveInt(productId);
    }

    const newItems = this.items.filter(
      item => !item.productId.equals(productId)
    );
    
    if (newItems.length === this.items.length) {
      throw new BusinessRuleError(
        `Product ${productId.value} not found in cart`,
        'PRODUCT_NOT_IN_CART'
      );
    }

    return new Cart(this.id, newItems);
  }

  updateItemQuantity(productId, quantity) {
    if (!(productId instanceof PositiveInt)) {
      productId = new PositiveInt(productId);
    }
    if (!(quantity instanceof Quantity)) {
      quantity = new Quantity(quantity);
    }

    if (quantity.isZero()) {
      return this.removeItem(productId);
    }

    const newItems = this.items.map(item => 
      item.productId.equals(productId)
        ? { ...item, quantity }
        : item
    );

    return new Cart(this.id, newItems);
  }

  clear() {
    return new Cart(this.id, []);
  }

  // 🔍 Méthodes de consultation
  isEmpty() {
    return this.items.length === 0;
  }

  getTotalItems() {
    return this.items.reduce(
      (total, item) => total.add(item.quantity),
      PositiveInt.zero()
    );
  }

  hasItem(productId) {
    if (!(productId instanceof PositiveInt)) {
      productId = new PositiveInt(productId);
    }
    return this.items.some(item => item.productId.equals(productId));
  }

  getItem(productId) {
    if (!(productId instanceof PositiveInt)) {
      productId = new PositiveInt(productId);
    }
    return this.items.find(item => item.productId.equals(productId)) || null;
  }

  // 💰 Calculs (nécessitent les produits)
  calculateTotal(products) {
    if (!Array.isArray(products)) {
      throw new ValidationError('Products must be an array', 'products', products);
    }

    return this.items.reduce((total, item) => {
      const product = products.find(p => p.id.equals(item.productId));
      if (!product) {
        throw new BusinessRuleError(
          `Product not found: ${item.productId.value}`,
          'PRODUCT_NOT_FOUND'
        );
      }
      
      const itemTotal = product.price.multiply(item.quantity.value);
      return total.add(itemTotal);
    }, Money.zero());
  }

  // 🔄 Méthodes utilitaires
  toJSON() {
    return {
      id: this.id,
      items: this.items.map(item => ({
        productId: item.productId.value,
        quantity: item.quantity.value
      })),
      totalItems: this.getTotalItems().value,
      isEmpty: this.isEmpty(),
      createdAt: this.createdAt.toISOString()
    };
  }

  static fromJSON(data) {
    const items = (data.items || []).map(item => ({
      productId: new PositiveInt(item.productId),
      quantity: new Quantity(item.quantity)
    }));

    const cart = new Cart(data.id, items);
    
    if (data.createdAt) {
      cart.createdAt = new Date(data.createdAt);
    }
    
    return cart;
  }

  equals(other) {
    return other instanceof Cart && 
           this.id === other.id &&
           JSON.stringify(this.toJSON().items) === JSON.stringify(other.toJSON().items);
  }
}
