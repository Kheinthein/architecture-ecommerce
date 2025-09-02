// Implementation SQLite de ProductRepository
import { ProductRepository } from '../repositories/ProductRepository.js';
import { db } from './db.js';

export class ProductRepositorySQLite extends ProductRepository {
  findAll() {
    const stmt = db.prepare('SELECT * FROM products ORDER BY id ASC');
    return stmt.all();
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id) || null;
  }
}
