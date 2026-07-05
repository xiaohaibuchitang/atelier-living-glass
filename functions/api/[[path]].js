const encoder = new TextEncoder();

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

const customerCookie = "atelier_customer_session";
const merchantCookie = "atelier_merchant_session";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {}),
    },
  });
}

function randomId(prefix) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${prefix}_${value}`;
}

function parseCookies(request) {
  const header = request.headers.get("cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function cookieName(role) {
  return role === "merchant" ? merchantCookie : customerCookie;
}

function setSessionCookie(role, token, request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${cookieName(role)}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`;
}

function clearSessionCookie(role) {
  return `${cookieName(role)}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function toBase64(buffer) {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value);
}

function fromBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function hashPassword(password, saltBytes) {
  const salt = saltBytes || crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const iterations = 100000;
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256,
  );
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(bits)}`;
}

async function verifyPassword(password, storedHash) {
  const [scheme, iterationsText, saltText, hashText] = String(storedHash || "").split("$");
  if (scheme !== "pbkdf2" || !iterationsText || !saltText || !hashText) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromBase64(saltText), iterations: Number(iterationsText) },
    key,
    256,
  );
  return toBase64(bits) === hashText;
}

async function createSession(env, user, request) {
  const token = randomId("sess");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(
    "INSERT INTO sessions (token, user_id, role, expires_at) VALUES (?, ?, ?, ?)",
  ).bind(token, user.id, user.role, expiresAt).run();
  return {
    token,
    cookie: setSessionCookie(user.role, token, request),
  };
}

async function requireSession(env, request, role) {
  const token = parseCookies(request)[cookieName(role)];
  if (!token) return null;
  const session = await env.DB.prepare(
    `SELECT sessions.token, sessions.role, sessions.expires_at, users.id, users.email, users.name
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token = ? AND sessions.role = ? AND users.role = ?`,
  ).bind(token, role, role).first();
  if (!session || new Date(session.expires_at).getTime() < Date.now()) return null;
  return session;
}

function publicProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    note: product.note,
    image: product.image,
    material: product.material,
    stock: product.stock,
    status: product.status,
  };
}

async function handlePublicProducts(env, segments) {
  if (segments.length === 1) {
    const result = await env.DB.prepare(
      "SELECT * FROM products WHERE status = 'Live' ORDER BY created_at DESC, name ASC",
    ).all();
    return json({ products: result.results.map(publicProduct) });
  }
  const product = await env.DB.prepare(
    "SELECT * FROM products WHERE id = ? AND status = 'Live'",
  ).bind(segments[1]).first();
  if (!product) return json({ error: "Product not found" }, { status: 404 });
  return json({ product: publicProduct(product) });
}

