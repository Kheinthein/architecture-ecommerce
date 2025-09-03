/**
 * Infrastructure SQLite - Connexion et helpers
 * Gestion centralisée de la base de données SQLite avec better-sqlite3
 */
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class SQLiteDatabase {
  constructor(dbPath = null) {
    this.dbPath = dbPath || join(process.cwd(), 'var', 'ecommerce.sqlite');
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialise la connexion SQLite
   */
  connect() {
    if (this.db) return this.db;

    try {
      this.db = new Database(this.dbPath);
      
      // Configuration pour performance
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      this.db.pragma('synchronous = NORMAL');
      this.db.pragma('cache_size = 1000');
      this.db.pragma('temp_store = memory');

      console.log(`📊 SQLite connecté: ${this.dbPath}`);
      
      return this.db;
    } catch (error) {
      throw new Error(`Erreur connexion SQLite: ${error.message}`);
    }
  }

  /**
   * Initialise le schéma de base de données
   */
  async initializeSchema() {
    if (this.isInitialized) return;

    try {
      const schemaPath = join(__dirname, 'schema.sql');
      const schema = readFileSync(schemaPath, 'utf8');
      
      this.db.exec(schema);
      this.isInitialized = true;
      
      console.log('📋 Schéma SQLite initialisé');
    } catch (error) {
      throw new Error(`Erreur initialisation schéma: ${error.message}`);
    }
  }

  /**
   * Amorce les données de base
   */
  async seedData() {
    try {
      const seedPath = join(__dirname, 'seed.sql');
      const seedData = readFileSync(seedPath, 'utf8');
      
      this.db.exec(seedData);
      console.log('🌱 Données d\'amorçage chargées');
    } catch (error) {
      console.warn('⚠️ Pas de fichier seed.sql ou erreur:', error.message);
    }
  }

  /**
   * Reset complet de la base
   */
  async reset() {
    try {
      const resetPath = join(__dirname, 'reset.sql');
      const resetSQL = readFileSync(resetPath, 'utf8');
      
      this.db.exec(resetSQL);
      console.log('🗑️ Base de données réinitialisée');
      
      this.isInitialized = false;
      await this.initializeSchema();
      await this.seedData();
    } catch (error) {
      throw new Error(`Erreur reset base: ${error.message}`);
    }
  }

  /**
   * Exécute une transaction
   */
  transaction(callback) {
    const transaction = this.db.transaction(callback);
    return transaction;
  }

  /**
   * Prépare une requête (pour performance)
   */
  prepare(sql) {
    return this.db.prepare(sql);
  }

  /**
   * Ferme la connexion
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log('📊 Connexion SQLite fermée');
    }
  }

  /**
   * Récupère la connexion active
   */
  getConnection() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }

  /**
   * Vérifie la santé de la connexion
   */
  healthCheck() {
    try {
      const result = this.db.prepare('SELECT 1 as test').get();
      return result.test === 1;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtient des statistiques sur la base
   */
  getStats() {
    try {
      const tables = this.db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `).all();

      const stats = {};
      for (const table of tables) {
        const count = this.db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
        stats[table.name] = count.count;
      }

      return {
        tables: tables.map(t => t.name),
        counts: stats,
        dbPath: this.dbPath,
        healthy: this.healthCheck()
      };
    } catch (error) {
      return {
        error: error.message,
        healthy: false
      };
    }
  }
}
