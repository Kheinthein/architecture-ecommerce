// Service métier : Récupérer le panier
import { CartRepositoryInMemory } from '../../data/memory/CartRepositoryInMemory.js';

const cartRepository = new CartRepositoryInMemory();

export const execute = () => {
  return cartRepository.getCart();
};
