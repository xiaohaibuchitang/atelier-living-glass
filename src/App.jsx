import { useEffect, useMemo, useState } from "react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const categories = ["All Products", "Sofas", "Seating", "Lighting", "Appliances", "Accessories"];

const seedProducts = [
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

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function imageUrl(path) {
  if (!path) return asset("assets/product-purifier.png");
  if (path.startsWith("/assets/")) return asset(path.slice(1));
  return path;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function usePath() {
  const [path, setPath] = useState(`${window.location.pathname}${window.location.search}`);
  useEffect(() => {
    const onPop = () => setPath(`${window.location.pathname}${window.location.search}`);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function navigate(nextPath) {
    window.history.pushState({}, "", nextPath);
    setPath(`${window.location.pathname}${window.location.search}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return [path, navigate];
}

export function App() {
  const [path, navigate] = usePath();
  const route = path.split("?")[0];
  const query = new URLSearchParams(path.split("?")[1] || "");
  const [products, setProducts] = useState(seedProducts);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [notice, setNotice] = useState("");
  const [merchantProducts, setMerchantProducts] = useState([]);
  const [merchantOrders, setMerchantOrders] = useState([]);

  useEffect(() => {
    loadPublicProducts();
    api("/api/customer/me").then((data) => setCustomer(data.user)).catch(() => setCustomer(null));
    api("/api/merchant/me").then((data) => setMerchant(data.user)).catch(() => setMerchant(null));
  }, []);

  async function loadPublicProducts() {
    try {
      const data = await api("/api/products");
      setProducts(data.products);
    } catch {
      setProducts(seedProducts);
    }
  }

  async function loadMerchantData() {
    const [productData, orderData] = await Promise.all([
      api("/api/merchant/products"),
      api("/api/merchant/orders"),
    ]);
    setMerchantProducts(productData.products);
    setMerchantOrders(orderData.orders);
  }

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Products") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

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

  function addToCart(productId) {
    setCart((current) => {
      const found = current.find((item) => item.productId === productId);
      if (found) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { productId, quantity: 1 }];
    });
    setNotice("Added to bag.");
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

  async function customerLogin(values, mode) {
    const endpoint = mode === "register" ? "/api/customer/register" : "/api/customer/login";
    const data = await api(endpoint, {
      method: "POST",
      body: JSON.stringify(values),
    });
    setCustomer(data.user);
    setNotice(mode === "register" ? "Account created." : "Welcome back.");
    navigate(query.get("next") || "/checkout");
  }

  async function merchantLogin(values) {
    const data = await api("/api/merchant/login", {
      method: "POST",
      body: JSON.stringify(values),
    });
    setMerchant(data.user);
    setNotice("Merchant portal unlocked.");
    await loadMerchantData();
    navigate("/merchant/dashboard");
  }

  async function logout(role) {
    await api(role === "merchant" ? "/api/merchant/logout" : "/api/customer/logout", { method: "POST" });
    if (role === "merchant") setMerchant(null);
    if (role === "customer") setCustomer(null);
    navigate(role === "merchant" ? "/merchant/login" : "/");
  }

  async function placeOrder(provider) {
    if (!customer) {
      navigate("/account/register?next=/checkout");
      return;
    }
    if (!cartItems.length) {
      setNotice("Your bag is empty.");
      return;
    }
    const orderData = await api("/api/customer/orders", {
      method: "POST",
      body: JSON.stringify({
        items: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    });
    const paymentData = await api("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ orderId: orderData.order.id, provider }),
    });
    setCart([]);
    if (paymentData.payment.checkoutUrl) {
      window.location.href = paymentData.payment.checkoutUrl;
    } else {
      setNotice("Test checkout created. Add Stripe keys to enable real card payment.");
      navigate("/account/orders");
    }
  }

  async function saveMerchantProduct(values) {
    await api("/api/merchant/products", {
      method: "POST",
      body: JSON.stringify(values),
    });
    setNotice("Product published.");
    await loadMerchantData();
    await loadPublicProducts();
  }

  async function updateMerchantProduct(productId, patch) {
    await api(`/api/merchant/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    await loadMerchantData();
    await loadPublicProducts();
  }

  let page = null;
  if (route.startsWith("/merchant")) {
    page = (
      <MerchantShell
        route={route}
        merchant={merchant}
        products={merchantProducts}
        orders={merchantOrders}
        onLogin={merchantLogin}
        onLogout={() => logout("merchant")}
        onLoad={loadMerchantData}
        onSaveProduct={saveMerchantProduct}
        onUpdateProduct={updateMerchantProduct}
        navigate={navigate}
      />
    );
  } else if (route === "/account/login" || route === "/account/register") {
    page = (
      <CustomerAuthPage
        mode={route.endsWith("register") ? "register" : "login"}
        onSubmit={customerLogin}
        navigate={navigate}
      />
    );
  } else if (route === "/account/orders") {
    page = <OrdersPage customer={customer} navigate={navigate} onLogout={() => logout("customer")} />;
  } else if (route === "/checkout") {
    page = (
      <CheckoutPage
        customer={customer}
        cartItems={cartItems}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        onQuantity={changeQuantity}
        onOrder={placeOrder}
        navigate={navigate}
      />
    );
  } else {
    page = (
      <Storefront
        customer={customer}
        products={filteredProducts}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSelect={setSelectedProduct}
        onCart={addToCart}
        navigate={navigate}
      />
    );
  }

  return (
    <main className="site-shell">
      {!route.startsWith("/merchant") ? (
        <PublicTopbar customer={customer} cartCount={cartCount} navigate={navigate} onLogout={() => logout("customer")} />
      ) : null}
      {notice ? (
        <button className="notice-toast" type="button" onClick={() => setNotice("")}>
          {notice}
        </button>
      ) : null}
      {page}
      {selectedProduct ? (
        <ProductDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} onCart={addToCart} />
      ) : null}
    </main>
  );
}

function PublicTopbar({ customer, cartCount, navigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="topbar">
      <button className="brand brand-button" type="button" onClick={() => navigate("/")}>
        <span>ATELIER</span>
        <small>LIVING GLASS</small>
      </button>
      <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Primary">
        <button type="button" onClick={() => navigate("/")}>Store</button>
        <a href="/#collection">Products</a>
        <a href="/#spaces">Spaces</a>
        <a href="/#craft">Materials</a>
        <button type="button" onClick={() => navigate("/account/orders")}>Orders</button>
      </nav>
      <div className="utility">
        {customer ? (
          <>
            <button className="text-button" type="button" onClick={() => navigate("/account/orders")}>
              {customer.name}
            </button>
            <button className="text-button" type="button" onClick={onLogout}>Sign out</button>
          </>
        ) : (
          <>
            <button className="text-button" type="button" onClick={() => navigate("/account/login")}>Login</button>
            <button className="text-button" type="button" onClick={() => navigate("/account/register")}>Register</button>
          </>
        )}
        <button className="bag-button" type="button" onClick={() => navigate("/checkout")}>
          Bag <span>{cartCount}</span>
        </button>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)}>
          Menu
        </button>
      </div>
    </header>
  );
}

function Storefront({ customer, products, activeCategory, setActiveCategory, onSelect, onCart, navigate }) {
  return (
    <>
      <section id="top" className="hero-section">
        <img className="hero-image" src={asset("assets/hero-living-room.png")} alt="Luxury living room with sofa, chair, floor lamp, and small appliances" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Public storefront</p>
            <h1>Design that lives beautifully.</h1>
            <p>
              Browse premium furniture and small appliances freely. When you buy,
              the store moves you into a protected customer checkout.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#collection">Shop collection</a>
              <button className="secondary-action" type="button" onClick={() => navigate(customer ? "/checkout" : "/account/register?next=/checkout")}>
                Start checkout
              </button>
            </div>
          </div>
          <aside className="glass-panel hero-panel" aria-label="Store access rules">
            <p className="panel-label">Access model</p>
            <h2>Browse first. Register only when buying.</h2>
            <p>
              Customers can inspect products without friction. Accounts are required
              only for checkout, saved orders, payment, and after-sale service.
            </p>
            <div className="panel-divider" />
            <p className="panel-label">Merchant backend</p>
            <p className="panel-statement">Separated by URL, cookie, and API role.</p>
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

      <section id="collection" className="section collection-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Open catalog</p>
            <h2>Products are visible before login.</h2>
          </div>
          <button className="section-link" type="button" onClick={() => navigate("/checkout")}>
            Review bag
          </button>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <button className="product-image-button" type="button" onClick={() => onSelect(product)}>
                <img src={imageUrl(product.image)} alt={product.name} />
              </button>
              <div className="product-info">
                <button type="button" onClick={() => onSelect(product)}>
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <span>{formatPrice(product.price)}</span>
                  <small>{product.note}</small>
                </button>
                <button className="cart-action" type="button" onClick={() => onCart(product.id)}>
                  Add to bag
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="spaces" className="section spaces-section">
        <div className="spaces-copy">
          <p className="eyebrow">Space inspiration</p>
          <h2>Spaces that inspire daily.</h2>
          <p>Curated interiors bring furniture, lighting, and compact appliances together in harmonious, livable scenes.</p>
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

      <section id="craft" className="payment-section">
        <div>
          <p className="eyebrow">Commercial foundation</p>
          <h2>Ready for database, roles, orders, and payment.</h2>
        </div>
        <div className="payment-methods">
          <span>Customer auth</span>
          <span>Merchant auth</span>
          <span>D1 products</span>
          <span>Stripe-ready checkout</span>
        </div>
      </section>
    </>
  );
}

function CustomerAuthPage({ mode, onSubmit, navigate }) {
  const [form, setForm] = useState({ name: "Private Client", email: "", password: "" });
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await onSubmit(form, mode);
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <section className="route-shell auth-layout">
      <div>
        <p className="eyebrow">Customer portal</p>
        <h1>{mode === "register" ? "Create your buying account." : "Welcome back."}</h1>
        <p className="route-copy">
          Product browsing stays public. Checkout, payment, and order history require a customer account.
        </p>
      </div>
      <form className="route-card" onSubmit={submit}>
        {mode === "register" ? (
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
        ) : null}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength="8" required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit">{mode === "register" ? "Register and continue" : "Login and continue"}</button>
        <button className="ghost-action" type="button" onClick={() => navigate(mode === "register" ? "/account/login" : "/account/register")}>
          {mode === "register" ? "Already have an account" : "Create account"}
        </button>
      </form>
    </section>
  );
}

function CheckoutPage({ customer, cartItems, subtotal, shipping, total, onQuantity, onOrder, navigate }) {
  const [provider, setProvider] = useState("stripe");
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await onOrder(provider);
    } catch (err) {
      setError(err.message);
    }
  }
  if (!customer) {
    return (
      <section className="route-shell auth-required">
        <p className="eyebrow">Checkout locked</p>
        <h1>Register before purchase.</h1>
        <p className="route-copy">
          You can browse products without an account. To buy, create a customer login first.
        </p>
        <div className="route-actions">
          <button className="primary-action" type="button" onClick={() => navigate("/account/register?next=/checkout")}>Register to buy</button>
          <button className="secondary-action" type="button" onClick={() => navigate("/account/login?next=/checkout")}>Customer login</button>
        </div>
      </section>
    );
  }
  return (
    <section className="route-shell checkout-page">
      <div>
        <p className="eyebrow">Customer checkout</p>
        <h1>Secure purchase flow.</h1>
        <p className="route-copy">Orders are created in D1, then passed to the payment layer.</p>
      </div>
      <div className="checkout-grid">
        <div className="cart-list">
          {cartItems.length ? cartItems.map((item) => (
            <article className="cart-row" key={item.id}>
              <img src={imageUrl(item.image)} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>{formatPrice(item.price)}</p>
                <div className="stock-control">
                  <button type="button" onClick={() => onQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            </article>
          )) : <p className="route-copy">Your bag is empty.</p>}
        </div>
        <form className="payment-form" onSubmit={submit}>
          <label>
            Payment method
            <select value={provider} onChange={(event) => setProvider(event.target.value)}>
              <option value="stripe">Stripe card checkout</option>
              <option value="bank">Bank transfer</option>
              <option value="wechat">WeChat Pay slot</option>
              <option value="alipay">Alipay slot</option>
            </select>
          </label>
          <div className="total-box">
            <span>Subtotal {formatPrice(subtotal)}</span>
            <span>Delivery {formatPrice(shipping)}</span>
            <strong>Total {formatPrice(total)}</strong>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={!cartItems.length}>Create order and pay</button>
        </form>
      </div>
    </section>
  );
}

