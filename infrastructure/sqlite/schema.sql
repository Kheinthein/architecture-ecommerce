-- Schema SQLite pour E-commerce DDD
-- Définition des tables pour tous les domaines

-- =============================================================================
-- DOMAIN: PRODUCTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL CHECK(length(name) > 0 AND length(name) <= 100),
    price_amount REAL NOT NULL CHECK(price_amount >= 0),
    price_currency TEXT NOT NULL DEFAULT 'EUR' CHECK(length(price_currency) = 3),
    stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(stock) WHERE stock > 0;
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- =============================================================================
-- DOMAIN: CART
-- =============================================================================

CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY CHECK(length(id) > 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 99),
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (cart_id, product_id),
    
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- =============================================================================
-- DOMAIN: ORDERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK(status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    total_amount REAL NOT NULL CHECK(total_amount >= 0),
    total_currency TEXT NOT NULL DEFAULT 'EUR' CHECK(length(total_currency) = 3),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price_amount REAL NOT NULL CHECK(unit_price_amount >= 0),
    unit_price_currency TEXT NOT NULL DEFAULT 'EUR',
    line_total_amount REAL NOT NULL CHECK(line_total_amount >= 0),
    line_total_currency TEXT NOT NULL DEFAULT 'EUR',
    
    PRIMARY KEY (order_id, product_id),
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    -- Note: pas de FK vers products car le produit peut être supprimé du catalogue
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =============================================================================
-- TRIGGERS pour maintenir updated_at
-- =============================================================================

-- Trigger pour products
CREATE TRIGGER IF NOT EXISTS tr_products_updated_at
    AFTER UPDATE ON products
    FOR EACH ROW
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger pour carts
CREATE TRIGGER IF NOT EXISTS tr_carts_updated_at
    AFTER UPDATE ON carts
    FOR EACH ROW
BEGIN
    UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger pour orders
CREATE TRIGGER IF NOT EXISTS tr_orders_updated_at
    AFTER UPDATE ON orders
    FOR EACH ROW
BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =============================================================================
-- VIEWS utilitaires
-- =============================================================================

-- Vue pour les statistiques du panier
CREATE VIEW IF NOT EXISTS v_cart_summary AS
SELECT 
    c.id as cart_id,
    c.created_at,
    c.updated_at,
    COUNT(ci.product_id) as item_count,
    COALESCE(SUM(ci.quantity), 0) as total_items,
    COALESCE(SUM(ci.quantity * p.price_amount), 0) as estimated_total
FROM carts c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
LEFT JOIN products p ON ci.product_id = p.id
GROUP BY c.id, c.created_at, c.updated_at;

-- Vue pour le stock disponible
CREATE VIEW IF NOT EXISTS v_product_availability AS
SELECT 
    id,
    name,
    price_amount,
    price_currency,
    stock,
    CASE 
        WHEN stock > 0 THEN 'IN_STOCK'
        ELSE 'OUT_OF_STOCK'
    END as availability_status,
    created_at
FROM products;

-- =============================================================================
-- CONTRAINTES DE DONNÉES (exemples de règles métier au niveau DB)
-- =============================================================================

-- Assurer que les paniers vides sont supprimés automatiquement
CREATE TRIGGER IF NOT EXISTS tr_clean_empty_carts
    AFTER DELETE ON cart_items
    FOR EACH ROW
BEGIN
    DELETE FROM carts 
    WHERE id = OLD.cart_id 
    AND NOT EXISTS (
        SELECT 1 FROM cart_items WHERE cart_id = OLD.cart_id
    );
END;
