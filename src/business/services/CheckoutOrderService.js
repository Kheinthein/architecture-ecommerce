// Service métier : Créer une commande
import { RepositoryFactory } from '../../data/RepositoryFactory.js';

const orderRepository = RepositoryFactory.createOrderRepository();

export const execute = () => {
  return orderRepository.create();
};
