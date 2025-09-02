// Service métier : Récupérer les détails d'une commande
import { RepositoryFactory } from '../../data/RepositoryFactory.js';

const orderRepository = RepositoryFactory.createOrderRepository();

export const execute = (orderId) => {
  return orderRepository.findById(orderId);
};
