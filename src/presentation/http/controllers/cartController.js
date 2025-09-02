import * as AddToCartService from '../../../business/services/AddToCartService.js';
import * as ClearCartService from '../../../business/services/ClearCartService.js';
import * as GetCartService from '../../../business/services/GetCartService.js';

export const getCart = (req, res) => {
  const cart = GetCartService.execute();
  res.json(cart);
};

export const addToCart = (req, res) => {
  const { productId, quantity } = req.body;

  try {
    AddToCartService.execute(productId, quantity);
    res.json({ message: 'Produit ajouté au panier' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const clearCart = (req, res) => {
  ClearCartService.execute();
  res.json({ message: 'Panier vidé' });
};