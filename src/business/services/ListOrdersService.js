// Service métier : Lister les commandes
import { OrderRepositoryInMemory } from '../../data/memory/OrderRepositoryInMemory.js';

const orderRepository = new OrderRepositoryInMemory();

export const execute = () => {
  return orderRepository.findAll();
};
