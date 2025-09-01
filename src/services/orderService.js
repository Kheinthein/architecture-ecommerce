let orders = [];
let orderIdCounter = 1;

export const getAllOrders = () => {
  return orders;
};

export const createOrder = () => {
  const newOrder = {
    id: orderIdCounter++,
    createdAt: new Date().toISOString(),
    status: 'PENDING'
  };

  orders.push(newOrder);
  return newOrder;
};