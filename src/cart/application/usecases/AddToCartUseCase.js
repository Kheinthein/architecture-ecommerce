/**
 * Cart Application - Use Case: Ajouter un produit au panier
 * Orchestration pure pour l'ajout d'articles au panier
 */
import { BusinessRuleError, NotFoundError, ValidationError } from '../../../shared-kernel/errors/DomainError.js';
import { PositiveInt } from '../../../shared-kernel/value-objects/PositiveInt.js';
import { Cart } from '../../domain/entities/Cart.js';
import { Quantity } from '../../domain/value-objects/Quantity.js';

export class AddToCartUseCase {
  constructor(cartRepository, productRepository) {
    if (!cartRepository) {
      throw new Error('CartRepository is required');
    }
    if (!productRepository) {
      throw new Error('ProductRepository is required');
    }
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  /**
   * Exécute le cas d'usage
   * @param {string} cartId - L'ID du panier
   * @param {number} productId - L'ID du produit à ajouter
   * @param {number} quantity - La quantité à ajouter (défaut: 1)
   * @returns {Promise<Cart>} Le panier mis à jour
   */
  async execute(cartId, productId, quantity = 1) {
    // Validation des entrées
    this.#validateInputs(cartId, productId, quantity);

    const productIdVO = new PositiveInt(productId);
    const quantityVO = new Quantity(quantity);

    try {
      // Vérifier que le produit existe et a du stock
      const product = await this.productRepository.findById(productIdVO);
      if (!product) {
        throw new NotFoundError('Product', productId);
      }

      if (!product.hasStock(quantityVO)) {
        throw new BusinessRuleError(
          `Insufficient stock for product ${product.name}. Available: ${product.stock.value}`,
          'INSUFFICIENT_STOCK'
        );
      }

      // Récupérer ou créer le panier
      let cart = await this.cartRepository.findById(cartId);
      if (!cart) {
        cart = new Cart(cartId);
      }

      // Ajouter le produit au panier (logique métier)
      const updatedCart = cart.addItem(productIdVO, quantityVO);

      // Sauvegarder le panier mis à jour
      return await this.cartRepository.save(updatedCart);

    } catch (error) {
      // Re-lancer les erreurs du domaine telles quelles
      if (error instanceof ValidationError || 
          error instanceof NotFoundError || 
          error instanceof BusinessRuleError) {
        throw error;
      }
      
      // Encapsuler les autres erreurs
      throw new Error(`Error adding to cart: ${error.message}`);
    }
  }

  #validateInputs(cartId, productId, quantity) {
    if (!cartId || typeof cartId !== 'string') {
      throw new ValidationError('Cart ID must be a non-empty string', 'cartId', cartId);
    }

    try {
      new PositiveInt(productId);
    } catch (error) {
      throw new ValidationError('Product ID must be a positive integer', 'productId', productId);
    }

    try {
      new Quantity(quantity);
    } catch (error) {
      throw new ValidationError(error.message, 'quantity', quantity);
    }
  }
}
