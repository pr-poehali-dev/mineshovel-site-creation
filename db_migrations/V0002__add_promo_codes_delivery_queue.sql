
CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_uses INTEGER DEFAULT NULL,
  total_uses INTEGER NOT NULL DEFAULT 0,
  exclude_items TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promo_usage_stats (
  id SERIAL PRIMARY KEY,
  promo_code_id INTEGER NOT NULL REFERENCES promo_codes(id),
  order_id INTEGER REFERENCES orders(id),
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  month_year VARCHAR(7) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_promo_usage_month ON promo_usage_stats(promo_code_id, month_year);

CREATE TABLE IF NOT EXISTS delivery_queue (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  username VARCHAR(16) NOT NULL,
  rcon_command TEXT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMP DEFAULT NULL,
  delivered_at TIMESTAMP DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_delivery_queue_status ON delivery_queue(status);
CREATE INDEX IF NOT EXISTS idx_delivery_queue_username ON delivery_queue(username);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_discount INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_type VARCHAR(50) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_key VARCHAR(100) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS duration_key VARCHAR(50) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS original_amount NUMERIC(10,2) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(20) DEFAULT 'pending';

INSERT INTO promo_codes (code, discount_percent, is_active, exclude_items)
VALUES ('makesh', 15, true, '{"кусочков","Всё или Харрибо"}')
ON CONFLICT (code) DO NOTHING;
