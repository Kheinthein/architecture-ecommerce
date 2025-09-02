import * as ListProductsService from '../../../business/services/ListProductsService.js';

export const getAllProducts = (req, res) => {
  const products = ListProductsService.execute();
  res.json(products);
};