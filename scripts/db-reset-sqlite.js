#!/usr/bin/env node

/**
 * Script de reset SQLite pour E-commerce DDD
 * Exécute reset.sql + schema.sql + seed.sql
 */
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { SQLiteDatabase } from '../infrastructure/sqlite/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resetDatabase() {
  console.log('🗑️ Reset de la base de données SQLite...\n');
  
  let database = null;
  
  try {
    // Créer une instance de base de données
    database = new SQLiteDatabase();
    database.connect();
    
    console.log('📊 Base de données connectée');
    
    // 1. Reset complet
    console.log('🔄 Exécution reset.sql...');
    await database.reset();
    
    // 2. Initialiser le schéma
    console.log('📋 Initialisation du schéma...');
    await database.initializeSchema();
    
    // 3. Charger les données d'amorçage
    console.log('🌱 Chargement des données d\'amorçage...');
    await database.seedData();
    
    // 4. Afficher les statistiques
    console.log('\n📊 Statistiques de la base après reset:');
    const stats = database.getStats();
    
    console.log(`📁 Base de données: ${stats.dbPath}`);
    console.log(`🏥 Santé: ${stats.healthy ? '✅' : '❌'}`);
    console.log(`📝 Tables: ${stats.tables.join(', ')}`);
    
    console.log('\n📈 Nombre d\'enregistrements:');
    for (const [table, count] of Object.entries(stats.counts)) {
      console.log(`   ${table}: ${count} enregistrements`);
    }
    
    console.log('\n✅ Reset de la base terminé avec succès !');
    
    // 5. Instructions d'utilisation
    console.log('\n🚀 Commandes pour tester:');
    console.log('   node main-ddd.js  # Démarrer avec In-Memory');
    console.log('   node main-sqlite.js  # Démarrer avec SQLite (si disponible)');
    console.log('   npm test  # Lancer les tests');
    
  } catch (error) {
    console.error('❌ Erreur lors du reset:', error.message);
    process.exit(1);
  } finally {
    if (database) {
      database.close();
    }
  }
}

// Point d'entrée
if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}