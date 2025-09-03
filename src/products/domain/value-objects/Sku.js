/**
 * Products Domain - Value Object SKU
 * Référence produit (Stock Keeping Unit)
 */
import { ValidationError } from '../../../shared-kernel/errors/DomainError.js';

export class Sku {
  // Format: PREFIX-XXXXXXX (ex: PRD-0001234)
  static PREFIX = 'PRD';
  static MIN_LENGTH = 9;  // PRD-00001
  static MAX_LENGTH = 15; // PRD-1234567890
  static PATTERN = /^[A-Z]{2,4}-[A-Z0-9]{4,10}$/;

  constructor(value) {
    this.#validate(value);
    this.value = this.#normalize(value);
    
    Object.freeze(this);
  }

  #validate(value) {
    if (!value || typeof value !== 'string') {
      throw new ValidationError(
        'Le SKU est requis et doit être une chaîne',
        'SKU_REQUIRED',
        { field: 'sku', value }
      );
    }

    const normalized = value.trim().toUpperCase();
    
    if (normalized.length < Sku.MIN_LENGTH || normalized.length > Sku.MAX_LENGTH) {
      throw new ValidationError(
        `Le SKU doit contenir entre ${Sku.MIN_LENGTH} et ${Sku.MAX_LENGTH} caractères`,
        'SKU_INVALID_LENGTH',
        { field: 'sku', value, minLength: Sku.MIN_LENGTH, maxLength: Sku.MAX_LENGTH }
      );
    }

    if (!Sku.PATTERN.test(normalized)) {
      throw new ValidationError(
        `Format SKU invalide. Format attendu: ${Sku.PREFIX}-XXXXXXX (ex: PRD-0001234)`,
        'SKU_INVALID_FORMAT',
        { field: 'sku', value, expectedPattern: Sku.PATTERN.toString() }
      );
    }

    if (!normalized.startsWith(Sku.PREFIX + '-')) {
      throw new ValidationError(
        `Le SKU doit commencer par "${Sku.PREFIX}-"`,
        'SKU_INVALID_PREFIX',
        { field: 'sku', value, expectedPrefix: Sku.PREFIX }
      );
    }
  }

  #normalize(value) {
    return value.trim().toUpperCase();
  }

  // Getters
  get prefix() {
    return this.value.split('-')[0];
  }

  get identifier() {
    return this.value.split('-')[1];
  }

  get numericPart() {
    // Extraire la partie numérique de l'identifiant
    const match = this.identifier.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  // Méthodes de comparaison
  equals(other) {
    return other instanceof Sku && this.value === other.value;
  }

  // Méthodes utilitaires
  toString() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }

  // Méthodes métier
  isSequentialTo(other) {
    if (!(other instanceof Sku)) return false;
    if (this.prefix !== other.prefix) return false;
    
    const thisNum = this.numericPart;
    const otherNum = other.numericPart;
    
    return thisNum !== null && otherNum !== null && 
           Math.abs(thisNum - otherNum) === 1;
  }

  getCategory() {
    // Logique métier pour déduire la catégorie du SKU
    const id = this.identifier;
    
    if (id.startsWith('0001')) return 'Electronics';
    if (id.startsWith('0002')) return 'Clothing';
    if (id.startsWith('0003')) return 'Home';
    if (id.startsWith('0004')) return 'Books';
    if (id.startsWith('0005')) return 'Sports';
    
    return 'General';
  }

  // Factory methods
  static generate(sequence = 1) {
    const paddedSequence = sequence.toString().padStart(6, '0');
    return new Sku(`${Sku.PREFIX}-${paddedSequence}`);
  }

  static fromProductId(productId) {
    const numericId = typeof productId === 'number' ? productId : parseInt(productId, 10);
    if (isNaN(numericId) || numericId < 1) {
      throw new ValidationError(
        'L\'ID produit doit être un nombre positif',
        'INVALID_PRODUCT_ID',
        { productId }
      );
    }
    
    return Sku.generate(numericId);
  }

  static isValid(value) {
    try {
      new Sku(value);
      return true;
    } catch {
      return false;
    }
  }

  static getNextSku(currentSku) {
    if (!(currentSku instanceof Sku)) {
      throw new ValidationError('Le SKU actuel doit être une instance de Sku');
    }
    
    const nextSequence = (currentSku.numericPart || 0) + 1;
    return Sku.generate(nextSequence);
  }
}
