// Implementation en mémoire de OrderRepository
import { OrderRepository } from '../repositories/OrderRepository.js';
import { state } from '../state.js';

export class OrderRepositoryInMemory extends OrderRepository {
  findAll() {
    return [...state.orders];
  }

  findById(id) {
    return state.orders.find(order => order.id === id) || null;
  }

  create(orderData = {}) {
    const newOrder = {
      id: state.orderIdCounter++,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      ...orderData
    };

    state.orders.push(newOrder);
    return newOrder;
  }
}
