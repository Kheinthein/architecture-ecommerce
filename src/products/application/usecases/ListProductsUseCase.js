/**
 * Products Application - Use Case: Lister tous les produits
 * Orchestration pure pour récupérer le catalogue produits
 */
export class ListProductsUseCase {
  constructor(productRepository) {
    if (!productRepository) {
      throw new Error('ProductRepository is required');
    }
    this.productRepository = productRepository;
  }

  /**
   * Exécute le cas d'usage
   * @returns {Promise<Product[]>} Liste des produits du catalogue
   */
  async execute() {
    try {
      const products = await this.productRepository.findAll();
      
      // Tri par ID pour un ordre cohérent
      return products.sort((a, b) => a.id.value - b.id.value);
    } catch (error) {
      throw new Error(`Error retrieving products: ${error.message}`);
    }
  }
}
