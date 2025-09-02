// Implementation en mémoire de ProductRepository
import { ProductRepository } from '../repositories/ProductRepository.js';
import { state } from '../state.js';

export class ProductRepositoryInMemory extends ProductRepository {
  findAll() {
    return [...state.products].sort((a, b) => a.id - b.id);
  }

  findById(id) {
    return state.products.find(product => product.id === id) || null;
  }
}
