#!/usr/bin/env node

// Script pour réinitialiser la base SQLite
import { runSqlFile } from '../src/data/sqlite/db.js';

console.log('🗄️ Réinitialisation de la base SQLite...');

try {
  // Créer le schéma
  console.log('📋 Création du schéma...');
  runSqlFile('./scripts/schema.sql');
  
  // Insérer les données de base
  console.log('🌱 Insertion des données de base...');
  runSqlFile('./scripts/seed.sql');
  
  console.log('✅ Base SQLite réinitialisée avec succès !');
} catch (error) {
  console.error('❌ Erreur lors de la réinitialisation :', error.message);
  process.exit(1);
}
