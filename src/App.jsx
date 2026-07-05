import { useMemo, useState } from "react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const categories = [
  "All Products",
  "Sofas",
  "Seating",
  "Lighting",
  "Appliances",
  "Accessories",
];

const initialProducts = [
  {
    id: "sofa-glasswell",
    name: "Glasswell Modular Sofa",
    category: "Sofas",
    price: 4980,
    note: "4 configurations",
    image: asset("assets/product-sofa.png"),
    material: "Italian boucle, kiln-dried frame, low-profile stone plinth",
    stock: 12,
    status: "Live",
  },
  {
    id: "chair-milo",
    name: "Milo Lounge Chair",
    category: "Seating",
    price: 1950,
    note: "3 finishes",
    image: asset("assets/product-chair.png"),
    material: "Olive wool blend, smoked steel swivel base",
    stock: 18,
    status: "Live",
  },
  {
    id: "lamp-aurora",
    name: "Aurora Floor Lamp",
    category: "Lighting",
    price: 1280,
    note: "Dimmable warm LED",
    image: asset("assets/product-lamp.png"),
    material: "Translucent shade, graphite column, weighted stone base",
    stock: 10,
    status: "Live",
  },
  {
    id: "appliance-lumiere",
    name: "Lumiere Coffee Machine",
    category: "Appliances",
    price: 699,
    note: "15 bar pressure",
    image: asset("assets/product-espresso.png"),
    material: "Brushed steel, quiet pump, compact counter footprint",
    stock: 26,
    status: "Live",
  },
  {
    id: "appliance-purelite",
    name: "Purelite Air Purifier",
    category: "Appliances",
    price: 449,
    note: "H13 HEPA filter",
    image: asset("assets/product-purifier.png"),
    material: "Graphite shell, low-noise circulation, washable pre-filter",
    stock: 34,
    status: "Live",
  },
  {
    id: "kettle-vera",
    name: "Vera Kettle",
    category: "Accessories",
    price: 189,
    note: "Temperature control",
    image: asset("assets/product-kettle.png"),
    material: "Matte champagne finish, precision spout, insulated handle",
    stock: 40,
    status: "Live",
  },
];

const craftItems = [
  {
    step: "01",
    title: "Material Integrity",
    copy: "Macro product photography reveals the touch points that make each surface feel warm, honest, and durable.",
    image: asset("assets/process-fabric.png"),
  },
  {
    step: "02",
    title: "Refined Construction",
    copy: "Close-range framing documents joins, seams, hardware, and ergonomic details with editorial clarity.",
    image: asset("assets/process-chair-detail.png"),
  },
  {
    step: "03",
    title: "Intelligent Engineering",
    copy: "Transparent CGI views explain the appliance core without turning the brand world into a technical diagram.",
    image: asset("assets/process-transparent-espresso.png"),
  },
  {
    step: "04",
    title: "Made for Real Life",
    copy: "Lifestyle composites show the collection at home, balancing practical scale with atmospheric depth.",
    image: asset("assets/process-lifestyle.png"),
  },
];

const spaces = [
  {
    title: "Calm Minimalism",
    copy: "Serene tones, natural light, and tactile materials for quiet rooms.",
    image: asset("assets/space-calm.png"),
  },
  {
    title: "Urban Warmth",
    copy: "Rich textures, layered lighting, and compact appliances for night rituals.",
    image: asset("assets/space-urban.png"),
  },
  {
    title: "Modern Retreat",
    copy: "Furniture, lighting, and air care arranged as one living system.",
    image: asset("assets/hero-living-room.png"),
  },
];

const paymentMethods = [
  "Card checkout",
  "Stripe ready",
  "Bank transfer",
  "WeChat or Alipay slot",
];

