/**
 * Cart Presentation - DTO JSON pour Cart
 * Formatage des données Cart pour l'exposition HTTP
 */
export class CartDto {
  /**
   * Transforme une entité Cart en DTO pour l'API
   */
  static fromDomain(cart, products = []) {
    if (!cart) {
      return null;
    }

    // Enrichir les items avec les infos produits si disponibles
    const enrichedItems = cart.items.map(item => {
      const product = products.find(p => p.id.equals(item.productId));
      
      return {
        productId: item.productId.value,
        quantity: item.quantity.value,
        ...(product && {
          product: {
            name: product.name,
            price: {
              amount: product.price.amount,
              currency: product.price.currency,
              formatted: product.price.toString()
            },
            subtotal: {
              amount: product.price.amount * item.quantity.value,
              currency: product.price.currency,
              formatted: product.price.multiply(item.quantity.value).toString()
            }
          }
        })
      };
    });

    return {
      id: cart.id,
      items: enrichedItems,
      summary: {
        totalItems: cart.getTotalItems().value,
        itemCount: cart.items.length,
        isEmpty: cart.isEmpty(),
        ...(products.length > 0 && {
          total: {
            amount: cart.calculateTotal(products).amount,
            currency: cart.calculateTotal(products).currency,
            formatted: cart.calculateTotal(products).toString()
          }
        })
      },
      actions: {
        canAddMore: !cart.isEmpty(), // Logique métier à affiner
        canCheckout: !cart.isEmpty()
      },
      metadata: {
        createdAt: cart.createdAt.toISOString(),
        lastUpdated: new Date().toISOString()
      }
    };
  }

  /**
   * DTO pour réponse d'ajout au panier
   */
  static createAddItemResponse(cart, productId, quantity, message = null) {
    const cartDto = CartDto.fromDomain(cart);
    
    return {
      success: true,
      data: cartDto,
      action: {
        type: 'ITEM_ADDED',
        productId: productId,
        quantity: quantity
      },
      message: message || `Produit ${productId} ajouté au panier (quantité: ${quantity})`
    };
  }

  /**
   * DTO pour réponse de suppression d'item
   */
  static createRemoveItemResponse(cart, productId, message = null) {
    const cartDto = CartDto.fromDomain(cart);
    
    return {
      success: true,
      data: cartDto,
      action: {
        type: 'ITEM_REMOVED',
        productId: productId
      },
      message: message || `Produit ${productId} supprimé du panier`
    };
  }

  /**
   * DTO pour réponse de vidage du panier
   */
  static createClearResponse(cart, message = null) {
    const cartDto = CartDto.fromDomain(cart);
    
    return {
      success: true,
      data: cartDto,
      action: {
        type: 'CART_CLEARED'
      },
      message: message || 'Panier vidé avec succès'
    };
  }

  /**
   * DTO simplifié pour récapitulatif
   */
  static toSummary(cart) {
    return {
      id: cart.id,
      totalItems: cart.getTotalItems().value,
      itemCount: cart.items.length,
      isEmpty: cart.isEmpty()
    };
  }

  /**
   * DTO pour intégration avec d'autres domaines (ex: orders)
   */
  static toCheckoutData(cart, products) {
    return {
      cartId: cart.id,
      items: cart.items.map(item => {
        const product = products.find(p => p.id.equals(item.productId));
        return {
          productId: item.productId.value,
          quantity: item.quantity.value,
          unitPrice: product ? product.price.amount : 0,
          name: product ? product.name : 'Produit inconnu'
        };
      }),
      total: products.length > 0 ? cart.calculateTotal(products).amount : 0
    };
  }
}
