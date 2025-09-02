import express from 'express';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/', cartController.clearCart);

export { router };
