CREATE TABLE IF NOT EXISTS admin_products (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  image_url TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO admin_products (id, product_id, slug, product_name, variant_name, sku, price, stock, active, image_url) VALUES
  ('jewel-variant-1-a', 'jewel-1', 'layali-necklace', 'Layali Necklace', 'Antique gold', 'PDO-001-A', 520, 7, 1, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-2-a', 'jewel-2', 'nour-pearl-earrings', 'Nour Pearl Earrings', 'Warm gold', 'PDO-002-A', 390, 8, 1, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-3-a', 'jewel-3', 'zahra-bracelet', 'Zahra Bracelet', 'Brushed gold', 'PDO-003-A', 440, 9, 1, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-4-a', 'jewel-4', 'qamar-ring', 'Qamar Ring', 'Mother-of-pearl', 'PDO-004-A', 320, 10, 1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-5-a', 'jewel-5', 'yasmin-necklace', 'Yasmin Necklace', 'Pearl and gold', 'PDO-005-A', 590, 11, 1, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-6-a', 'jewel-6', 'amira-hoops', 'Amira Hoops', 'Hammered gold', 'PDO-006-A', 350, 3, 1, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-7-a', 'jewel-7', 'sahar-cuff', 'Sahar Cuff', 'Antique finish', 'PDO-007-A', 480, 13, 1, 'https://images.unsplash.com/photo-1627293509201-cd0c780043e6?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-8-a', 'jewel-8', 'medina-ring', 'Medina Ring', 'Burgundy stone', 'PDO-008-A', 340, 0, 0, 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-9-a', 'jewel-9', 'riad-gift-set', 'Riad Gift Set', 'Pearl and gold', 'PDO-009-A', 890, 15, 1, 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=88'),
  ('jewel-variant-10-a', 'jewel-10', 'heritage-gift-set', 'Heritage Gift Set', 'Antique gold', 'PDO-010-A', 980, 16, 1, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=88');
