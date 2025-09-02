import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);

export { router };

