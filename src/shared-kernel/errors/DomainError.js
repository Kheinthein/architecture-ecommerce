/**
 * Shared Kernel - Erreur métier générique
 * Classe de base pour toutes les erreurs du domaine
 */
export class DomainError extends Error {
  constructor(message, code = null, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
    
    // Maintenir la stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp
    };
  }
}

/**
 * Erreur de validation des données
 */
export class ValidationError extends DomainError {
  constructor(message, field = null, value = null) {
    super(message, 'VALIDATION_ERROR', { field, value });
  }
}

/**
 * Erreur de règle métier
 */
export class BusinessRuleError extends DomainError {
  constructor(message, rule = null) {
    super(message, 'BUSINESS_RULE_ERROR', { rule });
  }
}

/**
 * Erreur de ressource non trouvée
 */
export class NotFoundError extends DomainError {
  constructor(resource, identifier) {
    super(`${resource} not found: ${identifier}`, 'NOT_FOUND', { resource, identifier });
  }
}

/**
 * Erreur de conflit métier
 */
export class ConflictError extends DomainError {
  constructor(message, conflictType = null) {
    super(message, 'CONFLICT_ERROR', { conflictType });
  }
}
