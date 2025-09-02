// Service métier : Ajouter au panier
import { CartRepositoryInMemory } from '../../data/memory/CartRepositoryInMemory.js';

const cartRepository = new CartRepositoryInMemory();

export const execute = (productId, quantity) => {
  // Validation
  if (!productId || !quantity || 
      typeof productId !== 'number' || typeof quantity !== 'number' ||
      productId <= 0 || quantity <= 0) {
    throw new Error('productId et quantity sont requis');
  }

  cartRepository.addToCart(productId, quantity);
};
