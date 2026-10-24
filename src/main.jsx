import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, CheckCircle2, Menu, X, ArrowRight, Heart } from "lucide-react";
import "./styles.css";

const products = [
  { id: "chosen-black", name: "Chosen, Loved, Redeemed", design: "Chosen, Loved, Redeemed", color: "Black", colorHex: "#171717", image: "/images/chosen-black.png", description: "A bold reminder of your identity in Christ." },
  { id: "chosen-blue", name: "Chosen, Loved, Redeemed", design: "Chosen, Loved, Redeemed", color: "Navy Blue", colorHex: "#142b4d", image: "/images/chosen-blue.png", description: "A bold reminder of your identity in Christ." },
  { id: "chosen-white", name: "Chosen, Loved, Redeemed", design: "Chosen, Loved, Redeemed", color: "White", colorHex: "#f4f4f1", image: "/images/chosen-white.png", description: "A bold reminder of your identity in Christ." },
  { id: "faith-black", name: "Walk by Faith", design: "Walk by Faith", color: "Black", colorHex: "#171717", image: "/images/walk-by-faith-black.png", description: "Wear a daily reminder to walk by faith, not by sight." },
  { id: "faith-blue", name: "Walk by Faith", design: "Walk by Faith", color: "Navy Blue", colorHex: "#142b4d", image: "/images/walk-by-faith-blue.png", description: "Wear a daily reminder to walk by faith, not by sight." },
  { id: "faith-white", name: "Walk by Faith", design: "Walk by Faith", color: "White", colorHex: "#f4f4f1", image: "/images/walk-by-faith-white.png", description: "Wear a daily reminder to walk by faith, not by sight." },
];
const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const money = n => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

