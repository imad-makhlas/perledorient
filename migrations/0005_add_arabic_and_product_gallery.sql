ALTER TABLE admin_products ADD COLUMN name_ar TEXT NOT NULL DEFAULT '';
ALTER TABLE admin_products ADD COLUMN description_ar TEXT NOT NULL DEFAULT '';

UPDATE admin_products
SET name_ar = COALESCE(NULLIF(name_fr, ''), NULLIF(name_en, ''), product_name),
    description_ar = COALESCE(NULLIF(description_fr, ''), NULLIF(description_en, ''))
WHERE name_ar = '' OR description_ar = '';

CREATE TABLE IF NOT EXISTS admin_product_images (
  id TEXT PRIMARY KEY,
  product_row_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (product_row_id) REFERENCES admin_products(id) ON DELETE CASCADE,
  UNIQUE(product_row_id, image_url)
);

CREATE INDEX IF NOT EXISTS idx_admin_product_images_order
ON admin_product_images(product_row_id, position);

INSERT OR IGNORE INTO admin_product_images (id, product_row_id, image_url, position)
SELECT lower(hex(randomblob(16))), id, image_url, 0
FROM admin_products
WHERE image_url IS NOT NULL AND trim(image_url) <> '';
