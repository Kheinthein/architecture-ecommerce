-- Données d'amorçage pour E-commerce DDD
-- Insertion des données de test/développement

-- =============================================================================
-- PRODUCTS - Catalogue initial
-- =============================================================================

INSERT OR IGNORE INTO products (id, name, price_amount, price_currency, stock) VALUES 
    (1, 'MacBook Pro 14"', 1999.99, 'EUR', 5),
    (2, 'iPhone 15', 999.99, 'EUR', 10),
    (3, 'AirPods Pro', 249.99, 'EUR', 8),
    (4, 'iPad Air', 649.99, 'EUR', 3),
    (5, 'Apple Watch Series 9', 399.99, 'EUR', 7),
    (6, 'MacBook Air 13"', 1199.99, 'EUR', 12),
    (7, 'Mac Studio', 2299.99, 'EUR', 2),
    (8, 'Studio Display', 1749.99, 'EUR', 4),
    (9, 'Magic Keyboard', 199.99, 'EUR', 15),
    (10, 'Magic Mouse', 89.99, 'EUR', 20);

-- =============================================================================
-- CARTS - Quelques paniers de test
-- =============================================================================

-- Panier de démonstration
INSERT OR IGNORE INTO carts (id) VALUES ('demo-cart');
INSERT OR IGNORE INTO cart_items (cart_id, product_id, quantity) VALUES 
    ('demo-cart', 1, 1),
    ('demo-cart', 3, 2);

-- Panier utilisateur test
INSERT OR IGNORE INTO carts (id) VALUES ('user123');
INSERT OR IGNORE INTO cart_items (cart_id, product_id, quantity) VALUES 
    ('user123', 2, 1),
    ('user123', 9, 1);

-- =============================================================================
-- ORDERS - Commandes d'exemple
-- =============================================================================

-- Commande confirmée
INSERT OR IGNORE INTO orders (id, status, total_amount, total_currency) VALUES 
    (1001, 'confirmed', 2449.97, 'EUR');

INSERT OR IGNORE INTO order_items (order_id, product_id, product_name, quantity, unit_price_amount, unit_price_currency, line_total_amount, line_total_currency) VALUES 
    (1001, 1, 'MacBook Pro 14"', 1, 1999.99, 'EUR', 1999.99, 'EUR'),
    (1001, 3, 'AirPods Pro', 1, 249.99, 'EUR', 249.99, 'EUR'),
    (1001, 9, 'Magic Keyboard', 1, 199.99, 'EUR', 199.99, 'EUR');

-- Commande expédiée
INSERT OR IGNORE INTO orders (id, status, total_amount, total_currency) VALUES 
    (1002, 'shipped', 1089.98, 'EUR');

INSERT OR IGNORE INTO order_items (order_id, product_id, product_name, quantity, unit_price_amount, unit_price_currency, line_total_amount, line_total_currency) VALUES 
    (1002, 2, 'iPhone 15', 1, 999.99, 'EUR', 999.99, 'EUR'),
    (1002, 10, 'Magic Mouse', 1, 89.99, 'EUR', 89.99, 'EUR');

-- Commande livrée
INSERT OR IGNORE INTO orders (id, status, total_amount, total_currency) VALUES 
    (1003, 'delivered', 649.99, 'EUR');

INSERT OR IGNORE INTO order_items (order_id, product_id, product_name, quantity, unit_price_amount, unit_price_currency, line_total_amount, line_total_currency) VALUES 
    (1003, 4, 'iPad Air', 1, 649.99, 'EUR', 649.99, 'EUR');

-- =============================================================================
-- Vérifications post-insertion
-- =============================================================================

-- Afficher un résumé des données insérées
-- SELECT 'Products' as table_name, COUNT(*) as count FROM products
-- UNION ALL
-- SELECT 'Carts' as table_name, COUNT(*) as count FROM carts
-- UNION ALL
-- SELECT 'Cart Items' as table_name, COUNT(*) as count FROM cart_items
-- UNION ALL
-- SELECT 'Orders' as table_name, COUNT(*) as count FROM orders
-- UNION ALL
-- SELECT 'Order Items' as table_name, COUNT(*) as count FROM order_items;
