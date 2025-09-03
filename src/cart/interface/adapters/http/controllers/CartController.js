/**
 * Cart Interface - HTTP Controller
 * Mappe les requêtes HTTP vers les Use Cases Cart
 */
export class CartController {
  constructor(addToCartUseCase, getCartUseCase, removeFromCartUseCase, clearCartUseCase) {
    if (!addToCartUseCase) {
      throw new Error('AddToCartUseCase est requis');
    }
    this.addToCartUseCase = addToCartUseCase;
    this.getCartUseCase = getCartUseCase;
    this.removeFromCartUseCase = removeFromCartUseCase;
    this.clearCartUseCase = clearCartUseCase;
  }

  /**
   * POST /cart/:cartId/items - Ajouter un produit au panier
   */
  async addToCart(req, res, next) {
    try {
      const { cartId } = req.params;
      const { productId, quantity = 1 } = req.body;

      // Validation des entrées HTTP
      if (!productId) {
        return res.status(400).json({
          success: false,
          error: 'productId est requis',
          field: 'productId'
        });
      }

      const cart = await this.addToCartUseCase.execute(
        cartId, 
        parseInt(productId), 
        parseInt(quantity)
      );
      
      // Transformation vers DTO de présentation
      const cartResponse = {
        id: cart.id,
        items: cart.items.map(item => ({
          productId: item.productId.value,
          quantity: item.quantity.value
        })),
        summary: {
          totalItems: cart.getTotalItems().value,
          isEmpty: cart.isEmpty()
        },
        actions: {
          canAddMore: true, // Logique métier à implémenter
          maxQuantityReached: false
        },
        metadata: {
          lastUpdated: new Date().toISOString(),
          createdAt: cart.createdAt.toISOString()
        }
      };

      res.status(200).json({
        success: true,
        data: cartResponse,
        message: `Produit ${productId} ajouté au panier (quantité: ${quantity})`
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /cart/:cartId - Récupérer un panier
   */
  async getCart(req, res, next) {
    try {
      const { cartId } = req.params;
      
      // TODO: Implémenter GetCartUseCase complet
      res.status(501).json({
        success: false,
        error: 'Endpoint non encore implémenté',
        message: 'GET /cart/:cartId sera disponible avec GetCartUseCase complet'
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /cart/:cartId/items/:productId - Supprimer un produit du panier
   */
  async removeFromCart(req, res, next) {
    try {
      const { cartId, productId } = req.params;
      
      // TODO: Implémenter RemoveFromCartUseCase
      res.status(501).json({
        success: false,
        error: 'Endpoint non encore implémenté',
        message: `DELETE /cart/${cartId}/items/${productId} sera disponible avec RemoveFromCartUseCase`
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /cart/:cartId - Vider le panier
   */
  async clearCart(req, res, next) {
    try {
      const { cartId } = req.params;
      
      // TODO: Implémenter ClearCartUseCase
      res.status(501).json({
        success: false,
        error: 'Endpoint non encore implémenté',
        message: `DELETE /cart/${cartId} sera disponible avec ClearCartUseCase`
      });

    } catch (error) {
      next(error);
    }
  }
}
