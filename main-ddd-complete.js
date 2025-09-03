#!/usr/bin/env node

/**
 * Main DDD Complete - Point d'entrée avec architecture DDD conforme
 * Utilise la nouvelle structure complète conforme au modèle
 */
import { DIMemoryContainer } from './config/di.memory.js';
import { startDDDServer } from './infrastructure/drivers/express/server-ddd.js';
import { env } from './infrastructure/shared/env.js';
import { logger } from './infrastructure/shared/logger.js';

// 🔧 Configuration
const PORT = env.port;

// 🛡️ Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.technicalError(error, { context: 'uncaughtException' });
  console.error('💥 Erreur non capturée:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.technicalError(new Error(reason), { context: 'unhandledRejection', promise });
  console.error('💥 Rejection non gérée:', reason);
  process.exit(1);
});

// 🚀 Bootstrap de l'application
async function bootstrap() {
  try {
    // 1. Initialiser le container DI
    logger.info('Initialisation du container DI Memory...');
    const diContainer = new DIMemoryContainer();
    
    // 2. Démarrer le serveur
    logger.info(`Démarrage du serveur sur le port ${PORT}...`);
    const server = await startDDDServer(diContainer, PORT);
    
    // 3. Log de confirmation
    logger.businessOperation('Application Started', {
      port: PORT,
      nodeEnv: env.nodeEnv,
      dbType: env.dbType,
      boundedContexts: ['products', 'cart']
    });

  } catch (error) {
    logger.technicalError(error, { context: 'bootstrap' });
    console.error('❌ Erreur démarrage application:', error.message);
    process.exit(1);
  }
}

// 🎯 Point d'entrée
bootstrap().catch(error => {
  console.error('💥 Erreur fatale lors du bootstrap:', error);
  process.exit(1);
});
