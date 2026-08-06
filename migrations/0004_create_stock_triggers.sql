CREATE TRIGGER IF NOT EXISTS reserve_stock_before_order_item_insert
BEFORE INSERT ON order_items
WHEN COALESCE((SELECT stock_reserved FROM orders WHERE id = NEW.order_id), 0) = 1
BEGIN
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM admin_products
      WHERE id = NEW.variant_id AND active = 1 AND stock >= NEW.quantity
    )
    THEN RAISE(ABORT, 'INSUFFICIENT_STOCK')
  END;
END;

CREATE TRIGGER IF NOT EXISTS reserve_stock_after_order_item_insert
AFTER INSERT ON order_items
WHEN COALESCE((SELECT stock_reserved FROM orders WHERE id = NEW.order_id), 0) = 1
BEGIN
  UPDATE admin_products
  SET stock = stock - NEW.quantity, updated_at = datetime('now')
  WHERE id = NEW.variant_id;
END;

CREATE TRIGGER IF NOT EXISTS restore_stock_after_order_release
AFTER UPDATE OF stock_reserved ON orders
WHEN OLD.stock_reserved = 1 AND NEW.stock_reserved = 0
BEGIN
  UPDATE admin_products
  SET stock = stock + COALESCE((
    SELECT SUM(quantity)
    FROM order_items
    WHERE order_id = NEW.id AND variant_id = admin_products.id
  ), 0), updated_at = datetime('now')
  WHERE id IN (SELECT variant_id FROM order_items WHERE order_id = NEW.id);
END;
