// Interface CartRepository
export class CartRepository {
  getCart() {
    throw new Error('Method getCart() must be implemented');
  }

  addToCart(productId, quantity) {
    throw new Error('Method addToCart() must be implemented');
  }

  removeFromCart(productId) {
    throw new Error('Method removeFromCart() must be implemented');
  }

  clearCart() {
    throw new Error('Method clearCart() must be implemented');
  }
}