async function handleCustomerAuth(env, request, segments) {
  const action = segments[1];
  if (request.method === "POST" && action === "register") {
    const body = await readJson(request);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const name = String(body.name || "Private Client").trim();
    if (!email || password.length < 8) {
      return json({ error: "Email and an 8 character password are required." }, { status: 400 });
    }
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (existing) return json({ error: "This email is already registered." }, { status: 409 });
    const user = {
      id: randomId("user"),
      role: "customer",
      email,
      name,
      password_hash: await hashPassword(password),
    };
    await env.DB.prepare(
      "INSERT INTO users (id, role, email, name, password_hash) VALUES (?, ?, ?, ?, ?)",
    ).bind(user.id, user.role, user.email, user.name, user.password_hash).run();
    const session = await createSession(env, user, request);
    return json({ user: { id: user.id, role: user.role, email: user.email, name: user.name } }, {
      headers: { "set-cookie": session.cookie },
    });
  }

  if (request.method === "POST" && action === "login") {
    return handleRoleLogin(env, request, "customer");
  }

  if (request.method === "POST" && action === "logout") {
    return handleLogout(env, request, "customer");
  }

  if (request.method === "GET" && action === "me") {
    const session = await requireSession(env, request, "customer");
    if (!session) return json({ user: null }, { status: 401 });
    return json({ user: { id: session.id, role: "customer", email: session.email, name: session.name } });
  }

  if (request.method === "GET" && action === "orders") {
    const session = await requireSession(env, request, "customer");
    if (!session) return json({ error: "Customer login required." }, { status: 401 });
    const result = await env.DB.prepare(
      "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC",
    ).bind(session.id).all();
    return json({ orders: result.results });
  }

  if (request.method === "POST" && action === "orders") {
    const session = await requireSession(env, request, "customer");
    if (!session) return json({ error: "Register or login before checkout." }, { status: 401 });
    const body = await readJson(request);
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return json({ error: "Cart is empty." }, { status: 400 });

    let subtotal = 0;
    const orderId = randomId("order");
    const checkedItems = [];
    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const product = await env.DB.prepare(
        "SELECT * FROM products WHERE id = ? AND status = 'Live'",
      ).bind(item.productId).first();
      if (!product) return json({ error: "A product in the cart is no longer available." }, { status: 400 });
      if (product.stock < quantity) return json({ error: `${product.name} does not have enough stock.` }, { status: 400 });
      subtotal += product.price * quantity;
      checkedItems.push({ product, quantity });
    }
    const shipping = subtotal > 0 ? 180 : 0;
    const total = subtotal + shipping;
    await env.DB.prepare(
      "INSERT INTO orders (id, customer_id, subtotal, shipping, total, status) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(orderId, session.id, subtotal, shipping, total, "pending_payment").run();
    for (const item of checkedItems) {
      const { product, quantity } = item;
      await env.DB.prepare(
        "INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, product_name, product_image) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).bind(randomId("item"), orderId, product.id, quantity, product.price, product.name, product.image).run();
      await env.DB.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").bind(quantity, product.id).run();
    }
    return json({ order: { id: orderId, subtotal, shipping, total, status: "pending_payment" } });
  }

  return json({ error: "Not found" }, { status: 404 });
}

async function handleRoleLogin(env, request, role) {
  const body = await readJson(request);
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE email = ? AND role = ?",
  ).bind(email, role).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  }
  const session = await createSession(env, user, request);
  return json({ user: { id: user.id, role: user.role, email: user.email, name: user.name } }, {
    headers: { "set-cookie": session.cookie },
  });
}

async function handleLogout(env, request, role) {
  const token = parseCookies(request)[cookieName(role)];
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  return json({ ok: true }, { headers: { "set-cookie": clearSessionCookie(role) } });
}

