/**
 * Shared Kernel - Value Object Currency
 * Représente une devise monétaire (EUR, USD, etc.)
 */
import { ValidationError } from '../errors/DomainError.js';

export class Currency {
  // Devises supportées
  static SUPPORTED_CURRENCIES = {
    'EUR': { symbol: '€', name: 'Euro', decimals: 2 },
    'USD': { symbol: '$', name: 'US Dollar', decimals: 2 },
    'GBP': { symbol: '£', name: 'British Pound', decimals: 2 },
    'CHF': { symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
    'CAD': { symbol: 'C$', name: 'Canadian Dollar', decimals: 2 }
  };

  constructor(code) {
    this.#validate(code);
    this.code = code.toUpperCase();
    this.info = Currency.SUPPORTED_CURRENCIES[this.code];
    
    Object.freeze(this);
  }

  #validate(code) {
    if (!code || typeof code !== 'string') {
      throw new ValidationError(
        'Le code devise est requis et doit être une chaîne',
        'CURRENCY_INVALID',
        { field: 'currency', value: code }
      );
    }

    const upperCode = code.toUpperCase();
    if (!(upperCode in Currency.SUPPORTED_CURRENCIES)) {
      throw new ValidationError(
        `Devise non supportée: ${code}. Devises supportées: ${Object.keys(Currency.SUPPORTED_CURRENCIES).join(', ')}`,
        'CURRENCY_NOT_SUPPORTED',
        { field: 'currency', value: code, supported: Object.keys(Currency.SUPPORTED_CURRENCIES) }
      );
    }
  }

  // Getters
  get symbol() {
    return this.info.symbol;
  }

  get name() {
    return this.info.name;
  }

  get decimals() {
    return this.info.decimals;
  }

  // Méthodes de comparaison
  equals(other) {
    return other instanceof Currency && this.code === other.code;
  }

  // Méthodes utilitaires
  toString() {
    return this.code;
  }

  toJSON() {
    return {
      code: this.code,
      symbol: this.symbol,
      name: this.name,
      decimals: this.decimals
    };
  }

  // Factory methods
  static euro() {
    return new Currency('EUR');
  }

  static usd() {
    return new Currency('USD');
  }

  static gbp() {
    return new Currency('GBP');
  }

  static isSupported(code) {
    return code && typeof code === 'string' && 
           code.toUpperCase() in Currency.SUPPORTED_CURRENCIES;
  }

  static getSupportedCurrencies() {
    return Object.keys(Currency.SUPPORTED_CURRENCIES);
  }
}
