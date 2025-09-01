import * as orderService from '../services/orderService.js';

export const getAllOrders = (req, res) => {
  const orders = orderService.getAllOrders();
  res.json(orders);
};

export const createOrder = (req, res) => {
  const newOrder = orderService.createOrder();
  res.json(newOrder);
};