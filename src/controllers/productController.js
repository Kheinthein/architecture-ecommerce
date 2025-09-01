import * as productService from '../services/productService.js';

export const getAllProducts = (req, res) => {
  const products = productService.getAllProducts();
  res.json(products);
};