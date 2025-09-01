// État en mémoire 
let cart = [];

export const getCart = () => {
  return cart;
};

export const addToCart = (productId, quantity) => {
  // Validation des paramètres
  if (!productId || !quantity || 
      typeof productId !== 'number' || typeof quantity !== 'number' ||
      productId <= 0 || quantity <= 0) {
    throw new Error('productId et quantity sont requis');
  }

  // Recherche le produit existant
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    // Met à jour la quantité 
    existingItem.quantity += quantity;
  } else {
    // Nouvel item au panier
    cart.push({ productId, quantity });
  }
};

export const clearCart = () => {
  cart = [];
};