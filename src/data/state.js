// État global partagé de l'application
export const state = {
  products: [
    { id: 1, name: 'Figurine', price: 20 },
    { id: 2, name: 'Poster', price: 10 }
  ],
  cart: [],
  orders: [],
  orderIdCounter: 1
};
