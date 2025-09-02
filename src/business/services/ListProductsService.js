// Service métier : Lister les produits
import { ProductRepositoryInMemory } from '../../data/memory/ProductRepositoryInMemory.js';

const productRepository = new ProductRepositoryInMemory();

export const execute = () => {
  return productRepository.findAll();
};
