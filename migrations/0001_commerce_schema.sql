CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('customer', 'merchant')),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'merchant')),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  note TEXT NOT NULL,
  image TEXT NOT NULL,
  material TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Live' CHECK (status IN ('Live', 'Hidden')),
  merchant_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  amount INTEGER NOT NULL,
  checkout_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

INSERT OR IGNORE INTO users (id, role, email, name, password_hash)
VALUES (
  'merchant-atelier',
  'merchant',
  'merchant@atelier.demo',
  'Atelier Merchant',
  'pbkdf2$120000$8aXMw7cLMudoItSNIa2krg==$XtxPNhhOCgV1eVoZ9CvPZFk9Q5zgBkrRWq8n5Ym3POw='
);

INSERT OR IGNORE INTO products (id, name, category, price, note, image, material, stock, status, merchant_id)
VALUES
  ('sofa-glasswell', 'Glasswell Modular Sofa', 'Sofas', 4980, '4 configurations', '/assets/product-sofa.png', 'Italian boucle, kiln-dried frame, low-profile stone plinth', 12, 'Live', 'merchant-atelier'),
  ('chair-milo', 'Milo Lounge Chair', 'Seating', 1950, '3 finishes', '/assets/product-chair.png', 'Olive wool blend, smoked steel swivel base', 18, 'Live', 'merchant-atelier'),
  ('lamp-aurora', 'Aurora Floor Lamp', 'Lighting', 1280, 'Dimmable warm LED', '/assets/product-lamp.png', 'Translucent shade, graphite column, weighted stone base', 10, 'Live', 'merchant-atelier'),
  ('appliance-lumiere', 'Lumiere Coffee Machine', 'Appliances', 699, '15 bar pressure', '/assets/product-espresso.png', 'Brushed steel, quiet pump, compact counter footprint', 26, 'Live', 'merchant-atelier'),
  ('appliance-purelite', 'Purelite Air Purifier', 'Appliances', 449, 'H13 HEPA filter', '/assets/product-purifier.png', 'Graphite shell, low-noise circulation, washable pre-filter', 34, 'Live', 'merchant-atelier'),
  ('kettle-vera', 'Vera Kettle', 'Accessories', 189, 'Temperature control', '/assets/product-kettle.png', 'Matte champagne finish, precision spout, insulated handle', 40, 'Live', 'merchant-atelier');

