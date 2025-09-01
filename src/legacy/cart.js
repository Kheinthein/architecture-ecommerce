import express from 'express';

const router = express.Router();

// État en mémoire 
let cart = [];

//contenu du panier

router.get('/', (req, res) => {
  res.json(cart);
});

// Ajoute un produit au panier

router.post('/', (req, res) => {
  const { productId, quantity } = req.body;

  // Validation des paramètres
  if (!productId || !quantity || 
      typeof productId !== 'number' || typeof quantity !== 'number' ||
      productId <= 0 || quantity <= 0) {
    return res.status(400).json({ 
      error: 'productId et quantity sont requis' 
    });
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

  res.json({ message: 'Produit ajouté au panier' });
});
//PUT pour modifier le panier

// Vide le panier

router.delete('/', (req, res) => {
  cart = [];
  res.json({ message: 'Panier vidé' });
});

export { router };

