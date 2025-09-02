// Implementation SQLite de CartRepository
import { CartRepository } from '../repositories/CartRepository.js';
import { db } from './db.js';

export class CartRepositorySQLite extends CartRepository {
  getCart() {
    const stmt = db.prepare('SELECT product_id as productId, quantity FROM cart_items');
    return stmt.all();
  }

  addToCart(productId, quantity) {
    // Vérifier si le produit existe déjà dans le panier
    const existing = db.prepare('SELECT * FROM cart_items WHERE product_id = ?').get(productId);
    
    if (existing) {
      // Mettre à jour la quantité
      const updateStmt = db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?');
      updateStmt.run(quantity, productId);
    } else {
      // Ajouter un nouvel item
      const insertStmt = db.prepare('INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)');
      insertStmt.run(productId, quantity);
    }
  }

  removeFromCart(productId) {
    const stmt = db.prepare('DELETE FROM cart_items WHERE product_id = ?');
    stmt.run(productId);
  }

  clearCart() {
    const stmt = db.prepare('DELETE FROM cart_items');
    stmt.run();
  }
}
