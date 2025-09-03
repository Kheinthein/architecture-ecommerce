/**
 * Products Interface - Port ProductRepository
 * Contrat que doivent respecter toutes les implémentations de persistance
 */
export class ProductRepository {
  /**
   * Récupère tous les produits
   * @returns {Promise<Product[]>} Liste de tous les produits
   */
  async findAll() {
    throw new Error('ProductRepository.findAll() must be implemented');
  }

  /**
   * Récupère un produit par son ID
   * @param {PositiveInt} id - L'ID du produit
   * @returns {Promise<Product|null>} Le produit trouvé ou null
   */
  async findById(id) {
    throw new Error('ProductRepository.findById() must be implemented');
  }

  /**
   * Récupère plusieurs produits par leurs IDs
   * @param {PositiveInt[]} ids - Liste des IDs des produits
   * @returns {Promise<Product[]>} Liste des produits trouvés
   */
  async findByIds(ids) {
    throw new Error('ProductRepository.findByIds() must be implemented');
  }

  /**
   * Sauvegarde un produit (création ou mise à jour)
   * @param {Product} product - Le produit à sauvegarder
   * @returns {Promise<Product>} Le produit sauvegardé
   */
  async save(product) {
    throw new Error('ProductRepository.save() must be implemented');
  }

  /**
   * Vérifie si un produit existe
   * @param {PositiveInt} id - L'ID du produit
   * @returns {Promise<boolean>} True si le produit existe
   */
  async exists(id) {
    throw new Error('ProductRepository.exists() must be implemented');
  }
}
