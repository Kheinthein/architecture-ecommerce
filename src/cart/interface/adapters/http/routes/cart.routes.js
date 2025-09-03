/**
 * Cart Interface - Routes HTTP
 * Définit les routes /cart pour le domaine Cart
 */
import { Router } from 'express';

export function createCartRoutes(cartController) {
  const router = Router();

  // GET /cart/:cartId - Récupérer un panier
  router.get('/:cartId', (req, res, next) => {
    cartController.getCart(req, res, next);
  });

  // POST /cart/:cartId/items - Ajouter un produit au panier
  router.post('/:cartId/items', (req, res, next) => {
    cartController.addToCart(req, res, next);
  });

  // DELETE /cart/:cartId/items/:productId - Supprimer un produit du panier
  router.delete('/:cartId/items/:productId', (req, res, next) => {
    cartController.removeFromCart(req, res, next);
  });

  // DELETE /cart/:cartId - Vider le panier
  router.delete('/:cartId', (req, res, next) => {
    cartController.clearCart(req, res, next);
  });

  return router;
}