const serviceItems = [
  ["Complimentary Delivery", "White-glove delivery in selected regions."],
  ["Designed to Last", "Quality materials and timeless design, built to endure."],
  ["Merchant Console", "Product, inventory, and order workflows are ready for backend wiring."],
  ["Secure Checkout", "Payment interface prepared for Stripe, WeChat Pay, or Alipay integration."],
];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export function App() {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saved, setSaved] = useState(() => new Set());
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [session, setSession] = useState(null);
  const [loginRole, setLoginRole] = useState("customer");
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderState, setOrderState] = useState("idle");
  const [merchantForm, setMerchantForm] = useState({
    name: "Nord Air Circulator",
    category: "Appliances",
    price: "329",
    stock: "22",
    note: "Quiet airflow",
    material: "Compact smart fan with matte graphite shell",
  });

  const liveProducts = products.filter((product) => product.status === "Live");
  const filteredProducts = useMemo(() => {
    const source = activeCategory === "All Products"
      ? liveProducts
      : liveProducts.filter((product) => product.category === activeCategory);
    return source;
  }, [activeCategory, liveProducts]);

  const cartItems = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 180 : 0;
  const total = subtotal + shipping;

  function toggleSaved(productName) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(productName)) {
        next.delete(productName);
      } else {
        next.add(productName);
      }
      return next;
    });
  }

  function addToCart(productId) {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { productId, quantity: 1 }];
    });
  }

  function changeQuantity(productId, direction) {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + direction) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function loginAs(role) {
    setSession({
      role,
      name: role === "merchant" ? "Atelier Merchant" : "Private Client",
    });
    setLoginOpen(false);
  }

  function updateStock(productId, direction) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock + direction) }
          : product,
      ),
    );
  }

  function toggleStatus(productId) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? { ...product, status: product.status === "Live" ? "Hidden" : "Live" }
          : product,
      ),
    );
  }

  function addMerchantProduct(event) {
    event.preventDefault();
    const nextProduct = {
      id: `merchant-${Date.now()}`,
      name: merchantForm.name,
      category: merchantForm.category,
      price: Number(merchantForm.price) || 0,
      note: merchantForm.note,
      image: asset("assets/product-purifier.png"),
      material: merchantForm.material,
      stock: Number(merchantForm.stock) || 0,
      status: "Live",
    };
    setProducts((current) => [nextProduct, ...current]);
    setMerchantForm({
      name: "",
      category: "Appliances",
      price: "",
      stock: "",
      note: "",
      material: "",
    });
  }

  function completePayment(event) {
    event.preventDefault();
    setOrderState("processing");
    window.setTimeout(() => {
      setOrderState("paid");
      setCart([]);
    }, 700);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a href="#top" className="brand" aria-label="Atelier Living Glass home">
          <span>ATELIER</span>
          <small>LIVING GLASS</small>
        </a>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Primary">
          <a href="#collection">Furniture</a>
          <a href="#collection">Appliances</a>
          <a href="#commerce">Commerce</a>
          <a href="#merchant">Merchant</a>
          <a href="#spaces">Spaces</a>
          <a href="#craft">Materials</a>
        </nav>
        <div className="utility">
          <button className="text-button" type="button" onClick={() => setLoginOpen(true)}>
            {session ? session.name : "Login"}
          </button>
          {session ? (
            <button className="text-button" type="button" onClick={() => setSession(null)}>
              Sign out
            </button>
          ) : null}
          <button className="bag-button" type="button" onClick={() => setCheckoutOpen(true)}>
            Bag <span>{cartCount}</span>
          </button>
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
          >
            Menu
          </button>
        </div>
      </header>

      <section id="top" className="hero-section">
        <img className="hero-image" src={asset("assets/hero-living-room.png")} alt="Luxury living room with sofa, chair, floor lamp, and small appliances" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Furniture, appliances, and commerce</p>
            <h1>Design that lives beautifully.</h1>
            <p>
              A premium home-commerce template with separate customer and merchant
              journeys, product operations, cart logic, and payment-ready checkout.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#collection">Shop collection</a>
              <a className="secondary-action" href="#merchant">Open merchant console</a>
            </div>
          </div>

          <aside className="glass-panel hero-panel" aria-label="Commerce status">
            <p className="panel-label">Live commerce layer</p>
            <h2>Separate portals for customers and merchants.</h2>
            <p>
              Customers can save items, build a cart, and enter checkout.
              Merchants can publish products, manage stock, and review order flow.
            </p>
            <button className="link-button" type="button" onClick={() => setLoginOpen(true)}>
              Choose login type
            </button>
            <div className="panel-divider" />
            <p className="panel-label">Payment status</p>
            <p className="panel-statement">Demo checkout now. Real payment gateway next.</p>
          </aside>
        </div>

        <div className="category-glass" aria-label="Product categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? "category-pill active" : "category-pill"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section id="commerce" className="commerce-band">
        <div>
          <p className="eyebrow">Account structure</p>
          <h2>Two entrances, one luxury storefront.</h2>
        </div>
        <div className="portal-grid">
          <article className="portal-card">
            <span>Customer</span>
            <h3>Browse, save, cart, checkout</h3>
            <p>Designed for private clients purchasing furniture and compact home appliances.</p>
            <button type="button" onClick={() => loginAs("customer")}>Enter as customer</button>
          </article>
          <article className="portal-card merchant">
            <span>Merchant</span>
            <h3>Products, stock, orders</h3>
            <p>Designed for merchants who need clean catalog control without visual clutter.</p>
            <button type="button" onClick={() => loginAs("merchant")}>Enter as merchant</button>
          </article>
        </div>
      </section>

      <section id="collection" className="section collection-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Our collection</p>
            <h2>Thoughtful pieces for modern living.</h2>
          </div>
          <button className="section-link" type="button" onClick={() => setCheckoutOpen(true)}>
            Review cart
          </button>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="product-card">
              <button
                className="save-button"
                type="button"
                onClick={() => toggleSaved(product.name)}
                aria-pressed={saved.has(product.name)}
              >
                {saved.has(product.name) ? "Saved" : "Save"}
              </button>
              <button className="product-image-button" type="button" onClick={() => setSelectedProduct(product)}>
                <img src={product.image} alt={product.name} />
              </button>
              <div className="product-info">
                <button type="button" onClick={() => setSelectedProduct(product)}>
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <span>{formatPrice(product.price)}</span>
                  <small>{product.note}</small>
                </button>
                <button className="cart-action" type="button" onClick={() => addToCart(product.id)}>
                  Add to bag
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="merchant" className="merchant-section">
        <div className="merchant-header">
          <div>
            <p className="eyebrow">Merchant console</p>
            <h2>Product operations without leaving the brand world.</h2>
            <p>
              This prototype shows the merchant journey. Real accounts, database
              records, and payment webhooks can be wired in the next backend pass.
            </p>
          </div>
          <div className="merchant-status">
            <span>{session?.role === "merchant" ? "Merchant active" : "Merchant locked"}</span>
            <button type="button" onClick={() => loginAs("merchant")}>Open merchant mode</button>
          </div>
        </div>

        <div className={session?.role === "merchant" ? "merchant-console" : "merchant-console locked"}>
          <form className="merchant-form" onSubmit={addMerchantProduct}>
            <h3>Add product</h3>
            <label>
              Product name
              <input
                value={merchantForm.name}
                onChange={(event) => setMerchantForm({ ...merchantForm, name: event.target.value })}
                required
              />
            </label>
            <div className="form-row">
              <label>
                Category
                <select
                  value={merchantForm.category}
                  onChange={(event) => setMerchantForm({ ...merchantForm, category: event.target.value })}
                >
                  {categories.slice(1).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Price
                <input
                  type="number"
                  min="1"
                  value={merchantForm.price}
                  onChange={(event) => setMerchantForm({ ...merchantForm, price: event.target.value })}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  value={merchantForm.stock}
                  onChange={(event) => setMerchantForm({ ...merchantForm, stock: event.target.value })}
                  required
                />
              </label>
              <label>
                Note
                <input
                  value={merchantForm.note}
                  onChange={(event) => setMerchantForm({ ...merchantForm, note: event.target.value })}
                  required
                />
              </label>
            </div>
            <label>
              Material story
              <textarea
                value={merchantForm.material}
                onChange={(event) => setMerchantForm({ ...merchantForm, material: event.target.value })}
                required
              />
            </label>
            <button type="submit">Publish product</button>
          </form>

          <div className="inventory-panel">
            <div className="inventory-head">
              <h3>Inventory</h3>
              <span>{products.length} products</span>
            </div>
            {products.map((product) => (
              <article className="inventory-row" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.category} / {formatPrice(product.price)}</p>
                </div>
                <div className="stock-control">
                  <button type="button" onClick={() => updateStock(product.id, -1)}>-</button>
                  <span>{product.stock}</span>
                  <button type="button" onClick={() => updateStock(product.id, 1)}>+</button>
                </div>
                <button className="status-toggle" type="button" onClick={() => toggleStatus(product.id)}>
                  {product.status}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="craft" className="craft-section">
        <div className="craft-intro">
          <p className="eyebrow">Design and craftsmanship</p>
          <h2>Where material meets mastery.</h2>
          <p>
            The template uses lifestyle room scenes, isolated product imagery,
            material macro crops, transparent CGI, and virtual-real composites.
          </p>
          <a href="#spaces" className="section-link dark">Discover process</a>
        </div>
        <div className="craft-grid">
          {craftItems.map((item) => (
            <article className="craft-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <span>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="spaces" className="section spaces-section">
        <div className="spaces-copy">
          <p className="eyebrow">Space inspiration</p>
          <h2>Spaces that inspire daily.</h2>
          <p>
            Curated interiors bring furniture, lighting, and compact appliances
            together in harmonious, livable scenes.
          </p>
        </div>
        <div className="space-grid">
          {spaces.map((space) => (
            <article className="space-card" key={space.title}>
              <img src={space.image} alt={space.title} />
              <div>
                <h3>{space.title}</h3>
                <p>{space.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="payment-section">
        <div>
          <p className="eyebrow">Payment architecture</p>
          <h2>Ready for real checkout integration.</h2>
        </div>
        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <span key={method}>{method}</span>
          ))}
        </div>
      </section>

      <footer className="service-strip">
        {serviceItems.map(([title, copy]) => (
          <div key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </footer>

      {loginOpen ? (
        <div className="modal-layer" role="dialog" aria-label="Login selection">
          <div className="login-modal">
            <button className="drawer-close" type="button" onClick={() => setLoginOpen(false)}>
              Close
            </button>
            <p className="eyebrow">Secure access</p>
            <h2>Choose your portal.</h2>
            <div className="role-switch">
              <button
                className={loginRole === "customer" ? "active" : ""}
                type="button"
                onClick={() => setLoginRole("customer")}
              >
                Customer
              </button>
              <button
                className={loginRole === "merchant" ? "active" : ""}
                type="button"
                onClick={() => setLoginRole("merchant")}
              >
                Merchant
              </button>
            </div>
            <form onSubmit={(event) => { event.preventDefault(); loginAs(loginRole); }}>
              <label>
                Email
                <input type="email" defaultValue={loginRole === "merchant" ? "merchant@atelier.demo" : "client@atelier.demo"} />
              </label>
              <label>
                Password
                <input type="password" defaultValue="demo-access" />
              </label>
              <button type="submit">
                Continue as {loginRole === "merchant" ? "merchant" : "customer"}
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {checkoutOpen ? (
        <div className="modal-layer" role="dialog" aria-label="Checkout">
          <div className="checkout-modal">
            <button className="drawer-close" type="button" onClick={() => setCheckoutOpen(false)}>
              Close
            </button>
            <p className="eyebrow">Checkout</p>
            <h2>{orderState === "paid" ? "Order confirmed." : "Complete your order."}</h2>
            {orderState === "paid" ? (
              <div className="success-panel">
                <p>Your demo payment was accepted. A real gateway can be attached through Stripe, WeChat Pay, or Alipay in the backend phase.</p>
                <button type="button" onClick={() => { setOrderState("idle"); setCheckoutOpen(false); }}>
                  Return to store
                </button>
              </div>
            ) : (
              <div className="checkout-grid">
                <div className="cart-list">
                  {cartItems.length ? cartItems.map((item) => (
                    <article className="cart-row" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <p>{formatPrice(item.price)}</p>
                        <div className="stock-control">
                          <button type="button" onClick={() => changeQuantity(item.id, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    </article>
                  )) : (
                    <div className="empty-cart">
                      <p>Your bag is empty.</p>
                      <button type="button" onClick={() => setCheckoutOpen(false)}>Browse products</button>
                    </div>
                  )}
                </div>
                <form className="payment-form" onSubmit={completePayment}>
                  <label>
                    Payment method
                    <select defaultValue="Card checkout">
                      {paymentMethods.map((method) => (
                        <option key={method}>{method}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Card number
                    <input inputMode="numeric" placeholder="4242 4242 4242 4242" required={cartItems.length > 0} />
                  </label>
                  <div className="total-box">
                    <span>Subtotal {formatPrice(subtotal)}</span>
                    <span>Delivery {formatPrice(shipping)}</span>
                    <strong>Total {formatPrice(total)}</strong>
                  </div>
                  <button type="submit" disabled={!cartItems.length || orderState === "processing"}>
                    {orderState === "processing" ? "Processing" : "Pay demo order"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {selectedProduct ? (
        <div className="detail-drawer" role="dialog" aria-label="Selected product details">
          <img src={selectedProduct.image} alt={selectedProduct.name} />
          <div>
            <button className="drawer-close" type="button" onClick={() => setSelectedProduct(null)}>
              Close
            </button>
            <p className="eyebrow">{selectedProduct.category}</p>
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.material}</p>
            <div className="drawer-meta">
              <span>{formatPrice(selectedProduct.price)}</span>
              <small>{selectedProduct.note}</small>
            </div>
            <button className="cart-action drawer-cart" type="button" onClick={() => addToCart(selectedProduct.id)}>
              Add to bag
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
