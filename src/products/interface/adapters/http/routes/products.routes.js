/**
 * Products Interface - Routes HTTP
 * Définit les routes /products pour le domaine Products
 */
import { Router } from 'express';

export function createProductsRoutes(productsController) {
  const router = Router();

  // GET /products - Liste des produits
  router.get('/', (req, res, next) => {
    productsController.getAllProducts(req, res, next);
  });

  // GET /products/:id - Détail d'un produit
  router.get('/:id', (req, res, next) => {
    productsController.getProductById(req, res, next);
  });

  return router;
}
