/**
 * Products Presentation - DTO JSON pour Product
 * Formatage des données Product pour l'exposition HTTP
 */
export class ProductDto {
  /**
   * Transforme une entité Product en DTO pour l'API
   */
  static fromDomain(product) {
    if (!product) {
      return null;
    }

    return {
      id: product.id.value,
      name: product.name,
      price: {
        amount: product.price.amount,
        currency: product.price.currency,
        formatted: product.price.toString()
      },
      stock: {
        quantity: product.stock.value,
        available: product.isAvailable(),
        status: product.isAvailable() ? 'IN_STOCK' : 'OUT_OF_STOCK'
      },
      metadata: {
        createdAt: product.createdAt.toISOString()
      }
    };
  }

  /**
   * Transforme une liste d'entités Product en DTOs
   */
  static fromDomainList(products) {
    if (!Array.isArray(products)) {
      return [];
    }

    return products.map(product => ProductDto.fromDomain(product));
  }

  /**
   * DTO pour liste de produits avec métadonnées
   */
  static createListResponse(products, metadata = {}) {
    const productsDto = ProductDto.fromDomainList(products);
    
    return {
      success: true,
      data: productsDto,
      meta: {
        count: productsDto.length,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
  }

  /**
   * DTO pour un produit unique
   */
  static createSingleResponse(product, metadata = {}) {
    const productDto = ProductDto.fromDomain(product);
    
    return {
      success: true,
      data: productDto,
      meta: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
  }

  /**
   * DTO simplifié pour utilisation dans d'autres contextes (ex: panier)
   */
  static toReference(product) {
    return {
      id: product.id.value,
      name: product.name,
      price: product.price.amount,
      currency: product.price.currency
    };
  }
}
