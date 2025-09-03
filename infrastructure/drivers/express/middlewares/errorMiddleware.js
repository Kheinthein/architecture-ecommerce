/**
 * Infrastructure Express - Middleware d'erreurs
 * Traduit les erreurs métier en statuts HTTP appropriés
 */
import { BusinessRuleError, ConflictError, NotFoundError, ValidationError } from '../../../../src/shared-kernel/errors/DomainError.js';

export function errorMiddleware(error, req, res, next) {
  // Log de l'erreur pour debug
  console.error('Erreur capturée:', {
    name: error.name,
    message: error.message,
    code: error.code,
    path: req.originalUrl,
    method: req.method
  });

  // Mapping des erreurs du domaine vers les codes HTTP
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: error.message,
      code: error.code,
      field: error.context?.field,
      timestamp: new Date().toISOString()
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: error.message,
      code: error.code,
      resource: error.context?.resource,
      timestamp: new Date().toISOString()
    });
  }

  if (error instanceof BusinessRuleError || error instanceof ConflictError) {
    return res.status(409).json({
      success: false,
      error: error.message,
      code: error.code,
      rule: error.context?.rule,
      timestamp: new Date().toISOString()
    });
  }

  // Erreur générique/inconnue
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erreur interne du serveur' 
    : error.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
}
