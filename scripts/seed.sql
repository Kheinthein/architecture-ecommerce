-- Données de base pour le développement

-- Supprimer les données existantes
DELETE FROM cart_items;
DELETE FROM orders;
DELETE FROM products;

-- Réinitialiser les compteurs auto-increment
DELETE FROM sqlite_sequence WHERE name IN ('products', 'cart_items', 'orders');

-- Insérer les produits de base
INSERT INTO products (id, name, price) VALUES 
(1, 'Figurine', 20.0),
(2, 'Poster', 10.0);
