/**
 * Infrastructure Shared - Environment Configuration
 * Helper pour charger et valider les variables d'environnement
 */
import { ValidationError } from '../../src/shared-kernel/errors/DomainError.js';

export class EnvironmentConfig {
  constructor() {
    this.config = this.#loadConfig();
    this.#validateConfig();
    
    Object.freeze(this.config);
    Object.freeze(this);
  }

  #loadConfig() {
    return {
      // 🚀 Application
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: parseInt(process.env.PORT || '3000', 10),
      
      // 📊 Database
      DB_TYPE: process.env.DB_TYPE || 'memory', // 'memory' | 'sqlite'
      DB_PATH: process.env.DB_PATH || './var/ecommerce.sqlite',
      
      // 🔒 Security
      JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
      API_RATE_LIMIT: parseInt(process.env.API_RATE_LIMIT || '100', 10),
      
      // 📝 Logging
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      LOG_FORMAT: process.env.LOG_FORMAT || 'json',
      
      // 💰 Business Rules
      MAX_CART_ITEMS: parseInt(process.env.MAX_CART_ITEMS || '99', 10),
      FREE_SHIPPING_THRESHOLD: parseFloat(process.env.FREE_SHIPPING_THRESHOLD || '50.0'),
      DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'EUR',
      
      // 🧪 Test
      TEST_DB_PATH: process.env.TEST_DB_PATH || './var/test.sqlite',
      
      // 🏥 Health
      HEALTH_CHECK_ENABLED: process.env.HEALTH_CHECK_ENABLED !== 'false'
    };
  }

  #validateConfig() {
    const errors = [];

    // Valider NODE_ENV
    if (!['development', 'production', 'test'].includes(this.config.NODE_ENV)) {
      errors.push('NODE_ENV doit être: development, production, ou test');
    }

    // Valider PORT
    if (this.config.PORT < 1 || this.config.PORT > 65535) {
      errors.push('PORT doit être entre 1 et 65535');
    }

    // Valider DB_TYPE
    if (!['memory', 'sqlite'].includes(this.config.DB_TYPE)) {
      errors.push('DB_TYPE doit être: memory ou sqlite');
    }

    // Valider LOG_LEVEL
    if (!['error', 'warn', 'info', 'debug'].includes(this.config.LOG_LEVEL)) {
      errors.push('LOG_LEVEL doit être: error, warn, info, ou debug');
    }

    // Valider DEFAULT_CURRENCY
    if (!/^[A-Z]{3}$/.test(this.config.DEFAULT_CURRENCY)) {
      errors.push('DEFAULT_CURRENCY doit être un code ISO 3 lettres (ex: EUR)');
    }

    // Valider les valeurs numériques
    if (this.config.MAX_CART_ITEMS < 1 || this.config.MAX_CART_ITEMS > 999) {
      errors.push('MAX_CART_ITEMS doit être entre 1 et 999');
    }

    if (this.config.FREE_SHIPPING_THRESHOLD < 0) {
      errors.push('FREE_SHIPPING_THRESHOLD ne peut pas être négatif');
    }

    if (this.config.API_RATE_LIMIT < 1) {
      errors.push('API_RATE_LIMIT doit être au moins 1');
    }

    // Validation sécurité en production
    if (this.config.NODE_ENV === 'production') {
      if (this.config.JWT_SECRET === 'dev-secret-key') {
        errors.push('JWT_SECRET doit être défini en production');
      }
      
      if (this.config.JWT_SECRET.length < 32) {
        errors.push('JWT_SECRET doit contenir au moins 32 caractères en production');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(
        `Configuration environnement invalide: ${errors.join(', ')}`,
        'INVALID_ENVIRONMENT_CONFIG',
        { errors }
      );
    }
  }

  // Getters pour accès facile
  get nodeEnv() { return this.config.NODE_ENV; }
  get port() { return this.config.PORT; }
  get dbType() { return this.config.DB_TYPE; }
  get dbPath() { return this.config.DB_PATH; }
  get testDbPath() { return this.config.TEST_DB_PATH; }
  get logLevel() { return this.config.LOG_LEVEL; }
  get logFormat() { return this.config.LOG_FORMAT; }
  get jwtSecret() { return this.config.JWT_SECRET; }
  get apiRateLimit() { return this.config.API_RATE_LIMIT; }
  get maxCartItems() { return this.config.MAX_CART_ITEMS; }
  get freeShippingThreshold() { return this.config.FREE_SHIPPING_THRESHOLD; }
  get defaultCurrency() { return this.config.DEFAULT_CURRENCY; }
  get healthCheckEnabled() { return this.config.HEALTH_CHECK_ENABLED; }

  // Méthodes utilitaires
  isDevelopment() { return this.nodeEnv === 'development'; }
  isProduction() { return this.nodeEnv === 'production'; }
  isTest() { return this.nodeEnv === 'test'; }

  useMemoryDb() { return this.dbType === 'memory'; }
  useSqliteDb() { return this.dbType === 'sqlite'; }

  // Export de la configuration complète
  toJSON() {
    return { ...this.config };
  }

  // Affichage sécurisé (masque les secrets)
  toSafeJSON() {
    const safe = { ...this.config };
    
    // Masquer les données sensibles
    if (safe.JWT_SECRET) {
      safe.JWT_SECRET = safe.JWT_SECRET.substring(0, 4) + '***';
    }
    
    return safe;
  }

  // Validation d'une configuration personnalisée
  static validate(customConfig) {
    const tempConfig = new EnvironmentConfig();
    
    // Merger la config personnalisée
    Object.assign(tempConfig.config, customConfig);
    
    try {
      tempConfig.#validateConfig();
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        errors: error.context?.errors || [error.message] 
      };
    }
  }
}

// Instance singleton pour l'application
export const env = new EnvironmentConfig();
