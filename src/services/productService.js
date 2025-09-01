// État en mémoire 
const products = [
  { id: 1, name: 'Figurine', price: 20 },
  { id: 2, name: 'Poster', price: 10 }
];

export const getAllProducts = () => {
  return products.sort((a, b) => a.id - b.id);
};