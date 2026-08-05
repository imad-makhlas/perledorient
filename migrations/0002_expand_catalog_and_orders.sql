ALTER TABLE admin_products ADD COLUMN name_en TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_products ADD COLUMN name_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_products ADD COLUMN description_en TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_products ADD COLUMN description_fr TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_products ADD COLUMN category TEXT NOT NULL DEFAULT 'Necklaces';
ALTER TABLE admin_products ADD COLUMN material TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_products ADD COLUMN dimensions TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_products ADD COLUMN comparison_price INTEGER;
ALTER TABLE admin_products ADD COLUMN featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1));

UPDATE admin_products SET
  name_en = product_name,
  name_fr = CASE slug
    WHEN 'layali-necklace' THEN 'Collier Layali'
    WHEN 'nour-pearl-earrings' THEN 'Boucles Nour'
    WHEN 'zahra-bracelet' THEN 'Bracelet Zahra'
    WHEN 'qamar-ring' THEN 'Bague Qamar'
    WHEN 'yasmin-necklace' THEN 'Collier Yasmin'
    WHEN 'amira-hoops' THEN 'Créoles Amira'
    WHEN 'sahar-cuff' THEN 'Manchette Sahar'
    WHEN 'medina-ring' THEN 'Bague Medina'
    WHEN 'riad-gift-set' THEN 'Coffret Riad'
    WHEN 'heritage-gift-set' THEN 'Coffret Héritage'
    ELSE product_name END,
  description_en = 'A handcrafted piece shaped by oriental motifs and finished in small series.',
  description_fr = 'Une pièce artisanale inspirée de motifs orientaux et façonnée en petite série.',
  category = CASE
    WHEN slug LIKE '%necklace%' THEN 'Necklaces'
    WHEN slug LIKE '%earrings%' OR slug LIKE '%hoops%' THEN 'Earrings'
    WHEN slug LIKE '%bracelet%' OR slug LIKE '%cuff%' THEN 'Bracelets'
    WHEN slug LIKE '%ring%' THEN 'Rings'
    ELSE 'Gift Sets' END,
  material = CASE WHEN slug = 'nour-pearl-earrings' THEN 'Freshwater pearl' ELSE 'Gold-plated brass' END,
  dimensions = CASE
    WHEN slug = 'layali-necklace' THEN '42-48 cm'
    WHEN slug = 'nour-pearl-earrings' THEN '3.2 cm'
    WHEN slug = 'zahra-bracelet' THEN '16-20 cm'
    WHEN slug IN ('qamar-ring', 'medina-ring') THEN 'Adjustable'
    WHEN slug = 'yasmin-necklace' THEN '45 cm'
    WHEN slug = 'amira-hoops' THEN '4 cm'
    ELSE 'Adjustable' END,
  comparison_price = CASE sku
    WHEN 'PDO-001-A' THEN 650 WHEN 'PDO-003-A' THEN 520 WHEN 'PDO-005-A' THEN 690
    WHEN 'PDO-007-A' THEN 560 WHEN 'PDO-009-A' THEN 1050 WHEN 'PDO-010-A' THEN 1180 ELSE NULL END,
  featured = CASE WHEN sku IN ('PDO-001-A', 'PDO-002-A', 'PDO-003-A', 'PDO-004-A') THEN 1 ELSE 0 END;

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  idempotency_key TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_telephone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  delivery_fee INTEGER NOT NULL CHECK (delivery_fee >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL DEFAULT 'WHATSAPP',
  status TEXT NOT NULL DEFAULT 'PENDING_CONFIRMATION',
  whatsapp_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  line_total INTEGER NOT NULL CHECK (line_total >= 0),
  image_url TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
