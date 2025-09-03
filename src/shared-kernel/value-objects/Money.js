/**
 * Shared Kernel - Value Object Money
 * Représente un montant monétaire avec devise, immuable
 */
export class Money {
  constructor(amount, currency = 'EUR') {
    this.#validateAmount(amount);
    this.#validateCurrency(currency);
    
    this.amount = parseFloat(amount);
    this.currency = currency.toUpperCase();
    
    // Rendre l'objet immutable
    Object.freeze(this);
  }

  #validateAmount(amount) {
    if (amount === null || amount === undefined) {
      throw new Error('Money amount cannot be null or undefined');
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      throw new Error('Money amount must be a positive number');
    }
  }

  #validateCurrency(currency) {
    if (!currency || typeof currency !== 'string' || currency.length !== 3) {
      throw new Error('Currency must be a 3-letter code (e.g., EUR, USD)');
    }
  }

  // 💰 Opérations arithmétiques
  add(other) {
    this.#ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other) {
    this.#ensureSameCurrency(other);
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Cannot subtract: result would be negative');
    }
    return new Money(result, this.currency);
  }

  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error('Factor must be a positive number');
    }
    return new Money(this.amount * factor, this.currency);
  }

  divide(divisor) {
    if (typeof divisor !== 'number' || divisor <= 0) {
      throw new Error('Divisor must be a positive number');
    }
    return new Money(this.amount / divisor, this.currency);
  }

  // 🔍 Comparaisons
  equals(other) {
    if (!(other instanceof Money)) return false;
    return this.amount === other.amount && this.currency === other.currency;
  }

  isGreaterThan(other) {
    this.#ensureSameCurrency(other);
    return this.amount > other.amount;
  }

  isLessThan(other) {
    this.#ensureSameCurrency(other);
    return this.amount < other.amount;
  }

  isZero() {
    return this.amount === 0;
  }

  // 🔄 Utilitaires
  #ensureSameCurrency(other) {
    if (!(other instanceof Money)) {
      throw new Error('Cannot operate with non-Money object');
    }
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  toString() {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency
    };
  }

  // 🏭 Factory methods
  static euro(amount) {
    return new Money(amount, 'EUR');
  }

  static dollar(amount) {
    return new Money(amount, 'USD');
  }

  static zero(currency = 'EUR') {
    return new Money(0, currency);
  }

  static fromJSON(data) {
    return new Money(data.amount, data.currency);
  }
}
