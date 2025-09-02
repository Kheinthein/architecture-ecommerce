// Service métier : Vider le panier
import { RepositoryFactory } from '../../data/RepositoryFactory.js';

const cartRepository = RepositoryFactory.createCartRepository();

export const execute = () => {
  cartRepository.clearCart();
};