function OrdersPage({ customer, navigate, onLogout }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (customer) api("/api/customer/orders").then((data) => setOrders(data.orders)).catch(() => setOrders([]));
  }, [customer]);
  if (!customer) {
    return (
      <section className="route-shell auth-required">
        <p className="eyebrow">Customer orders</p>
        <h1>Login to view orders.</h1>
        <button className="primary-action" type="button" onClick={() => navigate("/account/login")}>Customer login</button>
      </section>
    );
  }
  return (
    <section className="route-shell">
      <div className="route-head">
        <div>
          <p className="eyebrow">Customer account</p>
          <h1>Your orders.</h1>
        </div>
        <button className="secondary-action" type="button" onClick={onLogout}>Sign out</button>
      </div>
      <div className="inventory-panel order-panel">
        {orders.length ? orders.map((order) => (
          <article className="order-row" key={order.id}>
            <div>
              <h3>{order.id}</h3>
              <p>{order.status}</p>
            </div>
            <strong>{formatPrice(order.total)}</strong>
          </article>
        )) : <p className="route-copy">No orders yet.</p>}
      </div>
    </section>
  );
}

function MerchantShell({ route, merchant, products, orders, onLogin, onLogout, onLoad, onSaveProduct, onUpdateProduct, navigate }) {
  useEffect(() => {
    if (merchant) onLoad().catch(() => {});
  }, [merchant]);

  if (!merchant) {
    return <MerchantLoginPage onLogin={onLogin} />;
  }

  return (
    <section className="merchant-app">
      <aside className="merchant-sidebar">
        <button className="brand brand-button" type="button" onClick={() => navigate("/merchant/dashboard")}>
          <span>ATELIER</span>
          <small>MERCHANT</small>
        </button>
        <nav>
          <button type="button" onClick={() => navigate("/merchant/dashboard")}>Dashboard</button>
          <button type="button" onClick={() => navigate("/merchant/products")}>Products</button>
          <button type="button" onClick={() => navigate("/merchant/orders")}>Orders</button>
          <button type="button" onClick={onLogout}>Sign out</button>
        </nav>
      </aside>
      {route === "/merchant/products" ? (
        <MerchantProducts products={products} onSave={onSaveProduct} onUpdate={onUpdateProduct} />
      ) : route === "/merchant/orders" ? (
        <MerchantOrders orders={orders} />
      ) : (
        <MerchantDashboard products={products} orders={orders} merchant={merchant} navigate={navigate} />
      )}
    </section>
  );
}

function MerchantLoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "merchant@atelier.demo", password: "" });
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await onLogin(form);
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <section className="merchant-login">
      <div>
        <p className="eyebrow">Private merchant URL</p>
        <h1>Merchant backend is separated.</h1>
        <p className="route-copy">
          This portal uses a merchant-only cookie and merchant-only API routes.
          Customer accounts cannot access it.
        </p>
      </div>
      <form className="route-card" onSubmit={submit}>
        <label>
          Merchant email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit">Enter merchant backend</button>
      </form>
    </section>
  );
}

function MerchantDashboard({ products, orders, merchant, navigate }) {
  const liveCount = products.filter((product) => product.status === "Live").length;
  const stock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  return (
    <div className="merchant-main">
      <p className="eyebrow">Merchant dashboard</p>
      <h1>Welcome, {merchant.name}.</h1>
      <div className="metric-grid">
        <Metric label="Live products" value={liveCount} />
        <Metric label="Total stock" value={stock} />
        <Metric label="Orders" value={orders.length} />
        <Metric label="Revenue" value={formatPrice(revenue)} />
      </div>
      <div className="route-actions">
        <button className="primary-action" type="button" onClick={() => navigate("/merchant/products")}>Manage products</button>
        <button className="secondary-action" type="button" onClick={() => navigate("/merchant/orders")}>View orders</button>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function MerchantProducts({ products, onSave, onUpdate }) {
  const [form, setForm] = useState({
    name: "Nord Air Circulator",
    category: "Appliances",
    price: "329",
    stock: "22",
    note: "Quiet airflow",
    material: "Compact smart fan with matte graphite shell",
    image: "/assets/product-purifier.png",
  });
  async function submit(event) {
    event.preventDefault();
    await onSave(form);
    setForm({ ...form, name: "", price: "", stock: "", note: "", material: "" });
  }
  return (
    <div className="merchant-main two-column">
      <form className="merchant-form" onSubmit={submit}>
        <p className="eyebrow">Products</p>
        <h2>Add product</h2>
        <label>
          Product name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <div className="form-row">
          <label>
            Category
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.slice(1).map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label>
            Price
            <input type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Stock
            <input type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
          </label>
          <label>
            Image path
            <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required />
          </label>
        </div>
        <label>
          Note
          <input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} required />
        </label>
        <label>
          Material story
          <textarea value={form.material} onChange={(event) => setForm({ ...form, material: event.target.value })} required />
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
            <img src={imageUrl(product.image)} alt={product.name} />
            <div>
              <h4>{product.name}</h4>
              <p>{product.category} / {formatPrice(product.price)}</p>
            </div>
            <div className="stock-control">
              <button type="button" onClick={() => onUpdate(product.id, { stock: Math.max(0, product.stock - 1) })}>-</button>
              <span>{product.stock}</span>
              <button type="button" onClick={() => onUpdate(product.id, { stock: product.stock + 1 })}>+</button>
            </div>
            <button
              className="status-toggle"
              type="button"
              onClick={() => onUpdate(product.id, { status: product.status === "Live" ? "Hidden" : "Live" })}
            >
              {product.status}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function MerchantOrders({ orders }) {
  return (
    <div className="merchant-main">
      <p className="eyebrow">Merchant orders</p>
      <h1>Order operations.</h1>
      <div className="inventory-panel order-panel">
        {orders.length ? orders.map((order) => (
          <article className="order-row" key={order.id}>
            <div>
              <h3>{order.customer_name}</h3>
              <p>{order.customer_email} / {order.status}</p>
            </div>
            <strong>{formatPrice(order.total)}</strong>
          </article>
        )) : <p className="route-copy">No customer orders yet.</p>}
      </div>
    </div>
  );
}

function ProductDrawer({ product, onClose, onCart }) {
  return (
    <div className="detail-drawer" role="dialog" aria-label="Selected product details">
      <img src={imageUrl(product.image)} alt={product.name} />
      <div>
        <button className="drawer-close" type="button" onClick={onClose}>Close</button>
        <p className="eyebrow">{product.category}</p>
        <h2>{product.name}</h2>
        <p>{product.material}</p>
        <div className="drawer-meta">
          <span>{formatPrice(product.price)}</span>
          <small>{product.note}</small>
        </div>
        <button className="cart-action drawer-cart" type="button" onClick={() => onCart(product.id)}>
          Add to bag
        </button>
      </div>
    </div>
  );
}
