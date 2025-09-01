import express from 'express';

const router = express.Router();

// État en mémoire 
const products = [
  { id: 1, name: 'Figurine', price: 20 },
  { id: 2, name: 'Poster', price: 10 }
];

//Renvoie la liste des produits 

router.get('/', (req, res) => {

  const sortedProducts = products.sort((a, b) => a.id - b.id);
  res.json(sortedProducts);
});

export { router };
