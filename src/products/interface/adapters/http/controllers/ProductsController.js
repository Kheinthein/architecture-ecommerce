/**
 * Products Interface - HTTP Controller
 * Mappe les requêtes HTTP vers les Use Cases Products
 */
export class ProductsController {
  constructor(listProductsUseCase) {
    if (!listProductsUseCase) {
      throw new Error('ListProductsUseCase est requis');
    }
    this.listProductsUseCase = listProductsUseCase;
  }

  /**
   * GET /products - Lister tous les produits du catalogue
   */
  async getAllProducts(req, res, next) {
    try {
      const products = await this.listProductsUseCase.execute();
      
      // Transformation vers DTO de présentation
      const productsResponse = products.map(product => ({
        id: product.id.value,
        name: product.name,
        price: {
          amount: product.price.amount,
          currency: product.price.currency,
          formatted: product.price.toString()
        },
        stock: product.stock.value,
        availability: {
          available: product.isAvailable(),
          status: product.isAvailable() ? 'IN_STOCK' : 'OUT_OF_STOCK'
        },
        metadata: {
          createdAt: product.createdAt.toISOString()
        }
      }));

      res.status(200).json({
        success: true,
        data: productsResponse,
        meta: {
          count: productsResponse.length,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /products/:id - Récupérer un produit spécifique
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      
      // TODO: Implémenter GetProductByIdUseCase
      res.status(501).json({
        success: false,
        error: 'Endpoint non encore implémenté',
        message: `GET /products/${id} sera disponible avec GetProductByIdUseCase`
      });

    } catch (error) {
      next(error);
    }
  }
}
