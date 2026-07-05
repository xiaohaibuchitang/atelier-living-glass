import { useEffect, useMemo, useState } from "react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const categories = ["All Products", "Sofas", "Seating", "Lighting", "Appliances", "Accessories"];
const styles = ["Quiet Luxury", "Calm Minimalism", "Urban Warmth", "Modern Retreat"];

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

const gallery = [
  asset("assets/hero-living-room.png"),
  asset("assets/process-fabric.png"),
  asset("assets/process-chair-detail.png"),
  asset("assets/process-transparent-espresso.png"),
  asset("assets/process-lifestyle.png"),
];

const productDetails = {
  "sofa-glasswell": {
    style: "Calm Minimalism",
    dimensions: '126"W x 39"D x 28"H',
    weight: "218 lb",
    warranty: "10-year frame warranty, 3-year upholstery warranty",
    delivery: "White-glove delivery in 7-14 business days. Oversized freight included above $3,000.",
    installation: "Room placement and packaging removal included.",
    returns: "30-day return window on unused modular units.",
    specs: ["Kiln-dried hardwood frame", "High-resilience foam", "Removable boucle covers", "Modular clips included"],
    package: ["Left module", "Right module", "Corner module", "Care kit", "Leveling glides"],
    variants: {
      fabric: ["Cloud boucle", "Mist wool", "Graphite weave"],
      color: ["Ivory", "Mushroom", "Charcoal"],
      size: ["3-seat", "4-seat", "Chaise"],
      config: ["Linear", "Corner", "Conversation pit"],
    },
    priceAdjustments: { "4-seat": 760, Chaise: 1180, Corner: 640, "Conversation pit": 1680 },
    images: [asset("assets/product-sofa.png"), gallery[0], gallery[1], gallery[4]],
    review: "The scale feels architectural, but the cushions are genuinely relaxed.",
  },
  "chair-milo": {
    style: "Urban Warmth",
    dimensions: '33"W x 34"D x 30"H',
    weight: "72 lb",
    warranty: "5-year frame warranty, 2-year fabric warranty",
    delivery: "Parcel freight in 5-9 business days. White-glove upgrade available.",
    installation: "No assembly required.",
    returns: "30-day return window with original packaging.",
    specs: ["Smoked steel swivel base", "Olive wool blend", "Feather-fiber back cushion", "Floor-safe glides"],
    package: ["Lounge chair", "Dust cover", "Care card"],
    variants: {
      fabric: ["Olive wool", "Sand velvet", "Black leather"],
      color: ["Olive", "Sand", "Black"],
      size: ["Standard", "Wide"],
      config: ["Swivel", "Fixed base"],
    },
    priceAdjustments: { Wide: 240, "Black leather": 420, "Fixed base": -120 },
    images: [asset("assets/product-chair.png"), gallery[2], gallery[1], asset("assets/space-urban.png")],
    review: "It reads like a design piece and still works for long reading sessions.",
  },
  "lamp-aurora": {
    style: "Modern Retreat",
    dimensions: '14"W x 14"D x 62"H',
    weight: "31 lb",
    warranty: "3-year electrical warranty",
    delivery: "Ships in 3-6 business days.",
    installation: "Tool-free shade and column assembly.",
    returns: "30-day return window.",
    specs: ["2700K warm LED", "Touch dimmer", "Translucent shade", "Weighted stone base"],
    package: ["Lamp base", "Column", "Shade", "LED module", "Power cord"],
    variants: {
      fabric: ["Translucent shade", "Opal shade"],
      color: ["Graphite", "Warm nickel"],
      size: ["Floor", "Tall floor"],
      config: ["Plug-in", "Smart dimmer"],
    },
    priceAdjustments: { "Tall floor": 180, "Smart dimmer": 120 },
    images: [asset("assets/product-lamp.png"), asset("assets/hero-living-room.png"), gallery[4]],
    review: "The dimming range is soft enough for evening rooms.",
  },
  "appliance-lumiere": {
    style: "Urban Warmth",
    dimensions: '11"W x 13"D x 12"H',
    weight: "18 lb",
    warranty: "2-year appliance warranty",
    delivery: "Ships in 2-5 business days.",
    installation: "Countertop setup guide included.",
    returns: "14-day return window for unused machines.",
    specs: ["15 bar pressure", "Quiet pump", "58 mm portafilter", "Removable 1.8 L tank"],
    package: ["Coffee machine", "Portafilter", "Milk pitcher", "Tamper", "Cleaning kit"],
    variants: {
      fabric: ["Brushed steel", "Graphite shell"],
      color: ["Steel", "Graphite", "Champagne"],
      size: ["Compact", "Pro"],
      config: ["Manual steam", "Auto milk"],
    },
    priceAdjustments: { Pro: 190, "Auto milk": 160 },
    images: [asset("assets/product-espresso.png"), gallery[3], asset("assets/space-urban.png")],
    review: "Compact, quiet, and the finish looks intentional beside furniture.",
  },
  "appliance-purelite": {
    style: "Modern Retreat",
    dimensions: '13"W x 13"D x 23"H',
    weight: "16 lb",
    warranty: "2-year motor warranty",
    delivery: "Ships in 2-5 business days.",
    installation: "Plug-in setup with first filter installed.",
    returns: "30-day return window.",
    specs: ["H13 HEPA filter", "32 dB sleep mode", "450 sq ft coverage", "Washable pre-filter"],
    package: ["Air purifier", "HEPA filter", "Quick guide"],
    variants: {
      fabric: ["Graphite shell", "Soft white shell"],
      color: ["Graphite", "White"],
      size: ["Room", "Loft"],
      config: ["Manual", "App connected"],
    },
    priceAdjustments: { Loft: 90, "App connected": 60 },
    images: [asset("assets/product-purifier.png"), gallery[4], asset("assets/hero-living-room.png")],
    review: "Quiet enough that we forgot it was on, which is exactly the point.",
  },
  "kettle-vera": {
    style: "Quiet Luxury",
    dimensions: '8"W x 9"D x 10"H',
    weight: "4 lb",
    warranty: "1-year appliance warranty",
    delivery: "Ships in 2-4 business days.",
    installation: "No assembly required.",
    returns: "14-day return window for unused appliances.",
    specs: ["Variable temperature", "Gooseneck spout", "Keep-warm mode", "Insulated handle"],
    package: ["Kettle", "Power base", "Care guide"],
    variants: {
      fabric: ["Matte metal", "Brushed metal"],
      color: ["Champagne", "Graphite", "Ivory"],
      size: ["0.9 L", "1.2 L"],
      config: ["Standard", "Precision pour"],
    },
    priceAdjustments: { "1.2 L": 30, "Precision pour": 45 },
    images: [asset("assets/product-kettle.png"), gallery[3], asset("assets/process-lifestyle.png")],
    review: "The temperature presets make morning tea feel cleaner and calmer.",
  },
};

