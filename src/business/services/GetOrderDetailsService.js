// Service métier : Récupérer les détails d'une commande
import { OrderRepositoryInMemory } from '../../data/memory/OrderRepositoryInMemory.js';

const orderRepository = new OrderRepositoryInMemory();

export const execute = (orderId) => {
  return orderRepository.findById(orderId);
};
