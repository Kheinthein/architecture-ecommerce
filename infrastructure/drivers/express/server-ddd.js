/**
 * Infrastructure Express - Serveur DDD Complet
 * Bootstrap du serveur avec la nouvelle architecture DDD conforme
 */
import express, { json } from 'express';
import { env } from '../../shared/env.js';
import { createHttpLoggingMiddleware, logger } from '../../shared/logger.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

// Import des controllers avec la nouvelle structure
import { CartController } from '../../../src/cart/interface/adapters/http/controllers/CartController.js';
import { ProductsController } from '../../../src/products/interface/adapters/http/controllers/ProductsController.js';

// Import des routes avec la nouvelle structure
import { createCartRoutes } from '../../../src/cart/interface/adapters/http/routes/cart.routes.js';
import { createProductsRoutes } from '../../../src/products/interface/adapters/http/routes/products.routes.js';

export const createDDDServer = (diContainer) => {
  const app = express();
  
  // 🔧 Middlewares globaux
  app.use(json({ limit: '10mb' }));
  app.use(createHttpLoggingMiddleware());
  
  // 🏥 Health check
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'E-commerce DDD API',
      version: '1.0.0',
      environment: env.nodeEnv,
      database: env.dbType,
      boundedContexts: ['products', 'cart'],
      architecture: {
        pattern: 'DDD + Clean Architecture',
        layers: ['Domain', 'Application', 'Interface Adapters', 'Infrastructure']
      }
    });
  });

  // 🏗️ Controllers avec DI
  const productsController = new ProductsController(
    diContainer.getListProductsUseCase()
  );

  const cartController = new CartController(
    diContainer.getAddToCartUseCase(),
    diContainer.getGetCartUseCase?.() || null,
    diContainer.getRemoveFromCartUseCase?.() || null,
    diContainer.getClearCartUseCase?.() || null
  );

  // 🛣️ Routes par domaine
  app.use('/api/products', createProductsRoutes(productsController));
  app.use('/api/cart', createCartRoutes(cartController));

  // 📊 API Info endpoint
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      api: 'E-commerce DDD',
      version: '1.0.0',
      architecture: 'Domain-Driven Design + Clean Architecture',
      documentation: {
        health: 'GET /health',
        products: {
          list: 'GET /api/products',
          detail: 'GET /api/products/:id (à venir)'
        },
        cart: {
          get: 'GET /api/cart/:cartId',
          addItem: 'POST /api/cart/:cartId/items',
          removeItem: 'DELETE /api/cart/:cartId/items/:productId (à venir)',
          clear: 'DELETE /api/cart/:cartId (à venir)'
        }
      },
      boundedContexts: [
        {
          name: 'Products',
          entities: ['Product'],
          valueObjects: ['ProductName', 'Sku'],
          useCases: ['ListProductsUseCase']
        },
        {
          name: 'Cart',
          entities: ['Cart'],
          valueObjects: ['Quantity'],
          useCases: ['AddToCartUseCase'],
          services: ['CartPricingService']
        }
      ],
      sharedKernel: {
        valueObjects: ['Money', 'PositiveInt', 'Currency'],
        errors: ['DomainError', 'ValidationError', 'BusinessRuleError', 'NotFoundError']
      }
    });
  });

  // ❌ Gestion des erreurs
  app.use(errorMiddleware);

  // 🔍 Handler 404
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route non trouvée',
      path: req.originalUrl,
      method: req.method,
      availableEndpoints: [
        'GET /health',
        'GET /api',
        'GET /api/products',
        'POST /api/cart/:cartId/items',
        'GET /api/cart/:cartId'
      ]
    });
  });

  return app;
};

export const startDDDServer = (diContainer, port = env.port) => {
  const app = createDDDServer(diContainer);
  
  return new Promise((resolve, reject) => {
    const server = app.listen(port, (error) => {
      if (error) {
        reject(error);
        return;
      }

      // 🎯 Logs de démarrage enrichis
      logger.startup(env.toSafeJSON());
      
      console.log('🎯 Démarrage API E-commerce - Architecture DDD');
      console.log('📚 Bounded Contexts: Products, Cart');
      console.log('💎 Value Objects: Money, PositiveInt, Quantity, ProductName, Sku');
      console.log('🏗️ Clean Architecture: Domain → Application → Interface → Infrastructure');
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
      console.log('🏗️ Architecture: DDD + Clean Architecture');
      console.log('📦 Bounded Contexts: Products ✅, Cart ✅');
      console.log(`💾 Persistance: ${env.dbType.toUpperCase()}`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
      console.log(`📊 API Info: http://localhost:${port}/api`);
      console.log('📚 API Endpoints:');
      console.log('   GET    /api/products              - Liste des produits');
      console.log('   GET    /api/cart/:cartId          - Récupérer un panier');
      console.log('   POST   /api/cart/:cartId/items    - Ajouter au panier');
      console.log('✅ Architecture DDD conforme au modèle !');
      console.log('🧪 Testez les endpoints:');
      console.log(`   curl http://localhost:${port}/api/products`);
      console.log(`   curl -X POST http://localhost:${port}/api/cart/user123/items -H "Content-Type: application/json" -d '{"productId":1,"quantity":2}'`);

      resolve(server);
    });

    // 🛑 Gestion propre de l'arrêt
    const gracefulShutdown = (signal) => {
      logger.shutdown(signal);
      console.log(`\n🛑 Signal ${signal} reçu, arrêt du serveur...`);
      
      server.close(() => {
        console.log('✅ Serveur fermé proprement');
        
        // Nettoyer les ressources DI si nécessaire
        if (diContainer.cleanup && typeof diContainer.cleanup === 'function') {
          diContainer.cleanup();
        }
        
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  });
};
