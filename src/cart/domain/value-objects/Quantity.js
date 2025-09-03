/**
 * Cart Domain - Value Object Quantity
 * Représente une quantité valide et bornée pour les articles du panier
 */
import { ValidationError } from '../../../shared-kernel/errors/DomainError.js';
import { PositiveInt } from '../../../shared-kernel/value-objects/PositiveInt.js';

export class Quantity extends PositiveInt {
  static MAX_QUANTITY = 99;

  constructor(value) {
    super(value); // Validation PositiveInt
    
    if (this.value > Quantity.MAX_QUANTITY) {
      throw new ValidationError(
        `Quantity cannot exceed ${Quantity.MAX_QUANTITY}`,
        'quantity',
        value
      );
    }
    
    Object.freeze(this);
  }

  // 🔢 Opérations spécifiques aux quantités
  increment() {
    return new Quantity(this.value + 1);
  }

  decrement() {
    if (this.value <= 1) {
      throw new ValidationError('Quantity cannot be decremented below 1', 'quantity', this.value);
    }
    return new Quantity(this.value - 1);
  }

  // 🔍 Validations métier
  isMaxQuantity() {
    return this.value === Quantity.MAX_QUANTITY;
  }

  canIncrement() {
    return this.value < Quantity.MAX_QUANTITY;
  }

  canDecrement() {
    return this.value > 1;
  }

  // 🏭 Factory methods
  static one() {
    return new Quantity(1);
  }

  static max() {
    return new Quantity(Quantity.MAX_QUANTITY);
  }

  static fromJSON(value) {
    return new Quantity(value);
  }
}
