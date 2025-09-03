/**
 * Products Domain - Value Object ProductName
 * Nom de produit avec validation métier
 */
import { ValidationError } from '../../../shared-kernel/errors/DomainError.js';

export class ProductName {
  static MIN_LENGTH = 2;
  static MAX_LENGTH = 100;
  
  // Mots interdits pour des raisons métier
  static FORBIDDEN_WORDS = [
    'spam', 'fake', 'test', 'debug', 'tmp', 'temp'
  ];

  constructor(value) {
    this.#validate(value);
    this.value = this.#normalize(value);
    
    Object.freeze(this);
  }

  #validate(value) {
    if (!value || typeof value !== 'string') {
      throw new ValidationError(
        'Le nom du produit est requis et doit être une chaîne',
        'PRODUCT_NAME_REQUIRED',
        { field: 'productName', value }
      );
    }

    const trimmed = value.trim();
    
    if (trimmed.length < ProductName.MIN_LENGTH) {
      throw new ValidationError(
        `Le nom du produit doit contenir au moins ${ProductName.MIN_LENGTH} caractères`,
        'PRODUCT_NAME_TOO_SHORT',
        { field: 'productName', value, minLength: ProductName.MIN_LENGTH }
      );
    }

    if (trimmed.length > ProductName.MAX_LENGTH) {
      throw new ValidationError(
        `Le nom du produit ne peut pas dépasser ${ProductName.MAX_LENGTH} caractères`,
        'PRODUCT_NAME_TOO_LONG',
        { field: 'productName', value, maxLength: ProductName.MAX_LENGTH }
      );
    }

    // Vérifier les mots interdits
    const lowerValue = trimmed.toLowerCase();
    const hasForbiddenWord = ProductName.FORBIDDEN_WORDS.some(word => 
      lowerValue.includes(word.toLowerCase())
    );

    if (hasForbiddenWord) {
      throw new ValidationError(
        `Le nom du produit contient un mot interdit`,
        'PRODUCT_NAME_FORBIDDEN_WORD',
        { field: 'productName', value, forbiddenWords: ProductName.FORBIDDEN_WORDS }
      );
    }

    // Vérifier qu'il ne contient pas que des caractères spéciaux
    if (!/[a-zA-Z0-9]/.test(trimmed)) {
      throw new ValidationError(
        'Le nom du produit doit contenir au moins un caractère alphanumérique',
        'PRODUCT_NAME_INVALID_FORMAT',
        { field: 'productName', value }
      );
    }
  }

  #normalize(value) {
    return value.trim()
      .replace(/\s+/g, ' ')  // Remplacer multiples espaces par un seul
      .replace(/[^\w\s\-\.]/g, '')  // Supprimer caractères spéciaux sauf - et .
      .trim();
  }

  // Méthodes utilitaires
  equals(other) {
    return other instanceof ProductName && this.value === other.value;
  }

  toString() {
    return this.value;
  }

  toJSON() {
    return this.value;
  }

  // Méthodes métier
  getSlug() {
    return this.value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  getSearchKeywords() {
    return this.value
      .toLowerCase()
      .split(/[\s\-\.]+/)
      .filter(word => word.length >= 2)
      .filter(word => !ProductName.FORBIDDEN_WORDS.includes(word));
  }

  isSimilarTo(otherName) {
    if (!(otherName instanceof ProductName)) {
      return false;
    }
    
    const thisKeywords = new Set(this.getSearchKeywords());
    const otherKeywords = new Set(otherName.getSearchKeywords());
    
    // Calculer l'intersection
    const intersection = new Set([...thisKeywords].filter(x => otherKeywords.has(x)));
    
    // Similarité basée sur le pourcentage de mots communs
    const similarity = intersection.size / Math.min(thisKeywords.size, otherKeywords.size);
    
    return similarity >= 0.5; // 50% de similarité minimum
  }

  // Factory methods
  static fromString(str) {
    return new ProductName(str);
  }

  static isValid(value) {
    try {
      new ProductName(value);
      return true;
    } catch {
      return false;
    }
  }
}
