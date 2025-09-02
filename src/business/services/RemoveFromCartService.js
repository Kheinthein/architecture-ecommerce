// Service métier : Retirer du panier
import { RepositoryFactory } from '../../data/RepositoryFactory.js';

const cartRepository = RepositoryFactory.createCartRepository();

export const execute = (productId) => {
  if (!productId || typeof productId !== 'number' || productId <= 0) {
    throw new Error('productId est requis et doit être un nombre positif');
  }

  cartRepository.removeFromCart(productId);
};
