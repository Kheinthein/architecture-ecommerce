// Service métier : Récupérer le panier
import { RepositoryFactory } from '../../data/RepositoryFactory.js';

const cartRepository = RepositoryFactory.createCartRepository();

export const execute = () => {
  return cartRepository.getCart();
};
