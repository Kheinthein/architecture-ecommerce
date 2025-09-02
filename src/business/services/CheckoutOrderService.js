// Service métier : Créer une commande
import { OrderRepositoryInMemory } from '../../data/memory/OrderRepositoryInMemory.js';

const orderRepository = new OrderRepositoryInMemory();

export const execute = () => {
  return orderRepository.create();
};