const looks = [
  {
    slug: "calm-minimalism",
    title: "Calm Minimalism",
    copy: "Ivory upholstery, quiet lighting, and soft appliance silhouettes for serene rooms.",
    image: asset("assets/space-calm.png"),
    products: ["sofa-glasswell", "lamp-aurora", "appliance-purelite"],
  },
  {
    slug: "urban-warmth",
    title: "Urban Warmth",
    copy: "Layered texture, coffee ritual, and compact seating for refined city living.",
    image: asset("assets/space-urban.png"),
    products: ["chair-milo", "appliance-lumiere", "kettle-vera"],
  },
  {
    slug: "modern-retreat",
    title: "Modern Retreat",
    copy: "A full living system that balances modular furniture, glow, and air care.",
    image: asset("assets/hero-living-room.png"),
    products: ["sofa-glasswell", "chair-milo", "lamp-aurora", "appliance-purelite"],
  },
];

const faqs = [
  ["Delivery time", "In-stock furniture ships in 7-14 business days; small appliances ship in 2-5 business days."],
  ["Installation", "White-glove furniture delivery includes room placement, leveling, and packaging removal."],
  ["Returns", "Furniture has a 30-day return window when unused; small appliances follow the stated product window."],
  ["Payment safety", "Checkout is prepared for SSL-secured Stripe card payment, with bank, WeChat, and Alipay slots."],
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

function enrichProduct(product) {
  const detail = productDetails[product.id] || {};
  return {
    ...product,
    style: detail.style || "Quiet Luxury",
    images: detail.images || [imageUrl(product.image), gallery[0], gallery[1]],
    variants: detail.variants || {
      fabric: ["Standard finish"],
      color: ["Signature"],
      size: ["One size"],
      config: ["Standard"],
    },
    priceAdjustments: detail.priceAdjustments || {},
    dimensions: detail.dimensions || "Dimensions pending",
    weight: detail.weight || "Weight pending",
    warranty: detail.warranty || "Warranty details pending",
    delivery: detail.delivery || "Delivery timing shown at checkout",
    installation: detail.installation || "Installation option available",
    returns: detail.returns || "Return policy applies",
    specs: detail.specs || [product.material],
    package: detail.package || ["Product", "Care guide"],
    review: detail.review || "Beautifully finished and easy to place.",
  };
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
  if (!response.ok) throw new Error(data.error || "Request failed");
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
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return [path, navigate];
}

function defaultSelection(product) {
  return Object.fromEntries(
    Object.entries(product.variants).map(([key, values]) => [key, values[0]]),
  );
}

function selectionPrice(product, selection) {
  return Object.values(selection).reduce(
    (sum, value) => sum + Number(product.priceAdjustments?.[value] || 0),
    Number(product.price || 0),
  );
}

function cartKey(productId, selection = {}) {
  return `${productId}::${Object.values(selection).join("|")}`;
}

export function App() {
  const [path, navigate] = usePath();
  const route = path.split("?")[0];
  const query = new URLSearchParams(path.split("?")[1] || "");
  const [products, setProducts] = useState(seedProducts.map(enrichProduct));
  const [filters, setFilters] = useState({ category: "All Products", style: "All Styles", maxPrice: "8000", stock: false, sort: "newest", search: "" });
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
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

  useEffect(() => {
    let title = "Atelier Living Glass | Furniture and Small Appliances";
    const description = "Premium furniture and small appliances with secure checkout, merchant backend, and curated space inspiration.";
    if (route.startsWith("/products/")) {
      const product = products.find((entry) => entry.id === route.split("/").pop());
      if (product) title = `${product.name} | Atelier Living Glass`;
    }
    if (route.startsWith("/looks/")) {
      const look = looks.find((entry) => entry.slug === route.split("/").pop());
      if (look) title = `${look.title} Collection | Atelier Living Glass`;
    }
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [route, products]);

  async function loadPublicProducts() {
    try {
      const data = await api("/api/products");
      setProducts(data.products.map(enrichProduct));
    } catch {
      setProducts(seedProducts.map(enrichProduct));
    }
  }

  async function loadMerchantData() {
    const [productData, orderData] = await Promise.all([
      api("/api/merchant/products"),
      api("/api/merchant/orders"),
    ]);
    setMerchantProducts(productData.products.map(enrichProduct));
    setMerchantOrders(orderData.orders);
  }

  const filteredProducts = useMemo(() => {
    const needle = filters.search.trim().toLowerCase();
    const next = products.filter((product) => {
      const categoryMatch = filters.category === "All Products" || product.category === filters.category;
      const styleMatch = filters.style === "All Styles" || product.style === filters.style;
      const priceMatch = Number(product.price) <= Number(filters.maxPrice || 8000);
      const stockMatch = !filters.stock || Number(product.stock || 0) > 0;
      const searchMatch = !needle || `${product.name} ${product.category} ${product.material}`.toLowerCase().includes(needle);
      return categoryMatch && styleMatch && priceMatch && stockMatch && searchMatch;
    });
    return next.sort((a, b) => {
      if (filters.sort === "price-low") return a.price - b.price;
      if (filters.sort === "price-high") return b.price - a.price;
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [filters, products]);

  const cartItems = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { ...product, ...item, price: item.price } : null;
    })
    .filter(Boolean);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 3000 ? 180 : 0;
  const total = subtotal + shipping;

  function addToCart(productId, selectionInput) {
    const product = products.find((entry) => entry.id === productId);
    if (!product) return;
    const selection = selectionInput || defaultSelection(product);
    const key = cartKey(productId, selection);
    const price = selectionPrice(product, selection);
    setCart((current) => {
      const found = current.find((item) => item.key === key);
      if (found) return current.map((item) => (item.key === key ? { ...item, quantity: item.quantity + 1 } : item));
      return [...current, { key, productId, quantity: 1, selection, price }];
    });
    setCartOpen(true);
    setNotice("Added to cart.");
  }

  function addLookToCart(lookSlug) {
    const look = looks.find((entry) => entry.slug === lookSlug);
    if (!look) return;
    look.products.forEach((productId) => addToCart(productId));
    setNotice("Full look added to cart.");
  }

  function changeQuantity(key, direction) {
    setCart((current) =>
      current
        .map((item) => (item.key === key ? { ...item, quantity: Math.max(0, item.quantity + direction) } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function removeCartItem(key) {
    setCart((current) => current.filter((item) => item.key !== key));
  }

  function toggleWishlist(productId) {
    setWishlist((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  }

  async function customerLogin(values, mode) {
    const endpoint = mode === "register" ? "/api/customer/register" : "/api/customer/login";
    const data = await api(endpoint, { method: "POST", body: JSON.stringify(values) });
    setCustomer(data.user);
    setNotice(mode === "register" ? "Account created." : "Welcome back.");
    navigate(query.get("next") || "/checkout");
  }

  async function merchantLogin(values) {
    const data = await api("/api/merchant/login", { method: "POST", body: JSON.stringify(values) });
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

  async function placeOrder(provider, checkoutProfile) {
    if (!cartItems.length) {
      setNotice("Your cart is empty.");
      return;
    }
    const payload = {
      items: cartItems.map((item) => ({ productId: item.id, quantity: item.quantity, selection: item.selection })),
      guest: customer ? null : checkoutProfile,
      delivery: checkoutProfile,
    };
    const orderData = await api("/api/customer/orders", { method: "POST", body: JSON.stringify(payload) });
    const paymentData = await api("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ orderId: orderData.order.id, provider, guestEmail: checkoutProfile?.email }),
    });
    setCart([]);
    if (paymentData.payment.checkoutUrl) {
      window.location.href = paymentData.payment.checkoutUrl;
    } else {
      setNotice(customer ? "Test checkout created." : "Guest order created. Test payment started.");
      navigate(customer ? "/account/orders" : `/checkout?guestOrder=${orderData.order.id}`);
    }
  }

  async function saveMerchantProduct(values) {
    await api("/api/merchant/products", { method: "POST", body: JSON.stringify(values) });
    setNotice("Product published.");
    await loadMerchantData();
    await loadPublicProducts();
  }

  async function updateMerchantProduct(productId, patch) {
    await api(`/api/merchant/products/${productId}`, { method: "PUT", body: JSON.stringify(patch) });
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
    page = <CustomerAuthPage mode={route.endsWith("register") ? "register" : "login"} onSubmit={customerLogin} navigate={navigate} />;
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
        onRemove={removeCartItem}
        onOrder={placeOrder}
        navigate={navigate}
        guestOrder={query.get("guestOrder")}
      />
    );
  } else if (route.startsWith("/products/")) {
    const product = products.find((entry) => entry.id === route.split("/").pop());
    page = product ? (
      <ProductDetailPage
        product={product}
        wishlist={wishlist}
        onWishlist={toggleWishlist}
        onCart={addToCart}
        navigate={navigate}
      />
    ) : <NotFound navigate={navigate} />;
  } else if (route.startsWith("/looks/")) {
    const look = looks.find((entry) => entry.slug === route.split("/").pop());
    page = look ? (
      <LookPage look={look} products={products} onCart={addToCart} onLookCart={addLookToCart} navigate={navigate} />
    ) : <NotFound navigate={navigate} />;
  } else {
    page = (
      <Storefront
        products={filteredProducts}
        filters={filters}
        setFilters={setFilters}
        wishlist={wishlist}
        onWishlist={toggleWishlist}
        onCart={addToCart}
        onLookCart={addLookToCart}
        navigate={navigate}
      />
    );
  }

  return (
    <main className="site-shell">
      {!route.startsWith("/merchant") ? (
        <PublicTopbar
          customer={customer}
          cartCount={cartCount}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          cartItems={cartItems}
          subtotal={subtotal}
          onQuantity={changeQuantity}
          onRemove={removeCartItem}
          navigate={navigate}
          onLogout={() => logout("customer")}
        />
      ) : null}
      {notice ? (
        <button className="notice-toast" type="button" onClick={() => setNotice("")}>{notice}</button>
      ) : null}
      {page}
      {!route.startsWith("/merchant") ? <SiteFooter navigate={navigate} /> : null}
    </main>
  );
}

function PublicTopbar({ customer, cartCount, cartOpen, setCartOpen, cartItems, subtotal, onQuantity, onRemove, navigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="topbar">
        <button className="brand brand-button" type="button" onClick={() => navigate("/")}>
          <span>ATELIER</span>
          <small>LIVING GLASS</small>
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Primary">
          <button type="button" onClick={() => navigate("/")}>Store</button>
          <button type="button" onClick={() => navigate("/#collection")}>Products</button>
          <button type="button" onClick={() => navigate("/#spaces")}>Space Inspiration</button>
          <button type="button" onClick={() => navigate("/#faq")}>FAQ</button>
          <button type="button" onClick={() => navigate("/merchant/login")}>Merchant</button>
        </nav>
        <div className="utility">
          {customer ? (
            <>
              <button className="text-button" type="button" onClick={() => navigate("/account/orders")}>{customer.name}</button>
              <button className="text-button" type="button" onClick={onLogout}>Sign out</button>
            </>
          ) : (
            <>
              <button className="text-button" type="button" onClick={() => navigate("/account/login")}>Login</button>
              <button className="text-button" type="button" onClick={() => navigate("/account/register")}>Register</button>
            </>
          )}
          <button className="bag-button" type="button" onClick={() => setCartOpen((open) => !open)}>
            Cart <span>{cartCount}</span>
          </button>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)}>Menu</button>
        </div>
      </header>
      {cartOpen ? (
        <MiniCart
          cartItems={cartItems}
          subtotal={subtotal}
          onQuantity={onQuantity}
          onRemove={onRemove}
          onClose={() => setCartOpen(false)}
          navigate={navigate}
        />
      ) : null}
    </>
  );
}

function MiniCart({ cartItems, subtotal, onQuantity, onRemove, onClose, navigate }) {
  return (
    <aside className="mini-cart" aria-label="Mini cart">
      <div className="mini-cart-head">
        <h2>Cart</h2>
        <button type="button" onClick={onClose}>Close</button>
      </div>
      {cartItems.length ? cartItems.map((item) => (
        <article className="mini-cart-row" key={item.key}>
          <img src={imageUrl(item.image)} alt={item.name} />
          <div>
            <h3>{item.name}</h3>
            <p>{Object.values(item.selection || {}).join(" / ")}</p>
            <strong>{formatPrice(item.price)}</strong>
            <div className="stock-control">
              <button type="button" onClick={() => onQuantity(item.key, -1)}>-</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => onQuantity(item.key, 1)}>+</button>
              <button type="button" onClick={() => onRemove(item.key)}>Remove</button>
            </div>
          </div>
        </article>
      )) : <p className="route-copy">Your cart is empty.</p>}
      <div className="mini-cart-total">
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      <button className="primary-action" type="button" onClick={() => { onClose(); navigate("/checkout"); }}>
        Checkout
      </button>
    </aside>
  );
}

function Storefront({ products, filters, setFilters, wishlist, onWishlist, onCart, onLookCart, navigate }) {
  return (
    <>
      <section id="top" className="hero-section">
        <img className="hero-image" src={asset("assets/hero-living-room.png")} alt="Luxury living room with sofa, chair, floor lamp, and small appliances" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Premium commerce storefront</p>
            <h1>Furniture and small appliances, composed as one living system.</h1>
            <p>Browse without login, choose exact specifications, then checkout as a guest or registered customer.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#collection">Shop collection</a>
              <button className="secondary-action" type="button" onClick={() => navigate("/looks/calm-minimalism")}>Shop the look</button>
            </div>
          </div>
          <aside className="glass-panel hero-panel" aria-label="Trust badges">
            <p className="panel-label">Secure buying</p>
            <h2>SSL checkout, protected orders, separated merchant backend.</h2>
            <div className="trust-list">
              <span>SSL encrypted payment</span>
              <span>Stripe ready</span>
              <span>DHL / white-glove delivery</span>
            </div>
          </aside>
        </div>
        <div className="category-glass" aria-label="Product categories">
          {categories.map((category) => (
            <button key={category} type="button" className={category === filters.category ? "category-pill active" : "category-pill"} onClick={() => setFilters({ ...filters, category })}>
              {category}
            </button>
          ))}
        </div>
      </section>

      <TrustStrip />

      <section id="collection" className="section collection-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Open catalog</p>
            <h2>Products are visible before login.</h2>
          </div>
          <button className="section-link" type="button" onClick={() => navigate("/checkout")}>Review cart</button>
        </div>
        <ProductFilters filters={filters} setFilters={setFilters} />
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={wishlist.includes(product.id)}
              onWishlist={onWishlist}
              onCart={onCart}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      <section id="spaces" className="section spaces-section">
        <div className="spaces-copy">
          <p className="eyebrow">Space inspiration</p>
          <h2>Three collections built to convert inspiration into purchase.</h2>
          <p>Each room concept links directly to a shoppable bundle, so editorial content becomes a real buying path.</p>
        </div>
        <div className="space-grid">
          {looks.map((look) => (
            <article className="space-card" key={look.slug}>
              <img src={look.image} alt={look.title} loading="lazy" />
              <div>
                <h3>{look.title}</h3>
                <p>{look.copy}</p>
                <div className="card-actions">
                  <button type="button" onClick={() => navigate(`/looks/${look.slug}`)}>View collection</button>
                  <button type="button" onClick={() => onLookCart(look.slug)}>Shop the Look</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section brand-story">
        <div>
          <p className="eyebrow">Brand story</p>
          <h2>Made for homes where furniture, light, and daily rituals belong together.</h2>
        </div>
        <p>Atelier Living Glass designs around material honesty: tactile upholstery, softened metal, quiet appliance shells, and visual depth. The result is a home-commerce experience that can justify premium pricing with detail, service, and trust.</p>
      </section>

      <FAQSection />
      <Newsletter />
    </>
  );
}

function ProductFilters({ filters, setFilters }) {
  return (
    <div className="filter-bar" aria-label="Product filters">
      <label>
        Search
        <input value={filters.search} placeholder="Sofa, kettle, HEPA..." onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
      </label>
      <label>
        Style
        <select value={filters.style} onChange={(event) => setFilters({ ...filters, style: event.target.value })}>
          <option>All Styles</option>
          {styles.map((style) => <option key={style}>{style}</option>)}
        </select>
      </label>
      <label>
        Max price
        <select value={filters.maxPrice} onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })}>
          <option value="8000">All prices</option>
          <option value="500">Under $500</option>
          <option value="1500">Under $1,500</option>
          <option value="3000">Under $3,000</option>
        </select>
      </label>
      <label>
        Sort
        <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
          <option value="newest">Newest</option>
          <option value="price-low">Price low to high</option>
          <option value="price-high">Price high to low</option>
        </select>
      </label>
      <label className="check-label">
        <input type="checkbox" checked={filters.stock} onChange={(event) => setFilters({ ...filters, stock: event.target.checked })} />
        In stock only
      </label>
    </div>
  );
}

function ProductCard({ product, wished, onWishlist, onCart, navigate }) {
  return (
    <article className="product-card">
      <button className="wishlist-button" type="button" onClick={() => onWishlist(product.id)}>{wished ? "Saved" : "Save"}</button>
      <button className="product-image-button" type="button" onClick={() => navigate(`/products/${product.id}`)}>
        <img src={imageUrl(product.image)} alt={product.name} loading="lazy" />
      </button>
      <div className="product-info">
        <button type="button" onClick={() => navigate(`/products/${product.id}`)}>
          <p>{product.category} / {product.style}</p>
          <h3>{product.name}</h3>
          <span>{formatPrice(product.price)}</span>
          <small>{product.note} / {Number(product.stock || 0) > 0 ? "In stock" : "Made to order"}</small>
        </button>
        <div className="product-card-actions">
          <button className="cart-action" type="button" onClick={() => onCart(product.id)}>Add to Cart</button>
          <button className="detail-action" type="button" onClick={() => navigate(`/products/${product.id}`)}>Details</button>
        </div>
      </div>
    </article>
  );
}

function ProductDetailPage({ product, wishlist, onWishlist, onCart, navigate }) {
  const [selection, setSelection] = useState(defaultSelection(product));
  const [mainImage, setMainImage] = useState(product.images[0]);
  const price = selectionPrice(product, selection);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.material,
    offers: { "@type": "Offer", priceCurrency: "USD", price, availability: "https://schema.org/InStock" },
  };
  return (
    <section className="route-shell product-detail-page">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <button className="section-link" type="button" onClick={() => navigate("/")}>Back to store</button>
      <div className="product-detail-grid">
        <div className="gallery-panel">
          <img className="gallery-main" src={mainImage} alt={product.name} />
          <div className="gallery-thumbs">
            {product.images.map((image) => (
              <button key={image} type="button" onClick={() => setMainImage(image)}>
                <img src={image} alt={`${product.name} preview`} loading="lazy" />
              </button>
            ))}
          </div>
          <div className="rotation-preview">360 preview ready / video slot for hero product</div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category} / {product.style}</p>
          <h1>{product.name}</h1>
          <p>{product.material}</p>
          <strong className="detail-price">{formatPrice(price)}</strong>
          <VariantSelector product={product} selection={selection} setSelection={setSelection} />
          <div className="detail-actions">
            <button className="primary-action" type="button" onClick={() => onCart(product.id, selection)}>Add selected item</button>
            <button className="secondary-action" type="button" onClick={() => onWishlist(product.id)}>{wishlist.includes(product.id) ? "Saved to wishlist" : "Add to wishlist"}</button>
          </div>
          <div className="security-row">
            <span>SSL secure encrypted payment</span>
            <span>Visa / Mastercard / Stripe</span>
            <span>Insured delivery</span>
          </div>
        </div>
      </div>
      <ProductFacts product={product} />
      <Reviews product={product} />
      <FAQSection compact />
    </section>
  );
}

function VariantSelector({ product, selection, setSelection }) {
  return (
    <div className="variant-panel">
      {Object.entries(product.variants).map(([key, values]) => (
        <fieldset key={key}>
          <legend>{key}</legend>
          <div className="variant-grid">
            {values.map((value) => (
              <button
                key={value}
                type="button"
                className={selection[key] === value ? "variant-pill active" : "variant-pill"}
                onClick={() => setSelection({ ...selection, [key]: value })}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function ProductFacts({ product }) {
  return (
    <div className="product-facts">
      <article>
        <h2>Core information</h2>
        <dl className="spec-grid">
          <div><dt>Dimensions</dt><dd>{product.dimensions}</dd></div>
          <div><dt>Weight</dt><dd>{product.weight}</dd></div>
          <div><dt>Warranty</dt><dd>{product.warranty}</dd></div>
          <div><dt>Returns</dt><dd>{product.returns}</dd></div>
        </dl>
      </article>
      <article>
        <h2>Materials and parameters</h2>
        <ul>{product.specs.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
      <article>
        <h2>Delivery and package</h2>
        <p>{product.delivery}</p>
        <p>{product.installation}</p>
        <ul>{product.package.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
    </div>
  );
}

function Reviews({ product }) {
  return (
    <section className="reviews-section">
      <div>
        <p className="eyebrow">Customer reviews</p>
        <h2>4.8 average rating</h2>
      </div>
      <div className="reviews-grid">
        <article>
          <img src={product.images[1] || product.images[0]} alt="Buyer room photo" loading="lazy" />
          <p>"{product.review}"</p>
          <strong>Verified buyer</strong>
        </article>
        <article>
          <img src={product.images[2] || product.images[0]} alt="Buyer detail photo" loading="lazy" />
          <p>"Delivery was careful, and the finish matched the website photos."</p>
          <strong>Trade client</strong>
        </article>
      </div>
    </section>
  );
}

function LookPage({ look, products, onCart, onLookCart, navigate }) {
  const lookProducts = look.products.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  return (
    <section className="route-shell look-page">
      <div className="look-hero">
        <img src={look.image} alt={look.title} />
        <div>
          <p className="eyebrow">Shop the Look</p>
          <h1>{look.title}</h1>
          <p>{look.copy}</p>
          <button className="primary-action" type="button" onClick={() => onLookCart(look.slug)}>Add full look to cart</button>
        </div>
      </div>
      <div className="product-grid">
        {lookProducts.map((product) => (
          <ProductCard key={product.id} product={product} wished={false} onWishlist={() => {}} onCart={onCart} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function CheckoutPage({ customer, cartItems, subtotal, shipping, total, onQuantity, onRemove, onOrder, navigate, guestOrder }) {
  const [provider, setProvider] = useState("stripe");
  const [profile, setProfile] = useState({
    name: customer?.name || "Guest Client",
    email: customer?.email || "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await onOrder(provider, profile);
    } catch (err) {
      setError(err.message);
    }
  }
  if (guestOrder) {
    return (
      <section className="route-shell auth-required">
        <p className="eyebrow">Guest checkout</p>
        <h1>Your guest order is created.</h1>
        <p className="route-copy">Order {guestOrder} has started payment. Create an account later to save order history.</p>
        <button className="primary-action" type="button" onClick={() => navigate("/")}>Continue shopping</button>
      </section>
    );
  }
  return (
    <section className="route-shell checkout-page">
      <div>
        <p className="eyebrow">Three-step checkout</p>
        <h1>{customer ? "Secure customer checkout." : "Guest checkout without forced registration."}</h1>
        <p className="route-copy">Contact, delivery, payment. Keep the purchase path short and protected.</p>
      </div>
      <div className="checkout-steps">
        <span>1 Contact</span>
        <span>2 Delivery</span>
        <span>3 Payment</span>
      </div>
      <div className="checkout-grid">
        <div className="cart-list">
          {cartItems.length ? cartItems.map((item) => (
            <article className="cart-row" key={item.key}>
              <img src={imageUrl(item.image)} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>{Object.values(item.selection || {}).join(" / ")}</p>
                <p>{formatPrice(item.price)}</p>
                <div className="stock-control">
                  <button type="button" onClick={() => onQuantity(item.key, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onQuantity(item.key, 1)}>+</button>
                  <button type="button" onClick={() => onRemove(item.key)}>Remove</button>
                </div>
              </div>
            </article>
          )) : <p className="route-copy">Your cart is empty.</p>}
        </div>
        <form className="payment-form" onSubmit={submit}>
          <label>
            Name
            <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required />
          </label>
          <label>
            Email
            <input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required />
          </label>
          <label>
            Delivery address
            <input value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} placeholder="Street, city, region" required />
          </label>
          <label>
            Payment method
            <select value={provider} onChange={(event) => setProvider(event.target.value)}>
              <option value="stripe">Stripe card checkout</option>
              <option value="bank">Bank transfer</option>
              <option value="wechat">WeChat Pay slot</option>
              <option value="alipay">Alipay slot</option>
            </select>
          </label>
          <div className="security-row">
            <span>SSL secure encrypted payment</span>
            <span>Stripe</span>
            <span>Visa</span>
            <span>Mastercard</span>
          </div>
          <div className="total-box">
            <span>Subtotal {formatPrice(subtotal)}</span>
            <span>Delivery {formatPrice(shipping)}</span>
            <strong>Total {formatPrice(total)}</strong>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" disabled={!cartItems.length}>Create order and pay</button>
          {!customer ? <button className="ghost-action" type="button" onClick={() => navigate("/account/register?next=/checkout")}>Create account instead</button> : null}
        </form>
      </div>
    </section>
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
        <p className="route-copy">You can checkout as a guest, or create an account for order history, warranty support, and faster repeat purchase.</p>
      </div>
      <form className="route-card" onSubmit={submit}>
        {mode === "register" ? (
          <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        ) : null}
        <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength="8" required /></label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit">{mode === "register" ? "Register and continue" : "Login and continue"}</button>
        <button className="ghost-action" type="button" onClick={() => navigate(mode === "register" ? "/account/login" : "/account/register")}>{mode === "register" ? "Already have an account" : "Create account"}</button>
        <button className="ghost-action" type="button" onClick={() => navigate("/checkout")}>Continue as guest</button>
      </form>
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
        <h1>Login to view saved orders.</h1>
        <p className="route-copy">Guest checkout stays lightweight; registered customers can view order history here.</p>
        <button className="primary-action" type="button" onClick={() => navigate("/account/login")}>Customer login</button>
      </section>
    );
  }
  return (
    <section className="route-shell">
      <div className="route-head">
        <div><p className="eyebrow">Customer account</p><h1>Your orders.</h1></div>
        <button className="secondary-action" type="button" onClick={onLogout}>Sign out</button>
      </div>
      <div className="inventory-panel order-panel">
        {orders.length ? orders.map((order) => (
          <article className="order-row" key={order.id}>
            <div><h3>{order.id}</h3><p>{order.status}</p></div>
            <strong>{formatPrice(order.total)}</strong>
          </article>
        )) : <p className="route-copy">No saved customer orders yet.</p>}
      </div>
    </section>
  );
}

function MerchantShell({ route, merchant, products, orders, onLogin, onLogout, onLoad, onSaveProduct, onUpdateProduct, navigate }) {
  useEffect(() => {
    if (merchant) onLoad().catch(() => {});
  }, [merchant]);

  if (!merchant) return <MerchantLoginPage onLogin={onLogin} />;

  return (
    <section className="merchant-app">
      <aside className="merchant-sidebar">
        <button className="brand brand-button" type="button" onClick={() => navigate("/merchant/dashboard")}>
          <span>ATELIER</span><small>MERCHANT</small>
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
        <p className="route-copy">This portal uses a merchant-only cookie and merchant-only API routes. Customer accounts cannot access it.</p>
      </div>
      <form className="route-card" onSubmit={submit}>
        <label>Merchant email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
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
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong></article>;
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
        <label>Product name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <div className="form-row">
          <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
          <label>Price<input type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label>
        </div>
        <div className="form-row">
          <label>Stock<input type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required /></label>
          <label>Image path<input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required /></label>
        </div>
        <label>Note<input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} required /></label>
        <label>Material story<textarea value={form.material} onChange={(event) => setForm({ ...form, material: event.target.value })} required /></label>
        <button type="submit">Publish product</button>
      </form>
      <div className="inventory-panel">
        <div className="inventory-head"><h3>Inventory</h3><span>{products.length} products</span></div>
        {products.map((product) => (
          <article className="inventory-row" key={product.id}>
            <img src={imageUrl(product.image)} alt={product.name} />
            <div><h4>{product.name}</h4><p>{product.category} / {formatPrice(product.price)}</p></div>
            <div className="stock-control">
              <button type="button" onClick={() => onUpdate(product.id, { stock: Math.max(0, product.stock - 1) })}>-</button>
              <span>{product.stock}</span>
              <button type="button" onClick={() => onUpdate(product.id, { stock: product.stock + 1 })}>+</button>
            </div>
            <button className="status-toggle" type="button" onClick={() => onUpdate(product.id, { status: product.status === "Live" ? "Hidden" : "Live" })}>{product.status}</button>
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
            <div><h3>{order.customer_name}</h3><p>{order.customer_email} / {order.status}</p></div>
            <strong>{formatPrice(order.total)}</strong>
          </article>
        )) : <p className="route-copy">No customer orders yet.</p>}
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Trust badges">
      <span>SSL encrypted checkout</span>
      <span>Stripe / Visa / Mastercard ready</span>
      <span>DHL, FedEx, white-glove partners</span>
      <span>Warranty and return support</span>
    </section>
  );
}

function FAQSection({ compact = false }) {
  return (
    <section id="faq" className={compact ? "faq-section compact" : "section faq-section"}>
      <div>
        <p className="eyebrow">FAQ</p>
        <h2>Questions that usually block purchase.</h2>
      </div>
      <div className="faq-grid">
        {faqs.map(([question, answer]) => (
          <article key={question}><h3>{question}</h3><p>{answer}</p></article>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="newsletter-section">
      <div>
        <p className="eyebrow">Retention</p>
        <h2>Save room ideas and receive new arrivals.</h2>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <input type="email" placeholder="Email address" aria-label="Email address" />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
}

function SiteFooter({ navigate }) {
  return (
    <footer className="site-footer">
      <div><strong>ATELIER LIVING GLASS</strong><p>Premium furniture and quiet small appliances for composed homes.</p></div>
      <nav>
        <button type="button" onClick={() => navigate("/#collection")}>Products</button>
        <button type="button" onClick={() => navigate("/#spaces")}>Space Inspiration</button>
        <button type="button" onClick={() => navigate("/#faq")}>FAQ</button>
        <button type="button" onClick={() => navigate("/merchant/login")}>Merchant Login</button>
      </nav>
      <nav>
        <span>Delivery policy</span>
        <span>Returns</span>
        <span>Privacy policy</span>
        <span>Terms</span>
        <span>Cookie policy</span>
      </nav>
      <nav>
        <span>Instagram</span>
        <span>Pinterest</span>
        <span>Xiaohongshu</span>
      </nav>
    </footer>
  );
}

function NotFound({ navigate }) {
  return (
    <section className="route-shell auth-required">
      <p className="eyebrow">Not found</p>
      <h1>This page is not available.</h1>
      <button className="primary-action" type="button" onClick={() => navigate("/")}>Back to store</button>
    </section>
  );
}
