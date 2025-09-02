// Service métier : Lister les produits
import { RepositoryFactory } from '../../data/RepositoryFactory.js';

const productRepository = RepositoryFactory.createProductRepository();

export const execute = () => {
  return productRepository.findAll();
};
