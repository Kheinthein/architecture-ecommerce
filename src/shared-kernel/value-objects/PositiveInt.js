/**
 * Shared Kernel - Value Object PositiveInt
 * Représente un entier positif validé, immuable
 */
export class PositiveInt {
  constructor(value) {
    this.#validate(value);
    this.value = parseInt(value, 10);
    Object.freeze(this);
  }

  #validate(value) {
    if (value === null || value === undefined) {
      throw new Error('PositiveInt value cannot be null or undefined');
    }

    const intValue = parseInt(value, 10);
    if (isNaN(intValue) || intValue < 0) {
      throw new Error('PositiveInt must be a positive integer (>= 0)');
    }

    if (intValue !== parseFloat(value)) {
      throw new Error('PositiveInt must be an integer (no decimals)');
    }
  }

  // 🔢 Opérations arithmétiques
  add(other) {
    if (!(other instanceof PositiveInt)) {
      throw new Error('Can only add another PositiveInt');
    }
    return new PositiveInt(this.value + other.value);
  }

  subtract(other) {
    if (!(other instanceof PositiveInt)) {
      throw new Error('Can only subtract another PositiveInt');
    }
    const result = this.value - other.value;
    if (result < 0) {
      throw new Error('Subtraction result cannot be negative');
    }
    return new PositiveInt(result);
  }

  multiply(factor) {
    if (!(factor instanceof PositiveInt)) {
      throw new Error('Can only multiply by another PositiveInt');
    }
    return new PositiveInt(this.value * factor.value);
  }

  // 🔍 Comparaisons
  equals(other) {
    return other instanceof PositiveInt && this.value === other.value;
  }

  isGreaterThan(other) {
    if (!(other instanceof PositiveInt)) return false;
    return this.value > other.value;
  }

  isLessThan(other) {
    if (!(other instanceof PositiveInt)) return false;
    return this.value < other.value;
  }

  isZero() {
    return this.value === 0;
  }

  // 🔄 Utilitaires
  toString() {
    return this.value.toString();
  }

  toJSON() {
    return this.value;
  }

  // 🏭 Factory methods
  static zero() {
    return new PositiveInt(0);
  }

  static one() {
    return new PositiveInt(1);
  }

  static fromJSON(value) {
    return new PositiveInt(value);
  }
}