function App() {
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [mobileMenu, setMobileMenu] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "", address: "", postcode: "", notes: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const filteredProducts = useMemo(() => products.filter(p => filter === "All" || p.design === filter), [filter]);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.qty * 25, 0);

  const addToCart = (product) => {
    const size = selectedSizes[product.id] || "M";
    const qty = Math.max(1, Number(quantities[product.id] || 1));
    const key = `${product.id}-${size}`;
    setCart(current => {
      const found = current.find(item => item.key === key);
      return found
        ? current.map(item => item.key === key ? { ...item, qty: item.qty + qty } : item)
        : [...current, { key, productId: product.id, name: product.name, color: product.color, colorHex: product.colorHex, size, image: product.image, qty }];
    });
  };
  const updateQty = (key, delta) => setCart(current => current.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const removeItem = key => setCart(current => current.filter(i => i.key !== key));
  const go = next => { setPage(next); setMobileMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const placeOrder = (e) => {
    e.preventDefault();
    const ref = `EMI-${Date.now().toString().slice(-6)}`;
    setOrderRef(ref);
    setOrderPlaced(true);
    setPage("confirmation");
  };

  return <div className="app">
    <div className="announcement">FAITH YOU CAN WEAR <span>•</span> INSPIRE. WORSHIP. IMPACT.</div>
    <header className="header">
      <button className="icon-button menu-button" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
      <button className="brand" onClick={() => go("shop")} aria-label="Expression Music home">
        <img src="/images/expression-music-logo.png" alt="The Expression Music International" />
      </button>
      <nav className={mobileMenu ? "nav open" : "nav"}>
        <button className={page === "shop" ? "nav-link active" : "nav-link"} onClick={() => go("shop")}>Shop</button>
        <button className={page === "about" ? "nav-link active" : "nav-link"} onClick={() => go("about")}>Our Story</button>
        <button className={page === "shipping" ? "nav-link active" : "nav-link"} onClick={() => go("shipping")}>Ordering Info</button>
      </nav>
      <button className="cart-button" onClick={() => go("cart")} aria-label={`Shopping bag, ${cartCount} items`}>
        <ShoppingBag size={20} /><span className="cart-label">Bag</span><span className="cart-count">{cartCount}</span>
      </button>
    </header>

    {page === "shop" && <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">EXPRESSION MUSIC MERCH</p>
          <h1>Wear your faith.<br/><em>Share your light.</em></h1>
          <p className="hero-text">Faith-inspired pieces made to encourage you and spark meaningful conversations wherever you go.</p>
          <button className="primary-button" onClick={() => document.getElementById("collection").scrollIntoView({ behavior: "smooth" })}>Shop the collection <ArrowRight size={17}/></button>
          <div className="hero-note"><Heart size={15}/> Created with purpose. Worn with faith.</div>
        </div>
        <div className="hero-image"><img src="/images/chosen-black.png" alt="Black Chosen, Loved, Redeemed sweatshirt" /></div>
      </section>
      <section className="collection section" id="collection">
        <div className="section-heading">
          <div><p className="eyebrow">THE COLLECTION</p><h2>Made to make a statement.</h2></div>
          <p className="muted heading-side">One price. Your favourite colour.<br/>A message worth sharing.</p>
        </div>
        <div className="filters" aria-label="Filter products">
          {["All", "Chosen, Loved, Redeemed", "Walk by Faith"].map(f => <button key={f} className={filter === f ? "filter active" : "filter"} onClick={() => setFilter(f)}>{f === "Chosen, Loved, Redeemed" ? "Chosen, Loved, Redeemed" : f}</button>)}
        </div>
        <div className="product-grid">
          {filteredProducts.map(product => <article className="product-card" key={product.id}>
            <div className="product-image-wrap"><img className="product-image" src={product.image} alt={`${product.color} ${product.name} sweatshirt`} loading="lazy"/><span className="product-tag">£25</span></div>
            <div className="product-info">
              <div className="product-title-row"><h3>{product.name}</h3><strong>£25.00</strong></div>
              <p className="muted product-subtitle">Crewneck sweatshirt · {product.color}</p>
              <p className="product-description">{product.description}</p>
              <div className="option-label"><span>Colour</span><span>{product.color}</span></div>
              <div className="swatches" aria-label={`Colour: ${product.color}`}><span className="swatch selected" style={{ background: product.colorHex, border: product.color === "White" ? "1px solid #d4d4d4" : "1px solid #ddd" }} title={product.color}></span></div>
              <label className="size-label" htmlFor={`size-${product.id}`}>Choose size</label>
              <select id={`size-${product.id}`} value={selectedSizes[product.id] || "M"} onChange={e => setSelectedSizes(s => ({ ...s, [product.id]: e.target.value }))}>
                {sizes.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
              <div className="add-row"><div className="qty-control"><button aria-label="Decrease quantity" onClick={() => setQuantities(q => ({ ...q, [product.id]: Math.max(1, Number(q[product.id] || 1) - 1) }))}><Minus size={14}/></button><span>{quantities[product.id] || 1}</span><button aria-label="Increase quantity" onClick={() => setQuantities(q => ({ ...q, [product.id]: Number(q[product.id] || 1) + 1 }))}><Plus size={14}/></button></div><button className="add-button" onClick={() => addToCart(product)}>Add to bag <Plus size={16}/></button></div>
            </div>
          </article>)}
        </div>
      </section>
      <section className="message-strip"><p className="eyebrow">INSPIRE. WORSHIP. IMPACT.</p><h2>More than merchandise.<br/><em>A message you carry.</em></h2><button className="text-button" onClick={() => go("about")}>Meet Expression Music <ArrowRight size={16}/></button></section>
    </>}

    {page === "cart" && <main className="page section narrow">
      <button className="back-link" onClick={() => go("shop")}><ArrowLeft size={16}/> Continue shopping</button>
      <p className="eyebrow">YOUR SELECTION</p><h1 className="page-title">Your bag <span className="muted">({cartCount})</span></h1>
      {cart.length === 0 ? <div className="empty-state"><ShoppingBag size={34}/><h2>Your bag is waiting.</h2><p className="muted">Find a piece that speaks to you.</p><button className="primary-button" onClick={() => go("shop")}>Explore the collection <ArrowRight size={16}/></button></div> :
        <div className="cart-layout"><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.key}><img src={item.image} alt={item.name}/><div className="cart-item-info"><h3>{item.name}</h3><p className="muted">{item.color} · Size {item.size}</p><strong>£25.00</strong><div className="cart-qty"><button onClick={() => updateQty(item.key, -1)} aria-label="Decrease quantity"><Minus size={14}/></button><span>{item.qty}</span><button onClick={() => updateQty(item.key, 1)} aria-label="Increase quantity"><Plus size={14}/></button><button className="remove-button" onClick={() => removeItem(item.key)}><Trash2 size={15}/> Remove</button></div></div><strong>{money(item.qty * 25)}</strong></div>)}</div>
        <aside className="summary"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-line"><span>Delivery</span><span>Confirmed after order</span></div><div className="summary-line total"><span>Total</span><strong>{money(subtotal)}</strong></div><p className="small muted">Delivery charges, if applicable, will be confirmed before fulfilment.</p><button className="primary-button full" onClick={() => go("checkout")}>Continue to checkout <ArrowRight size={16}/></button><p className="secure-note">Payment by bank transfer</p></aside></div>}
    </main>}

    {page === "checkout" && <main className="page section narrow">
      <button className="back-link" onClick={() => go("cart")}><ArrowLeft size={16}/> Back to bag</button>
      <p className="eyebrow">ALMOST YOURS</p><h1 className="page-title">Checkout</h1>
      {cart.length === 0 ? <div className="empty-state"><h2>Your bag is empty.</h2><button className="primary-button" onClick={() => go("shop")}>Shop now</button></div> : <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Your details</h2><p className="muted">Enter your details so the team can contact you about your order.</p>
          <label>Full name<input required autoComplete="name" value={customer.name} onChange={e => setCustomer({...customer, name:e.target.value})} placeholder="Your full name"/></label>
          <label>Email address<input required type="email" autoComplete="email" value={customer.email} onChange={e => setCustomer({...customer, email:e.target.value})} placeholder="you@example.com"/></label>
          <label>Delivery address<textarea required autoComplete="street-address" value={customer.address} onChange={e => setCustomer({...customer, address:e.target.value})} placeholder="House number, street, town/city" rows="3"/></label>
          <label>Postcode<input required autoComplete="postal-code" value={customer.postcode} onChange={e => setCustomer({...customer, postcode:e.target.value})} placeholder="Postcode"/></label>
          <label>Order notes <span className="muted">(optional)</span><textarea value={customer.notes} onChange={e => setCustomer({...customer, notes:e.target.value})} placeholder="Any delivery or order notes" rows="2"/></label>
          <button className="primary-button full" type="submit">Review payment details <ArrowRight size={16}/></button>
          <p className="small muted">Submitting creates an order summary in this browser. It does not send your details to a server or process payment.</p>
        </form>
        <aside className="summary"><h2>Your order</h2>{cart.map(item => <div className="checkout-item" key={item.key}><img src={item.image} alt=""/><div><strong>{item.name}</strong><p className="muted">{item.color} · {item.size} × {item.qty}</p></div><span>{money(item.qty*25)}</span></div>)}<div className="summary-line total"><span>Total</span><strong>{money(subtotal)}</strong></div><div className="payment-note"><span className="payment-icon">£</span><div><strong>Bank transfer</strong><p className="muted small">Account details will be shown with your order reference after you continue.</p></div></div></aside>
      </div>}
    </main>}

    {page === "confirmation" && <main className="page section narrow confirmation">
      <div className="success-icon"><CheckCircle2 size={34}/></div><p className="eyebrow">ORDER SUMMARY</p><h1 className="page-title">Thank you, {customer.name.split(" ")[0]}.</h1><p className="confirm-intro">Your order summary is ready. Please use your reference as the bank transfer payment reference.</p>
      <div className="order-reference"><span>Order reference</span><strong>{orderRef}</strong><button onClick={() => navigator.clipboard?.writeText(orderRef)}>Copy reference</button></div>
      <div className="bank-card"><p className="eyebrow">BANK TRANSFER DETAILS</p><h2>Pay The Expression Music International</h2><p className="muted">Please transfer the total below and use your order reference as the payment reference.</p>
        <div className="bank-row"><span>Business name</span><strong>THE EXPRESSION MUSIC INTERNATIONAL</strong></div>
        <div className="bank-row"><span>Sort code</span><strong>08-71-99</strong><button onClick={() => navigator.clipboard?.writeText("08-71-99")}>Copy</button></div>
        <div className="bank-row"><span>Account number</span><strong>15206046</strong><button onClick={() => navigator.clipboard?.writeText("15206046")}>Copy</button></div>
        <div className="bank-total"><span>Amount to transfer</span><strong>{money(subtotal)}</strong></div>
        <div className="payment-warning">Please double-check the account details before making a transfer. Your order is not confirmed as paid until the payment is received and matched by the team.</div>
      </div>
      <div className="order-review"><h2>Items in your order</h2>{cart.map(item => <div className="summary-line" key={item.key}><span>{item.name} · {item.color}, {item.size} × {item.qty}</span><strong>{money(item.qty*25)}</strong></div>)}<div className="summary-line total"><span>Total</span><strong>{money(subtotal)}</strong></div></div>
      <div className="confirm-actions"><button className="primary-button" onClick={() => window.print()}>Print order summary</button><button className="secondary-button" onClick={() => {setCart([]); setOrderPlaced(false); go("shop");}}>Return to shop</button></div>
      <p className="small muted">This demo storefront stores no order on a server and does not email your order automatically. Please keep this summary for your records and contact the team through your usual channel if you need to confirm receipt.</p>
    </main>}

    {page === "about" && <main className="page section narrow informational"><p className="eyebrow">OUR HEART</p><h1 className="page-title">Expression beyond the music.</h1><p className="lead">The Expression Music International exists to inspire, worship and impact lives through the message of Jesus Christ.</p><div className="about-logo"><img src="/images/expression-music-logo.png" alt="The Expression Music International logo"/></div><h2>Inspire. Worship. Impact.</h2><p className="muted">Our faith-inspired merchandise carries the message beyond the stage and into everyday life. Each design is a conversation starter and a reminder of the hope we have in Christ.</p><button className="primary-button" onClick={() => go("shop")}>Shop the collection <ArrowRight size={16}/></button></main>}

    {page === "shipping" && <main className="page section narrow informational"><p className="eyebrow">BEFORE YOU ORDER</p><h1 className="page-title">Ordering information</h1><div className="info-block"><h2>Pricing</h2><p>Every sweatshirt is priced at <strong>£25.00</strong>. Select your design, colour, size and quantity before adding it to your bag.</p></div><div className="info-block"><h2>Payment</h2><p>Payment is by bank transfer. The business account details and order reference are displayed at the end of checkout. Use your order reference as the payment reference.</p></div><div className="info-block"><h2>Delivery</h2><p>Delivery cost and estimated delivery timing should be confirmed with the team before fulfilment. They are not automatically calculated by this demo storefront.</p></div><div className="info-block"><h2>Sizes</h2><p>Available size options are S, M, L, XL, 2XL and 3XL. Please confirm fit and garment measurements with the team if you are unsure.</p></div><button className="primary-button" onClick={() => go("shop")}>Browse merchandise <ArrowRight size={16}/></button></main>}

    <footer className="footer"><div className="footer-main"><img src="/images/expression-music-logo.png" alt="The Expression Music International"/><p>Inspire. Worship. Impact.</p><button className="footer-shop" onClick={() => go("shop")}>Shop merchandise <ArrowRight size={15}/></button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} The Expression Music International</span><span>Faith-inspired merchandise</span></div></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
