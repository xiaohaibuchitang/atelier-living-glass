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

const products = [
  {
    name: "Glasswell Modular Sofa",
    category: "Sofas",
    price: "$4,980",
    note: "4 configurations",
    image: asset("assets/product-sofa.png"),
    material: "Italian boucle, kiln-dried frame, low-profile stone plinth",
  },
  {
    name: "Milo Lounge Chair",
    category: "Seating",
    price: "$1,950",
    note: "3 finishes",
    image: asset("assets/product-chair.png"),
    material: "Olive wool blend, smoked steel swivel base",
  },
  {
    name: "Aurora Floor Lamp",
    category: "Lighting",
    price: "$1,280",
    note: "Dimmable warm LED",
    image: asset("assets/product-lamp.png"),
    material: "Translucent shade, graphite column, weighted stone base",
  },
  {
    name: "Lumiere Coffee Machine",
    category: "Appliances",
    price: "$699",
    note: "15 bar pressure",
    image: asset("assets/product-espresso.png"),
    material: "Brushed steel, quiet pump, compact counter footprint",
  },
  {
    name: "Purelite Air Purifier",
    category: "Appliances",
    price: "$449",
    note: "H13 HEPA filter",
    image: asset("assets/product-purifier.png"),
    material: "Graphite shell, low-noise circulation, washable pre-filter",
  },
  {
    name: "Vera Kettle",
    category: "Accessories",
    price: "$189",
    note: "Temperature control",
    image: asset("assets/product-kettle.png"),
    material: "Matte champagne finish, precision spout, insulated handle",
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

const serviceItems = [
  ["Complimentary Delivery", "White-glove delivery in selected regions."],
  ["Designed to Last", "Quality materials and timeless design, built to endure."],
  ["2-Year Warranty", "Peace of mind with comprehensive coverage on every product."],
  ["Easy Returns", "30-day returns on most furniture and accessories."],
];

export function App() {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saved, setSaved] = useState(() => new Set());

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Products") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

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
          <a href="#collection">Collections</a>
          <a href="#spaces">Spaces</a>
          <a href="#craft">Materials</a>
          <a href="#journal">Journal</a>
        </nav>
        <div className="utility">
          <button className="text-button" type="button">Search</button>
          <button className="text-button" type="button">Account</button>
          <button className="bag-button" type="button">
            Bag <span>{saved.size}</span>
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
            <p className="eyebrow">Furniture and small appliances</p>
            <h1>Design that lives beautifully.</h1>
            <p>
              A premium web template for home objects, blending real product
              photography, CGI glass layers, and tactile material storytelling.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#collection">Explore collection</a>
              <a className="secondary-action" href="#craft">View image methods</a>
            </div>
          </div>

          <aside className="glass-panel hero-panel" aria-label="Featured material story">
            <p className="panel-label">Material story</p>
            <h2>Premium Italian boucle fabric</h2>
            <p>
              Soft texture, enduring performance, and a restrained palette for
              furniture that stays calm in the room.
            </p>
            <button className="link-button" type="button" onClick={() => setSelectedProduct(products[0])}>
              View details
            </button>
            <div className="panel-divider" />
            <p className="panel-label">Designed to last</p>
            <p className="panel-statement">Modular. Adaptable. Endlessly comfortable.</p>
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
            <p className="eyebrow">Our collection</p>
            <h2>Thoughtful pieces for modern living.</h2>
          </div>
          <a href="#spaces" className="section-link">View spaces</a>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article key={product.name} className="product-card">
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
              <button className="product-info" type="button" onClick={() => setSelectedProduct(product)}>
                <p>{product.category}</p>
                <h3>{product.name}</h3>
                <span>{product.price}</span>
                <small>{product.note}</small>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="craft" className="craft-section">
        <div className="craft-intro">
          <p className="eyebrow">Design and craftsmanship</p>
          <h2>Where material meets mastery.</h2>
          <p>
            The template uses multiple production methods: lifestyle room scenes,
            isolated product imagery, material macro crops, transparent CGI, and
            virtual-real composites.
          </p>
          <a href="#journal" className="section-link dark">Discover process</a>
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

      <section id="journal" className="journal-section">
        <div>
          <p className="eyebrow">Template system</p>
          <h2>Built for products with a real material story.</h2>
        </div>
        <form className="newsletter" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="email">Request the launch kit</label>
          <div>
            <input id="email" type="email" placeholder="studio@example.com" />
            <button type="submit">Send</button>
          </div>
        </form>
      </section>

      <footer className="service-strip">
        {serviceItems.map(([title, copy]) => (
          <div key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </footer>

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
              <span>{selectedProduct.price}</span>
              <small>{selectedProduct.note}</small>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
