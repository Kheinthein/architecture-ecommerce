// Service métier : Lister les commandes
import { RepositoryFactory } from '../../data/RepositoryFactory.js';

const orderRepository = RepositoryFactory.createOrderRepository();

export const execute = () => {
  return orderRepository.findAll();
};
