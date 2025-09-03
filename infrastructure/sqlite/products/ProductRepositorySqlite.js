/**
 * Infrastructure SQLite - Repository Products
 * Implémentation SQLite du ProductRepository pour le domaine Products
 */
import { Product } from '../../../src/products/domain/entities/Product.js';
import { Money } from '../../../src/shared-kernel/value-objects/Money.js';
import { PositiveInt } from '../../../src/shared-kernel/value-objects/PositiveInt.js';

export class ProductRepositorySqlite {
  constructor(database) {
    if (!database) {
      throw new Error('Database connection est requise');
    }
    this.db = database.getConnection();
    
    // Préparation des requêtes pour performance
    this.queries = {
      findAll: this.db.prepare(`
        SELECT id, name, price_amount, price_currency, stock, created_at, updated_at 
        FROM products 
        ORDER BY id
      `),
      
      findById: this.db.prepare(`
        SELECT id, name, price_amount, price_currency, stock, created_at, updated_at 
        FROM products 
        WHERE id = ?
      `),
      
      findByIds: null, // Sera construit dynamiquement
      
      save: this.db.prepare(`
        INSERT OR REPLACE INTO products (id, name, price_amount, price_currency, stock, updated_at) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `),
      
      exists: this.db.prepare(`
        SELECT 1 FROM products WHERE id = ? LIMIT 1
      `),
      
      updateStock: this.db.prepare(`
        UPDATE products 
        SET stock = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `),
      
      getAvailable: this.db.prepare(`
        SELECT id, name, price_amount, price_currency, stock, created_at, updated_at 
        FROM products 
        WHERE stock > 0 
        ORDER BY name
      `)
    };
  }

  async findAll() {
    try {
      const rows = this.queries.findAll.all();
      return rows.map(row => this.#toDomainEntity(row));
    } catch (error) {
      throw new Error(`Erreur récupération produits SQLite: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const idValue = id instanceof PositiveInt ? id.value : id;
      const row = this.queries.findById.get(idValue);
      
      return row ? this.#toDomainEntity(row) : null;
    } catch (error) {
      throw new Error(`Erreur récupération produit ${id}: ${error.message}`);
    }
  }

  async findByIds(ids) {
    try {
      if (!ids || ids.length === 0) return [];
      
      const idValues = ids.map(id => 
        id instanceof PositiveInt ? id.value : id
      );
      
      // Construire requête IN dynamique
      const placeholders = idValues.map(() => '?').join(',');
      const query = this.db.prepare(`
        SELECT id, name, price_amount, price_currency, stock, created_at, updated_at 
        FROM products 
        WHERE id IN (${placeholders})
      `);
      
      const rows = query.all(...idValues);
      return rows.map(row => this.#toDomainEntity(row));
    } catch (error) {
      throw new Error(`Erreur récupération produits par IDs: ${error.message}`);
    }
  }

  async save(product) {
    try {
      if (!(product instanceof Product)) {
        throw new Error('L\'objet doit être une instance de Product');
      }

      this.queries.save.run(
        product.id.value,
        product.name,
        product.price.amount,
        product.price.currency,
        product.stock.value
      );

      // Retourner le produit sauvegardé
      return await this.findById(product.id);
    } catch (error) {
      throw new Error(`Erreur sauvegarde produit SQLite: ${error.message}`);
    }
  }

  async exists(id) {
    try {
      const idValue = id instanceof PositiveInt ? id.value : id;
      const result = this.queries.exists.get(idValue);
      return !!result;
    } catch (error) {
      throw new Error(`Erreur vérification existence produit: ${error.message}`);
    }
  }

  async updateStock(productId, newStock) {
    try {
      const idValue = productId instanceof PositiveInt ? productId.value : productId;
      const stockValue = newStock instanceof PositiveInt ? newStock.value : newStock;
      
      const result = this.queries.updateStock.run(stockValue, idValue);
      
      if (result.changes === 0) {
        return null; // Produit non trouvé
      }

      return await this.findById(idValue);
    } catch (error) {
      throw new Error(`Erreur mise à jour stock SQLite: ${error.message}`);
    }
  }

  async findAvailable() {
    try {
      const rows = this.queries.getAvailable.all();
      return rows.map(row => this.#toDomainEntity(row));
    } catch (error) {
      throw new Error(`Erreur récupération produits disponibles: ${error.message}`);
    }
  }

  // 🔄 Méthodes de transformation
  #toDomainEntity(row) {
    if (!row) return null;
    
    const product = new Product(
      row.id,
      row.name,
      new Money(row.price_amount, row.price_currency),
      row.stock
    );

    // Préserver les timestamps originaux
    if (row.created_at) {
      product.createdAt = new Date(row.created_at);
    }

    return product;
  }
}
