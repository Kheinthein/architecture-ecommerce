// Implementation en mémoire de CartRepository
import { CartRepository } from '../repositories/CartRepository.js';
import { state } from '../state.js';

export class CartRepositoryInMemory extends CartRepository {
  getCart() {
    return [...state.cart];
  }

  addToCart(productId, quantity) {
    const existingItem = state.cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      state.cart.push({ productId, quantity });
    }
  }

  removeFromCart(productId) {
    const index = state.cart.findIndex(item => item.productId === productId);
    if (index !== -1) {
      state.cart.splice(index, 1);
    }
  }

  clearCart() {
    state.cart.length = 0;
  }
}
