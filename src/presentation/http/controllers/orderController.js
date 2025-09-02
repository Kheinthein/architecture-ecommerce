import * as CheckoutOrderService from '../../../business/services/CheckoutOrderService.js';
import * as ListOrdersService from '../../../business/services/ListOrdersService.js';

export const getAllOrders = (req, res) => {
  const orders = ListOrdersService.execute();
  res.json(orders);
};

export const createOrder = (req, res) => {
  const newOrder = CheckoutOrderService.execute();
  res.json(newOrder);
};