async function handleMerchant(env, request, segments) {
  const action = segments[1];
  if (request.method === "POST" && action === "login") {
    return handleRoleLogin(env, request, "merchant");
  }
  if (request.method === "POST" && action === "logout") {
    return handleLogout(env, request, "merchant");
  }
  if (request.method === "GET" && action === "me") {
    const session = await requireSession(env, request, "merchant");
    if (!session) return json({ user: null }, { status: 401 });
    return json({ user: { id: session.id, role: "merchant", email: session.email, name: session.name } });
  }

  const session = await requireSession(env, request, "merchant");
  if (!session) return json({ error: "Merchant login required." }, { status: 401 });

  if (action === "products") {
    if (request.method === "GET") {
      const result = await env.DB.prepare("SELECT * FROM products ORDER BY created_at DESC, name ASC").all();
      return json({ products: result.results.map(publicProduct) });
    }
    if (request.method === "POST") {
      const body = await readJson(request);
      const product = {
        id: randomId("prod"),
        name: String(body.name || "").trim(),
        category: String(body.category || "Appliances").trim(),
        price: Math.max(1, Number(body.price) || 1),
        note: String(body.note || "New arrival").trim(),
        image: String(body.image || "/assets/product-purifier.png").trim(),
        material: String(body.material || "Material details pending.").trim(),
        stock: Math.max(0, Number(body.stock) || 0),
        status: body.status === "Hidden" ? "Hidden" : "Live",
      };
      if (!product.name) return json({ error: "Product name is required." }, { status: 400 });
      await env.DB.prepare(
        "INSERT INTO products (id, name, category, price, note, image, material, stock, status, merchant_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).bind(product.id, product.name, product.category, product.price, product.note, product.image, product.material, product.stock, product.status, session.id).run();
      return json({ product });
    }
    if (request.method === "PUT" && segments[2]) {
      const body = await readJson(request);
      const current = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(segments[2]).first();
      if (!current) return json({ error: "Product not found" }, { status: 404 });
      const next = {
        name: body.name ?? current.name,
        category: body.category ?? current.category,
        price: body.price == null ? current.price : Number(body.price),
        note: body.note ?? current.note,
        image: body.image ?? current.image,
        material: body.material ?? current.material,
        stock: body.stock == null ? current.stock : Math.max(0, Number(body.stock)),
        status: body.status === "Hidden" ? "Hidden" : "Live",
      };
      await env.DB.prepare(
        "UPDATE products SET name = ?, category = ?, price = ?, note = ?, image = ?, material = ?, stock = ?, status = ? WHERE id = ?",
      ).bind(next.name, next.category, next.price, next.note, next.image, next.material, next.stock, next.status, segments[2]).run();
      return json({ product: { id: segments[2], ...next } });
    }
  }

  if (request.method === "GET" && action === "orders") {
    const orders = await env.DB.prepare(
      `SELECT orders.*, users.email AS customer_email, users.name AS customer_name
       FROM orders
       JOIN users ON users.id = orders.customer_id
       ORDER BY orders.created_at DESC`,
    ).all();
    return json({ orders: orders.results });
  }

  return json({ error: "Not found" }, { status: 404 });
}

async function handlePayments(env, request, segments) {
  if (request.method !== "POST" || segments[1] !== "checkout") {
    return json({ error: "Not found" }, { status: 404 });
  }
  const session = await requireSession(env, request, "customer");
  if (!session) return json({ error: "Customer login required." }, { status: 401 });
  const body = await readJson(request);
  const order = await env.DB.prepare(
    "SELECT * FROM orders WHERE id = ? AND customer_id = ?",
  ).bind(body.orderId, session.id).first();
  if (!order) return json({ error: "Order not found." }, { status: 404 });
  const paymentId = randomId("pay");
  const provider = String(body.provider || "stripe");
  let checkoutUrl = null;

  if (env.STRIPE_SECRET_KEY) {
    const successUrl = env.PAYMENT_SUCCESS_URL || `${new URL(request.url).origin}/account/orders`;
    const cancelUrl = env.PAYMENT_CANCEL_URL || `${new URL(request.url).origin}/checkout`;
    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", successUrl);
    params.append("cancel_url", cancelUrl);
    params.append("line_items[0][quantity]", "1");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][unit_amount]", String(order.total * 100));
    params.append("line_items[0][price_data][product_data][name]", `Atelier order ${order.id}`);
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const stripeData = await stripeResponse.json();
    if (!stripeResponse.ok) return json({ error: stripeData.error?.message || "Stripe checkout failed." }, { status: 502 });
    checkoutUrl = stripeData.url;
  }

  await env.DB.prepare(
    "INSERT INTO payments (id, order_id, provider, status, amount, checkout_url) VALUES (?, ?, ?, ?, ?, ?)",
  ).bind(paymentId, order.id, provider, checkoutUrl ? "checkout_created" : "test_checkout_created", order.total, checkoutUrl).run();
  await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind("payment_started", order.id).run();
  return json({
    payment: {
      id: paymentId,
      orderId: order.id,
      provider,
      status: checkoutUrl ? "checkout_created" : "test_checkout_created",
      checkoutUrl,
      simulated: !checkoutUrl,
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (!env.DB) return json({ error: "D1 database binding is missing." }, { status: 500 });
  const url = new URL(request.url);
  const segments = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);

  if (segments[0] === "products" && request.method === "GET") {
    return handlePublicProducts(env, segments);
  }
  if (segments[0] === "customer") {
    return handleCustomerAuth(env, request, segments);
  }
  if (segments[0] === "merchant") {
    return handleMerchant(env, request, segments);
  }
  if (segments[0] === "payments") {
    return handlePayments(env, request, segments);
  }
  return json({ error: "Not found" }, { status: 404 });
}
