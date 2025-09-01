import express from 'express';

const router = express.Router();


let orders = [];
let orderIdCounter = 1;


router.get('/', (req, res) => {
  res.json(orders);
});


router.post('/', (req, res) => {
 
  const newOrder = {
    id: orderIdCounter++,
    createdAt: new Date().toISOString(),
    status: 'PENDING'
  };


  orders.push(newOrder);


  res.json(newOrder);
});

export { router };

