import * as cartService from '../services/cartService.js';

export const getCart = (req, res) => {
  const cart = cartService.getCart();
  res.json(cart);
};

export const addToCart = (req, res) => {
  const { productId, quantity } = req.body;

  try {
    cartService.addToCart(productId, quantity);
    res.json({ message: 'Produit ajouté au panier' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const clearCart = (req, res) => {
  cartService.clearCart();
  res.json({ message: 'Panier vidé' });
};