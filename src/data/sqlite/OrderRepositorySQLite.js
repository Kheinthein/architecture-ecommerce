// Implementation SQLite de OrderRepository
import { OrderRepository } from '../repositories/OrderRepository.js';
import { db } from './db.js';

export class OrderRepositorySQLite extends OrderRepository {
  findAll() {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    return stmt.all().map(order => ({
      ...order,
      createdAt: order.created_at
    }));
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = stmt.get(id);
    
    if (!order) return null;
    
    return {
      ...order,
      createdAt: order.created_at
    };
  }

  create(orderData = {}) {
    const stmt = db.prepare('INSERT INTO orders (status) VALUES (?)');
    const result = stmt.run(orderData.status || 'PENDING');
    
    // Récupérer l'ordre créé
    return this.findById(result.lastInsertRowid);
  }
}
