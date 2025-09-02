// Service métier : Vider le panier
import { CartRepositoryInMemory } from '../../data/memory/CartRepositoryInMemory.js';

const cartRepository = new CartRepositoryInMemory();

export const execute = () => {
  cartRepository.clearCart();
};
