/**
 * Infrastructure Shared - Logger
 * Logger technique centralisé avec niveaux et formatage
 */
import { env } from './env.js';

export class Logger {
  constructor(context = 'APP') {
    this.context = context;
    this.level = this.#getLevelNumber(env.logLevel);
    this.format = env.logFormat;
  }

  #getLevelNumber(levelName) {
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    return levels[levelName] || 2;
  }

  #shouldLog(level) {
    const levelNumbers = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    return levelNumbers[level] <= this.level;
  }

  #formatMessage(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      context: this.context,
      message,
      ...data
    };

    if (this.format === 'json') {
      return JSON.stringify(logEntry);
    }

    // Format texte pour développement
    let formatted = `[${timestamp}] ${level.toUpperCase()} [${this.context}] ${message}`;
    
    if (Object.keys(data).length > 0) {
      formatted += ` ${JSON.stringify(data)}`;
    }
    
    return formatted;
  }

  #output(level, message, data = {}) {
    if (!this.#shouldLog(level)) return;
    
    const formatted = this.#formatMessage(level, message, data);
    
    // Utiliser stderr pour error et warn
    if (level === 'error' || level === 'warn') {
      console.error(formatted);
    } else {
      console.log(formatted);
    }
  }

  // Méthodes de logging
  error(message, data = {}) {
    this.#output('error', message, data);
  }

  warn(message, data = {}) {
    this.#output('warn', message, data);
  }

  info(message, data = {}) {
    this.#output('info', message, data);
  }

  debug(message, data = {}) {
    this.#output('debug', message, data);
  }

  // Méthodes spécialisées pour l'application
  
  /**
   * Log une requête HTTP
   */
  httpRequest(req, res, duration) {
    this.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    });
  }

  /**
   * Log une erreur métier
   */
  domainError(error, context = {}) {
    this.error('Domain Error', {
      name: error.name,
      message: error.message,
      code: error.code,
      ...context,
      ...(error.context || {})
    });
  }

  /**
   * Log une erreur technique
   */
  technicalError(error, context = {}) {
    this.error('Technical Error', {
      name: error.name,
      message: error.message,
      stack: env.isDevelopment() ? error.stack : undefined,
      ...context
    });
  }

  /**
   * Log une opération métier
   */
  businessOperation(operation, data = {}) {
    this.info('Business Operation', {
      operation,
      ...data
    });
  }

  /**
   * Log les performances
   */
  performance(operation, duration, data = {}) {
    const level = duration > 1000 ? 'warn' : 'debug';
    this[level]('Performance', {
      operation,
      duration: `${duration}ms`,
      ...data
    });
  }

  /**
   * Log de démarrage de l'application
   */
  startup(config) {
    this.info('Application Starting', {
      nodeEnv: config.nodeEnv,
      port: config.port,
      dbType: config.dbType,
      logLevel: config.logLevel
    });
  }

  /**
   * Log de fermeture de l'application
   */
  shutdown(reason = 'unknown') {
    this.info('Application Shutting Down', { reason });
  }

  // Factory pour créer des loggers contextuels
  static forContext(context) {
    return new Logger(context);
  }
}

// Loggers pré-configurés pour l'application
export const logger = new Logger('APP');
export const dbLogger = Logger.forContext('DB');
export const httpLogger = Logger.forContext('HTTP');
export const domainLogger = Logger.forContext('DOMAIN');
export const infraLogger = Logger.forContext('INFRA');

// Middleware Express pour logging automatique
export function createHttpLoggingMiddleware() {
  return (req, res, next) => {
    const start = Date.now();
    
    // Capturer la fin de la réponse
    const originalSend = res.send;
    res.send = function(data) {
      const duration = Date.now() - start;
      httpLogger.httpRequest(req, res, duration);
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}
