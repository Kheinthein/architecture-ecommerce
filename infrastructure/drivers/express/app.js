/**
 * Infrastructure Express - Configuration de l'application
 * Point d'entrée pour configurer Express avec notre architecture DDD
 */
import express from 'express';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

export function createExpressApp(diContainer) {
  const app = express();

  // Middlewares de base
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS simple pour développement
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Route de santé
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'API E-commerce - Architecture DDD + Clean',
      architecture: 'Bounded Contexts',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // 🛍️ Routes Products
  app.get('/api/products', async (req, res, next) => {
    try {
      const useCase = diContainer.getListProductsUseCase();
      const products = await useCase.execute();
      
      const productsDTO = products.map(product => product.toJSON());
      
      res.json({
        success: true,
        data: productsDTO,
        count: productsDTO.length
      });
    } catch (error) {
      next(error);
    }
  });

  // 🛒 Routes Cart
  app.post('/api/cart/:cartId/items', async (req, res, next) => {
    try {
      const { cartId } = req.params;
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          error: 'productId est requis'
        });
      }

      const useCase = diContainer.getAddToCartUseCase();
      const cart = await useCase.execute(cartId, parseInt(productId), parseInt(quantity));
      
      const cartDTO = cart.toJSON();
      
      res.json({
        success: true,
        data: {
          ...cartDTO,
          message: `Produit ${productId} ajouté au panier (quantité: ${quantity})`
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // 🛒 Récupérer un panier (simulé pour l'instant)
  app.get('/api/cart/:cartId', async (req, res, next) => {
    try {
      const { cartId } = req.params;
      
      // Pour l'instant, on simule un panier vide
      res.json({
        success: true,
        data: {
          id: cartId,
          items: [],
          totalItems: 0,
          isEmpty: true,
          message: 'Panier trouvé (ou créé s\'il n\'existait pas)'
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // Gestionnaire d'erreurs (doit être en dernier)
  app.use(errorMiddleware);

  // Gestionnaire 404
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `Route non trouvée: ${req.method} ${req.originalUrl}`,
      timestamp: new Date().toISOString()
    });
  });

  return app;
}
