-- Script de reset pour SQLite E-commerce DDD
-- Supprime toutes les tables et repart à zéro

-- =============================================================================
-- SUPPRESSION DES VUES
-- =============================================================================

DROP VIEW IF EXISTS v_cart_summary;
DROP VIEW IF EXISTS v_product_availability;

-- =============================================================================
-- SUPPRESSION DES TRIGGERS
-- =============================================================================

DROP TRIGGER IF EXISTS tr_products_updated_at;
DROP TRIGGER IF EXISTS tr_carts_updated_at;
DROP TRIGGER IF EXISTS tr_orders_updated_at;
DROP TRIGGER IF EXISTS tr_clean_empty_carts;

-- =============================================================================
-- SUPPRESSION DES INDEX
-- =============================================================================

DROP INDEX IF EXISTS idx_products_availability;
DROP INDEX IF EXISTS idx_products_created_at;
DROP INDEX IF EXISTS idx_cart_items_cart_id;
DROP INDEX IF EXISTS idx_cart_items_product_id;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_order_items_order_id;

-- =============================================================================
-- SUPPRESSION DES TABLES (ordre important pour les contraintes FK)
-- =============================================================================

-- Tables dépendantes en premier
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart_items;

-- Tables principales
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;

-- =============================================================================
-- NETTOYAGE FINAL
-- =============================================================================

-- Réinitialise les séquences auto-increment
DELETE FROM sqlite_sequence;

-- Compacte la base de données
VACUUM;
