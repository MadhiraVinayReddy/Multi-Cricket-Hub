// ── CART STORAGE ──
const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('crickethub_cart') || '[]'); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('crickethub_cart', JSON.stringify(items));
    Cart.updateBadge();
  },
  add(product) {
    const items = Cart.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    Cart.save(items);
    Cart.toast(`${product.name} added to cart!`);
  },
  remove(id) {
    const items = Cart.get().filter(i => i.id !== id);
    Cart.save(items);
  },
  updateQty(id, qty) {
    const items = Cart.get();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = qty; if (qty <= 0) return Cart.remove(id); }
    Cart.save(items);
  },
  total() {
    return Cart.get().reduce((s, i) => s + i.price * i.qty, 0);
  },
  count() {
    return Cart.get().reduce((s, i) => s + i.qty, 0);
  },
  updateBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = Cart.count();
    });
  },
  toast(msg) {
    const t = document.createElement('div');
    t.className = 'cart-toast';
    t.textContent = '🛒 ' + msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2400);
  }
};

// ── ACTIVE NAV ──
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  setActiveNav();
});

// ── Toast CSS (injected) ──
const toastStyle = document.createElement('style');
toastStyle.textContent = `
.cart-toast {
  position: fixed; bottom: 30px; right: 30px; z-index: 9999;
  background: #1a6b3c; color: #fff;
  padding: 14px 24px; border-radius: 50px;
  font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.95rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  opacity: 0; transform: translateY(20px);
  transition: opacity .35s, transform .35s;
  pointer-events: none;
}
.cart-toast.show { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(toastStyle);
