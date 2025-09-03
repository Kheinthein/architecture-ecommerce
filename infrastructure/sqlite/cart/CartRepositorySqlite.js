/**
 * Infrastructure SQLite - Repository Cart
 * Implémentation SQLite du CartRepository pour le domaine Cart
 */
import { Cart } from '../../../src/cart/domain/entities/Cart.js';
import { Quantity } from '../../../src/cart/domain/value-objects/Quantity.js';
import { PositiveInt } from '../../../src/shared-kernel/value-objects/PositiveInt.js';

export class CartRepositorySqlite {
  constructor(database) {
    if (!database) {
      throw new Error('Database connection est requise');
    }
    this.db = database.getConnection();
    
    // Préparation des requêtes pour performance
    this.queries = {
      findCart: this.db.prepare(`
        SELECT id, created_at, updated_at FROM carts WHERE id = ?
      `),
      
      findCartItems: this.db.prepare(`
        SELECT product_id, quantity, added_at 
        FROM cart_items 
        WHERE cart_id = ? 
        ORDER BY added_at
      `),
      
      createCart: this.db.prepare(`
        INSERT OR IGNORE INTO carts (id) VALUES (?)
      `),
      
      deleteCart: this.db.prepare(`
        DELETE FROM carts WHERE id = ?
      `),
      
      exists: this.db.prepare(`
        SELECT 1 FROM carts WHERE id = ? LIMIT 1
      `),
      
      upsertCartItem: this.db.prepare(`
        INSERT OR REPLACE INTO cart_items (cart_id, product_id, quantity) 
        VALUES (?, ?, ?)
      `),
      
      deleteCartItem: this.db.prepare(`
        DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?
      `),
      
      clearCartItems: this.db.prepare(`
        DELETE FROM cart_items WHERE cart_id = ?
      `),
      
      updateCartTimestamp: this.db.prepare(`
        UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `)
    };
  }

  async findById(id) {
    try {
      const cartRow = this.queries.findCart.get(id);
      if (!cartRow) {
        return null;
      }

      const itemRows = this.queries.findCartItems.all(id);
      
      // Transformer les items en objets domaine
      const items = itemRows.map(row => ({
        productId: new PositiveInt(row.product_id),
        quantity: new Quantity(row.quantity)
      }));

      const cart = new Cart(id, items);
      
      // Préserver les timestamps
      if (cartRow.created_at) {
        cart.createdAt = new Date(cartRow.created_at);
      }

      return cart;
    } catch (error) {
      throw new Error(`Erreur récupération panier SQLite: ${error.message}`);
    }
  }

  async save(cart) {
    try {
      if (!(cart instanceof Cart)) {
        throw new Error('L\'objet doit être une instance de Cart');
      }

      // Transaction pour maintenir cohérence
      const saveTransaction = this.db.transaction(() => {
        // 1. Créer/mettre à jour le panier
        this.queries.createCart.run(cart.id);
        
        // 2. Supprimer tous les items existants
        this.queries.clearCartItems.run(cart.id);
        
        // 3. Insérer les nouveaux items
        for (const item of cart.items) {
          this.queries.upsertCartItem.run(
            cart.id,
            item.productId.value,
            item.quantity.value
          );
        }
        
        // 4. Mettre à jour le timestamp
        this.queries.updateCartTimestamp.run(cart.id);
      });

      saveTransaction();

      // Retourner le panier sauvegardé
      return await this.findById(cart.id);
    } catch (error) {
      throw new Error(`Erreur sauvegarde panier SQLite: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Les items seront supprimés automatiquement via CASCADE
      const result = this.queries.deleteCart.run(id);
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Erreur suppression panier SQLite: ${error.message}`);
    }
  }

  async exists(id) {
    try {
      const result = this.queries.exists.get(id);
      return !!result;
    } catch (error) {
      throw new Error(`Erreur vérification existence panier: ${error.message}`);
    }
  }

  async addItem(cartId, productId, quantity) {
    try {
      const productIdValue = productId instanceof PositiveInt ? productId.value : productId;
      const quantityValue = quantity instanceof Quantity ? quantity.value : quantity;

      // Transaction pour gérer la logique d'ajout
      const addTransaction = this.db.transaction(() => {
        // Créer le panier s'il n'existe pas
        this.queries.createCart.run(cartId);
        
        // Récupérer l'item existant
        const existingItem = this.db.prepare(`
          SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?
        `).get(cartId, productIdValue);
        
        let newQuantity = quantityValue;
        if (existingItem) {
          newQuantity = existingItem.quantity + quantityValue;
          
          // Vérifier la limite max
          if (newQuantity > Quantity.MAX_QUANTITY) {
            throw new Error(`Quantité maximale dépassée: ${newQuantity} > ${Quantity.MAX_QUANTITY}`);
          }
        }
        
        // Insérer/mettre à jour l'item
        this.queries.upsertCartItem.run(cartId, productIdValue, newQuantity);
        
        // Mettre à jour le timestamp du panier
        this.queries.updateCartTimestamp.run(cartId);
      });

      addTransaction();
      
      return await this.findById(cartId);
    } catch (error) {
      throw new Error(`Erreur ajout item panier: ${error.message}`);
    }
  }

  async removeItem(cartId, productId) {
    try {
      const productIdValue = productId instanceof PositiveInt ? productId.value : productId;
      
      const result = this.queries.deleteCartItem.run(cartId, productIdValue);
      
      if (result.changes > 0) {
        this.queries.updateCartTimestamp.run(cartId);
      }
      
      return await this.findById(cartId);
    } catch (error) {
      throw new Error(`Erreur suppression item panier: ${error.message}`);
    }
  }

  async clear(cartId) {
    try {
      this.queries.clearCartItems.run(cartId);
      this.queries.updateCartTimestamp.run(cartId);
      
      return await this.findById(cartId);
    } catch (error) {
      throw new Error(`Erreur vidage panier: ${error.message}`);
    }
  }

  // 📊 Méthodes utilitaires SQLite spécifiques
  async getCartSummary(cartId) {
    try {
      const summary = this.db.prepare(`
        SELECT 
          cart_id,
          item_count,
          total_items,
          estimated_total,
          created_at,
          updated_at
        FROM v_cart_summary 
        WHERE cart_id = ?
      `).get(cartId);
      
      return summary;
    } catch (error) {
      throw new Error(`Erreur récupération résumé panier: ${error.message}`);
    }
  }
}
