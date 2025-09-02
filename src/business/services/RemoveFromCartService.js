// Service métier : Retirer du panier
import { CartRepositoryInMemory } from '../../data/memory/CartRepositoryInMemory.js';

const cartRepository = new CartRepositoryInMemory();

export const execute = (productId) => {
  if (!productId || typeof productId !== 'number' || productId <= 0) {
    throw new Error('productId est requis et doit être un nombre positif');
  }

  cartRepository.removeFromCart(productId);
};
