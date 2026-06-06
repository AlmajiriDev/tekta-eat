import { useState, useEffect, useRef } from 'react';

const NAVY = '#0F1B40';
const LIME = '#C8FF00';
const WHITE = '#FFFFFF';
const CARD = '#1A2B5E';
const CARD2 = '#243475';
const MUTED = '#8892B0';
const BG = '#0A1128';

const fmt = (n) => `₦${n.toLocaleString()}`;

const DELIVERY_AREAS = [
  'Victoria Island',
  'Lekki Phase 1',
  'Ikorodu - Awolowo Rd',
  'Ajah',
  'Surulere',
  'Ikeja GRA',
  'Yaba',
  'Ikoyi',
  'Maryland',
  'Isale Eko',
];

const TRACKING_STEPS = [
  {
    icon: '✅',
    label: 'Order Confirmed',
    detail: 'Your order has been confirmed and sent to the restaurant.',
  },
  {
    icon: '🍱',
    label: 'Preparing Your Food',
    detail: 'The kitchen is carefully preparing your meal fresh to order.',
  },
  {
    icon: '🏍️',
    label: 'Rider Assigned',
    detail: 'Chidi O. (⭐ 4.9 · 1,240 deliveries) has picked up your order.',
  },
  {
    icon: '🚀',
    label: 'Food Dispatched',
    detail: 'Your order has left the restaurant and is on its way.',
  },
  {
    icon: '🛵',
    label: 'Rider En Route',
    detail: 'Chidi is heading your way — estimated arrival in 8 minutes.',
  },
  { icon: '🎉', label: 'Delivered!', detail: 'Your food has arrived. Enjoy your meal! 😋' },
];

const CSS = `
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes pulse   { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.7; transform:scale(.95); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
  @keyframes popIn   { 0% { transform:scale(0); } 70% { transform:scale(1.2); } 100% { transform:scale(1); } }
  @keyframes bounce  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
  * { box-sizing: border-box; }
  input, textarea { outline: none; }
  button { font-family: inherit; }
`;

const S = {
  card: {
    background: CARD,
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
  },
  limeBtn: {
    background: LIME,
    border: 'none',
    borderRadius: 14,
    padding: '17px 0',
    width: '100%',
    color: NAVY,
    fontWeight: 900,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 4px 24px rgba(200,255,0,0.3)',
    letterSpacing: 0.2,
    transition: 'opacity 0.2s',
  },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.14)',
    borderRadius: 12,
    padding: '15px 16px',
    color: WHITE,
    fontSize: 15,
    width: '100%',
    fontFamily: 'inherit',
  },
  label: {
    color: MUTED,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    display: 'block',
    marginBottom: 8,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: LIME,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 14,
    padding: '0 0 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
};

// ─── Overlay / Address Modal ──────────────────────────────────────────────────

function AddressModal({ current, onSelect, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 200,
          backdropFilter: 'blur(3px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 580,
          background: '#111d3a',
          borderRadius: '24px 24px 0 0',
          zIndex: 201,
          padding: '24px 20px 44px',
        }}
      >
        <div
          style={{
            width: 44,
            height: 4,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
            margin: '0 auto 22px',
          }}
        />
        <h3 style={{ color: WHITE, margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>
          Delivery Address
        </h3>
        <p style={{ color: MUTED, fontSize: 13, margin: '0 0 20px' }}>
          Choose your delivery area in Lagos
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxHeight: '55vh',
            overflowY: 'auto',
          }}
        >
          {DELIVERY_AREAS.map((area) => {
            const active = area === current;
            return (
              <button
                key={area}
                onClick={() => {
                  onSelect(area);
                  onClose();
                }}
                style={{
                  background: active ? 'rgba(200,255,0,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${active ? LIME : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 14,
                  padding: '15px 18px',
                  color: active ? LIME : WHITE,
                  fontSize: 15,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: active ? 700 : 400,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>📍 {area}, Lagos</span>
                {active && (
                  <span
                    style={{
                      background: LIME,
                      color: NAVY,
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ cartCount, onCart, onHome }) {
  return (
    <header
      style={{
        background: NAVY,
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `2px solid ${LIME}`,
        boxShadow: '0 2px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div
        onClick={onHome}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <span style={{ fontSize: 28 }}>🍔</span>
        <span style={{ color: WHITE, fontWeight: 900, fontSize: 21, letterSpacing: -0.5 }}>
          TekTa<span style={{ color: LIME }}>-Eats</span>
        </span>
      </div>
      <button
        onClick={onCart}
        style={{
          background: cartCount > 0 ? LIME : 'transparent',
          border: `2px solid ${cartCount > 0 ? LIME : MUTED}`,
          borderRadius: 24,
          padding: '10px 22px',
          cursor: 'pointer',
          color: cartCount > 0 ? NAVY : WHITE,
          fontWeight: 700,
          fontSize: 15,
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        🛒 {cartCount > 0 ? cartCount : 'Cart'}
      </button>
    </header>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 24px' }}>
      <div
        style={{
          width: 52,
          height: 52,
          margin: '0 auto 20px',
          border: '4px solid rgba(200,255,0,0.15)',
          borderTopColor: LIME,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: MUTED, fontSize: 16 }}>Loading restaurants...</p>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
      <h2 style={{ color: WHITE, marginBottom: 10, fontSize: 22 }}>Can't reach the server</h2>
      <p style={{ color: MUTED, fontSize: 14, marginBottom: 28 }}>
        Make sure the backend is running on port 3001
      </p>
      <button onClick={onRetry} style={{ ...S.limeBtn, width: 'auto', padding: '14px 40px' }}>
        Retry
      </button>
    </div>
  );
}

function HomePage({ restaurants, loading, error, address, onSelect, onRetry, onChangeAddress }) {
  if (loading) return <Spinner />;
  if (error) return <ErrorState onRetry={onRetry} />;

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(160deg, #1a2b5e 0%, #0f1b40 100%)`,
          padding: '32px 24px 28px',
          borderBottom: `3px solid ${LIME}`,
        }}
      >
        <p
          style={{
            color: LIME,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            margin: '0 0 8px',
          }}
        >
          TEKTARIQ · FOOD DELIVERY
        </p>
        <h1
          style={{
            color: WHITE,
            fontSize: 32,
            fontWeight: 900,
            margin: '0 0 8px',
            lineHeight: 1.2,
          }}
        >
          Hungry? We've got you. 🚀
        </h1>
        <p style={{ color: MUTED, fontSize: 15, margin: '0 0 22px' }}>
          Order from top restaurants near you
        </p>

        {/* Clickable address */}
        <button
          onClick={onChangeAddress}
          style={{
            background: 'rgba(255,255,255,0.07)',
            borderRadius: 14,
            padding: '15px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            border: '1px solid rgba(255,255,255,0.13)',
            width: '100%',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
        >
          <span style={{ fontSize: 20 }}>📍</span>
          <span style={{ color: WHITE, fontSize: 15, flex: 1, textAlign: 'left' }}>
            {address}, Lagos
          </span>
          <span
            style={{
              color: NAVY,
              fontSize: 12,
              fontWeight: 800,
              background: LIME,
              padding: '5px 12px',
              borderRadius: 20,
            }}
          >
            Change ✏️
          </span>
        </button>
      </div>

      {/* Promo banner */}
      <div
        style={{
          margin: '20px 20px 0',
          background: 'linear-gradient(135deg, #1a3060, #243475)',
          borderRadius: 18,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          border: '1px solid rgba(200,255,0,0.2)',
        }}
      >
        <span style={{ fontSize: 36 }}>🎁</span>
        <div>
          <p style={{ color: LIME, margin: '0 0 3px', fontWeight: 700, fontSize: 15 }}>
            First Order Special
          </p>
          <p style={{ color: MUTED, margin: 0, fontSize: 13 }}>
            Free delivery on your first 3 orders this week
          </p>
        </div>
        <span style={{ color: LIME, fontSize: 22, marginLeft: 'auto' }}>→</span>
      </div>

      {/* Restaurant grid */}
      <div style={{ padding: '24px 20px 32px' }}>
        <h2 style={{ color: WHITE, fontSize: 20, fontWeight: 800, margin: '0 0 4px' }}>
          Restaurants near you
        </h2>
        <p style={{ color: MUTED, fontSize: 13, margin: '0 0 18px' }}>
          {restaurants.length} restaurants available in {address}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {restaurants.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelect(r)}
              style={{
                ...S.card,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${NAVY}, ${CARD2})`,
                  height: 120,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 56,
                  position: 'relative',
                }}
              >
                {r.image}
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: r.tagColor,
                    color: NAVY,
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 20,
                  }}
                >
                  {r.tag}
                </span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ color: WHITE, margin: '0 0 3px', fontWeight: 700, fontSize: 15 }}>
                  {r.name}
                </p>
                <p style={{ color: MUTED, fontSize: 12, margin: '0 0 10px' }}>{r.cuisine}</p>
                <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                  <span style={{ color: LIME }}>⭐ {r.rating}</span>
                  <span style={{ color: MUTED }}>🕐 {r.deliveryTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

function MenuPage({ restaurant, cart, onAdd, onBack, onGoCart }) {
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <button onClick={onBack} style={S.backBtn}>
        ← Back to restaurants
      </button>

      <div
        style={{
          ...S.card,
          padding: '20px',
          marginBottom: 24,
          display: 'flex',
          gap: 18,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${NAVY}, ${CARD2})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 38,
          }}
        >
          {restaurant.image}
        </div>
        <div>
          <h2 style={{ color: WHITE, margin: '0 0 4px', fontSize: 21, fontWeight: 800 }}>
            {restaurant.name}
          </h2>
          <p style={{ color: MUTED, margin: '0 0 10px', fontSize: 13 }}>{restaurant.cuisine}</p>
          <div style={{ display: 'flex', gap: 14, fontSize: 13 }}>
            <span style={{ color: LIME }}>⭐ {restaurant.rating}</span>
            <span style={{ color: MUTED }}>🕐 {restaurant.deliveryTime}</span>
            <span style={{ color: MUTED }}>🛵 {fmt(restaurant.deliveryFee)}</span>
          </div>
        </div>
      </div>

      <h3 style={{ color: WHITE, fontSize: 18, fontWeight: 800, margin: '0 0 16px' }}>Menu</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {restaurant.menu.map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <div
              key={item.id}
              style={{
                ...S.card,
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: inCart ? `1.5px solid ${LIME}` : '1px solid rgba(255,255,255,0.08)',
                transition: 'border 0.2s',
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 38 }}>{item.emoji}</span>
                <div>
                  <p style={{ color: WHITE, margin: '0 0 3px', fontWeight: 600, fontSize: 15 }}>
                    {item.name}
                  </p>
                  <p style={{ color: MUTED, margin: '0 0 6px', fontSize: 12 }}>{item.desc}</p>
                  <p style={{ color: LIME, fontWeight: 700, margin: 0, fontSize: 15 }}>
                    {fmt(item.price)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onAdd(item, restaurant)}
                style={{
                  background: inCart ? LIME : 'transparent',
                  border: `2px solid ${LIME}`,
                  borderRadius: 12,
                  padding: '10px 18px',
                  color: inCart ? NAVY : LIME,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {inCart ? `✓ ${inCart.qty}` : '+ Add'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div
          onClick={onGoCart}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: 520,
            background: LIME,
            borderRadius: 18,
            padding: '17px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(200,255,0,0.45)',
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                background: NAVY,
                color: LIME,
                width: 30,
                height: 30,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              {cartCount}
            </span>
            <span style={{ color: NAVY, fontWeight: 700, fontSize: 16 }}>View Cart</span>
          </div>
          <span style={{ color: NAVY, fontWeight: 900, fontSize: 17 }}>{fmt(cartTotal)} →</span>
        </div>
      )}
    </div>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

function CartPage({ cart, restaurant, onRemove, onProceed, onBack }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = restaurant?.deliveryFee || 0;
  const total = subtotal + delivery;

  if (!cart.length)
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ color: WHITE, marginBottom: 8, fontSize: 22 }}>Your cart is empty</h2>
        <p style={{ color: MUTED, marginBottom: 28, fontSize: 15 }}>Add something delicious!</p>
        <button onClick={onBack} style={{ ...S.limeBtn, width: 'auto', padding: '14px 40px' }}>
          Browse Restaurants
        </button>
      </div>
    );

  return (
    <div style={{ padding: '20px 20px 80px' }}>
      <button onClick={onBack} style={S.backBtn}>
        ← Continue shopping
      </button>
      <h2 style={{ color: WHITE, fontWeight: 900, margin: '0 0 20px', fontSize: 21 }}>
        Your Order
      </h2>

      <div style={{ ...S.card, padding: '6px 0', marginBottom: 18 }}>
        {cart.map((item, i) => (
          <div
            key={item.id}
            style={{
              padding: '15px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: i < cart.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
              <span style={{ fontSize: 30 }}>{item.emoji}</span>
              <div>
                <p style={{ color: WHITE, margin: '0 0 3px', fontWeight: 600, fontSize: 15 }}>
                  {item.name}
                </p>
                <p style={{ color: LIME, margin: 0, fontSize: 13, fontWeight: 600 }}>
                  {fmt(item.price)} × {item.qty} = {fmt(item.price * item.qty)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              style={{
                background: 'rgba(255,107,107,0.1)',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: 8,
                padding: '6px 14px',
                color: '#FF6B6B',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          ...S.card,
          padding: '20px',
          marginBottom: 22,
          border: '1.5px solid rgba(200,255,0,0.25)',
        }}
      >
        <h3 style={{ color: WHITE, margin: '0 0 16px', fontSize: 17, fontWeight: 700 }}>
          Order Summary
        </h3>
        {[
          { label: 'Subtotal', value: fmt(subtotal) },
          { label: `Delivery — ${restaurant?.name}`, value: fmt(delivery) },
          { label: 'Service fee', value: '₦0' },
        ].map((row) => (
          <div
            key={row.label}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}
          >
            <span style={{ color: MUTED, fontSize: 14 }}>{row.label}</span>
            <span style={{ color: WHITE, fontSize: 14 }}>{row.value}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 16,
            marginTop: 4,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: WHITE, fontWeight: 700, fontSize: 17 }}>Total</span>
          <span style={{ color: LIME, fontWeight: 900, fontSize: 22 }}>{fmt(total)}</span>
        </div>
      </div>

      <button onClick={onProceed} style={S.limeBtn}>
        Proceed to Payment →
      </button>
    </div>
  );
}

// ─── Payment ──────────────────────────────────────────────────────────────────

function PaymentPage({ total, cart, restaurant, onPay, onBack }) {
  const [step, setStep] = useState('form'); // form | processing | success
  const [name, setName] = useState('');
  const [card, setCard] = useState({
    number: '4084 0840 8408 4081',
    expiry: '05/31',
    cvv: '408',
    name: 'Demo User',
  });

  function handlePay() {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onPay(name), 1400);
    }, 2600);
  }

  if (step === 'success')
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 80, animation: 'popIn 0.5s ease', marginBottom: 20 }}>✅</div>
        <h2 style={{ color: LIME, fontSize: 28, fontWeight: 900, margin: '0 0 10px' }}>
          Payment Successful!
        </h2>
        <p style={{ color: MUTED, fontSize: 16 }}>Placing your order...</p>
      </div>
    );

  if (step === 'processing')
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 28px',
            border: '5px solid rgba(200,255,0,0.15)',
            borderTopColor: LIME,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <h2 style={{ color: WHITE, fontSize: 22, fontWeight: 700, margin: '0 0 10px' }}>
          Processing Payment...
        </h2>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 20 }}>
          Please do not close this page
        </p>
        <p style={{ color: LIME, fontWeight: 900, fontSize: 28, fontFamily: 'monospace' }}>
          {fmt(total)}
        </p>
      </div>
    );

  return (
    <div style={{ padding: '20px 20px 60px' }}>
      <button onClick={onBack} style={S.backBtn}>
        ← Back to cart
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 26,
        }}
      >
        <span style={{ fontSize: 18 }}>🔒</span>
        <span style={{ color: MUTED, fontSize: 13 }}>Secure Payment · 256-bit SSL Encrypted</span>
      </div>

      {/* Amount card */}
      <div
        style={{
          ...S.card,
          padding: '22px',
          marginBottom: 24,
          textAlign: 'center',
          border: '1.5px solid rgba(200,255,0,0.3)',
        }}
      >
        <p
          style={{
            color: MUTED,
            fontSize: 11,
            margin: '0 0 6px',
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          AMOUNT TO PAY
        </p>
        <p
          style={{
            color: LIME,
            fontSize: 40,
            fontWeight: 900,
            margin: '0 0 8px',
            fontFamily: 'monospace',
          }}
        >
          {fmt(total)}
        </p>
        <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
          {cart.length} item{cart.length > 1 ? 's' : ''} from {restaurant?.name}
        </p>
      </div>

      {/* Card form */}
      <div style={{ ...S.card, padding: '24px 22px', marginBottom: 22 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <h3 style={{ color: WHITE, margin: 0, fontSize: 17, fontWeight: 700 }}>Card Details</h3>
          <span style={{ fontSize: 26 }}>💳</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>YOUR NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={S.input}
            placeholder="Enter your name"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={S.label}>CARD NUMBER</label>
          <input
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            style={S.input}
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={S.label}>EXPIRY DATE</label>
            <input
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              style={S.input}
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label style={S.label}>CVV</label>
            <input
              value={card.cvv}
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              style={S.input}
              placeholder="123"
              type="password"
            />
          </div>
        </div>

        <div>
          <label style={S.label}>CARDHOLDER NAME</label>
          <input
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            style={S.input}
            placeholder="Name on card"
          />
        </div>
      </div>

      <button onClick={handlePay} style={S.limeBtn}>
        Pay {fmt(total)} →
      </button>
      <p style={{ color: MUTED, fontSize: 12, textAlign: 'center', marginTop: 14 }}>
        🔒 Secured by TekTa Pay · Demo Mode
      </p>
    </div>
  );
}

// ─── Order Tracking ───────────────────────────────────────────────────────────

function TrackingPage({ order, onFeedback }) {
  const [step, setStep] = useState(0);
  const [times, setTimes] = useState(() => [
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  ]);

  useEffect(() => {
    if (step >= TRACKING_STEPS.length - 1) return;
    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setTimes((prev) => [
        ...prev,
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ]);
    }, 3000);
    return () => clearTimeout(t);
  }, [step]);

  const done = step >= TRACKING_STEPS.length - 1;
  const progress = Math.round((step / (TRACKING_STEPS.length - 1)) * 100);

  return (
    <div style={{ padding: '24px 20px 60px' }}>
      {/* Order ID */}
      <div
        style={{
          ...S.card,
          padding: '22px',
          marginBottom: 24,
          border: '1.5px solid rgba(200,255,0,0.3)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: MUTED,
            fontSize: 11,
            margin: '0 0 4px',
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          ORDER TRACKING
        </p>
        <p
          style={{
            color: LIME,
            fontWeight: 900,
            fontSize: 24,
            margin: '0 0 4px',
            fontFamily: 'monospace',
          }}
        >
          #{order.id}
        </p>
        <p style={{ color: MUTED, fontSize: 13, margin: '0 0 16px' }}>
          {order.restaurant.name} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </p>
        {/* Progress bar */}
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 10,
            height: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: LIME,
              borderRadius: 10,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <p
          style={{
            color: done ? LIME : MUTED,
            fontSize: 13,
            margin: '8px 0 0',
            fontWeight: done ? 700 : 400,
          }}
        >
          {done ? '✅ Delivered!' : `${progress}% complete`}
        </p>
      </div>

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <div
          style={{
            background: done ? 'rgba(200,255,0,0.15)' : 'rgba(200,255,0,0.12)',
            borderRadius: 20,
            padding: '8px 18px',
            border: `1px solid ${done ? LIME : 'rgba(200,255,0,0.3)'}`,
            animation: done ? 'none' : 'pulse 2s ease-in-out infinite',
          }}
        >
          <span style={{ color: LIME, fontWeight: 700, fontSize: 14 }}>
            {done ? '✅ Order Delivered' : '🔴 Live Tracking'}
          </span>
        </div>
        {!done && <span style={{ color: MUTED, fontSize: 12 }}>auto-updating for demo</span>}
      </div>

      {/* Mock map strip */}
      <div
        style={{
          ...S.card,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🏪</div>
          <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>{order.restaurant.name}</p>
        </div>
        <div
          style={{
            flex: 1,
            height: 3,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: LIME,
              borderRadius: 4,
              transition: 'width 0.6s ease',
            }}
          />
          {!done && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progress}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: 22,
                transition: 'left 0.6s ease',
                filter: 'drop-shadow(0 0 6px rgba(200,255,0,0.6))',
              }}
            >
              🛵
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>{done ? '✅' : '📍'}</div>
          <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>Your door</p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        {TRACKING_STEPS.map((ts, i) => {
          const isActive = i === step;
          const isDone = i < step;
          const isPending = i > step;
          return (
            <div
              key={ts.label}
              style={{
                display: 'flex',
                gap: 18,
                opacity: isPending ? 0.3 : 1,
                animation: isActive ? 'slideIn 0.4s ease' : 'none',
              }}
            >
              {/* Circle + line */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: isDone
                      ? LIME
                      : isActive
                        ? 'rgba(200,255,0,0.18)'
                        : 'rgba(255,255,255,0.06)',
                    border: isActive ? `2px solid ${LIME}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isDone ? 18 : 22,
                    boxShadow: isActive ? '0 0 20px rgba(200,255,0,0.4)' : 'none',
                    animation: isActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
                    color: isDone ? NAVY : WHITE,
                    fontWeight: isDone ? 900 : 400,
                  }}
                >
                  {isDone ? '✓' : ts.icon}
                </div>
                {i < TRACKING_STEPS.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      minHeight: 28,
                      flex: 1,
                      background: isDone ? LIME : 'rgba(255,255,255,0.1)',
                      margin: '4px 0',
                      transition: 'background 0.5s',
                    }}
                  />
                )}
              </div>

              {/* Text */}
              <div style={{ paddingBottom: 24, flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 4,
                  }}
                >
                  <p
                    style={{
                      color: isDone || isActive ? WHITE : MUTED,
                      margin: 0,
                      fontWeight: isActive ? 800 : isDone ? 600 : 400,
                      fontSize: 16,
                    }}
                  >
                    {ts.label}
                  </p>
                  {times[i] && (
                    <span
                      style={{
                        color: LIME,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                      }}
                    >
                      {times[i]}
                    </span>
                  )}
                </div>
                {(isDone || isActive) && (
                  <p style={{ color: MUTED, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                    {ts.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {done && (
        <button onClick={onFeedback} style={{ ...S.limeBtn, marginTop: 16 }}>
          Rate Your Order ⭐
        </button>
      )}
    </div>
  );
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

function FeedbackPage({ order, onHome }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const LABELS = ['', 'Terrible 😞', 'Poor 😕', 'Okay 😐', 'Good 😊', 'Excellent! 🤩'];
  const COLORS = ['', '#FF6B6B', '#FF9F43', '#FFC048', '#A3D977', LIME];

  if (submitted)
    return (
      <div style={{ textAlign: 'center', padding: '90px 24px' }}>
        <div style={{ fontSize: 76, animation: 'bounce 0.8s ease 3', marginBottom: 22 }}>🙏</div>
        <h2 style={{ color: LIME, fontSize: 28, fontWeight: 900, margin: '0 0 12px' }}>
          Thank you!
        </h2>
        <p style={{ color: WHITE, fontSize: 16, margin: '0 0 6px' }}>
          Your feedback helps us improve.
        </p>
        <p style={{ color: MUTED, fontSize: 14, marginBottom: 44 }}>
          We hope you enjoyed your meal 😋
        </p>
        <button onClick={onHome} style={S.limeBtn}>
          Order Again
        </button>
      </div>
    );

  return (
    <div style={{ padding: '36px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>🍽️</div>
        <h2 style={{ color: WHITE, fontSize: 26, fontWeight: 900, margin: '0 0 6px' }}>
          How was your order?
        </h2>
        <p style={{ color: MUTED, fontSize: 15 }}>{order.restaurant.name}</p>
      </div>

      {/* Stars */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 46,
                padding: 0,
                lineHeight: 1,
                transform: (hover || rating) >= n ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.12s',
              }}
            >
              {(hover || rating) >= n ? '⭐' : '☆'}
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p
            style={{
              color: COLORS[rating],
              fontWeight: 800,
              fontSize: 20,
              margin: 0,
              transition: 'color 0.2s',
            }}
          >
            {LABELS[rating]}
          </p>
        )}
      </div>

      {rating > 0 && (
        <div style={{ marginBottom: 24 }}>
          <label style={S.label}>TELL US MORE (OPTIONAL)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you love? What could be better?"
            rows={4}
            style={{ ...S.input, resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>
      )}

      <button
        onClick={() => rating > 0 && setSubmitted(true)}
        style={{
          ...S.limeBtn,
          opacity: rating === 0 ? 0.4 : 1,
          cursor: rating === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {rating === 0 ? 'Select a rating to continue' : 'Submit Review →'}
      </button>

      <button
        onClick={onHome}
        style={{
          background: 'none',
          border: 'none',
          color: MUTED,
          cursor: 'pointer',
          fontSize: 14,
          display: 'block',
          margin: '18px auto 0',
          textDecoration: 'underline',
        }}
      >
        Skip for now
      </button>
    </div>
  );
}

// ─── Admin / Presenter Dashboard ─────────────────────────────────────────────

const STATUS_META = {
  received:   { label: 'Received',   color: '#00C8FF', next: 'preparing'  },
  preparing:  { label: 'Preparing',  color: '#FFC048', next: 'dispatched' },
  dispatched: { label: 'Dispatched', color: '#A855F7', next: 'delivered'  },
  delivered:  { label: 'Delivered',  color: '#C8FF00', next: null         },
  canceled:   { label: 'Canceled',   color: '#FF5050', next: null         },
};

function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [newIds, setNewIds] = useState(new Set());
  const [riderInputs, setRiderInputs] = useState({});
  const seenIds = useRef(new Set());

  useEffect(() => {
    fetch('/api/restaurants')
      .then((r) => r.json())
      .then((data) => {
        const map = {};
        data.forEach((r) => { map[r.id] = r; });
        setRestaurants(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function poll() {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => {
          const fresh = data.filter((o) => !seenIds.current.has(o.id));
          if (fresh.length) {
            fresh.forEach((o) => seenIds.current.add(o.id));
            setNewIds((prev) => new Set([...prev, ...fresh.map((o) => o.id)]));
            setTimeout(() => {
              setNewIds((prev) => {
                const next = new Set(prev);
                fresh.forEach((o) => next.delete(o.id));
                return next;
              });
            }, 5000);
          }
          setOrders([...data].reverse());
          setRiderInputs((prev) => {
            const next = { ...prev };
            data.forEach((o) => { if (!(o.id in next)) next[o.id] = o.rider || ''; });
            return next;
          });
        })
        .catch(() => {});
    }
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, []);

  const timeAgo = (iso) => {
    const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    return `${Math.floor(secs / 3600)}h ago`;
  };

  async function handleStatusChange(orderId, newStatus) {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
  }

  async function handleRiderSave(orderId) {
    const rider = riderInputs[orderId] ?? '';
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rider }),
    }).catch(() => {});
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, rider } : o));
  }

  async function handleDelete(orderId) {
    if (!window.confirm('Delete this order?')) return;
    await fetch(`/api/orders/${orderId}`, { method: 'DELETE' }).catch(() => {});
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    seenIds.current.delete(orderId);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06091a' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{
        background: NAVY, padding: '0 28px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `2px solid ${LIME}`, boxShadow: '0 2px 24px rgba(0,0,0,0.6)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 26 }}>🍔</span>
          <span style={{ color: WHITE, fontWeight: 900, fontSize: 20 }}>
            TekTa<span style={{ color: LIME }}>-Eats</span>
          </span>
          <span style={{
            background: 'rgba(255,60,60,0.15)', border: '1px solid rgba(255,60,60,0.4)',
            borderRadius: 20, padding: '4px 14px', color: '#FF5050', fontSize: 12,
            fontWeight: 800, display: 'flex', alignItems: 'center', gap: 7,
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5050', display: 'inline-block' }} />
            LIVE ORDERS
          </span>
        </div>
        <div style={{ background: LIME, color: NAVY, borderRadius: 20, padding: '7px 18px', fontWeight: 900, fontSize: 15 }}>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 80px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '130px 24px' }}>
            <div style={{ fontSize: 72, marginBottom: 22, animation: 'bounce 1.5s ease-in-out infinite' }}>📡</div>
            <h2 style={{ color: WHITE, fontSize: 28, fontWeight: 900, margin: '0 0 14px' }}>Waiting for orders...</h2>
            <p style={{ color: MUTED, fontSize: 16 }}>Orders will appear here the moment your audience places them.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 22 }}>
            {orders.map((order) => {
              const isNew = newIds.has(order.id);
              const resto = restaurants[order.restaurantId];
              const meta = STATUS_META[order.status] || STATUS_META.received;
              const nextStatus = meta.next;
              const nextMeta = nextStatus ? STATUS_META[nextStatus] : null;
              const canCancel = order.status !== 'delivered' && order.status !== 'canceled';

              return (
                <div key={order.id} style={{
                  background: CARD, borderRadius: 20,
                  border: `2px solid ${isNew ? LIME : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isNew ? '0 0 36px rgba(200,255,0,0.3)' : '0 4px 24px rgba(0,0,0,0.4)',
                  padding: '20px', transition: 'border 0.6s, box-shadow 0.6s',
                  animation: 'slideIn 0.4s ease',
                  opacity: order.status === 'canceled' ? 0.6 : 1,
                }}>

                  {/* Order ID + status badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ color: LIME, fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>#{order.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isNew && (
                        <span style={{ background: LIME, color: NAVY, fontSize: 10, fontWeight: 900, padding: '3px 10px', borderRadius: 20 }}>
                          NEW ✨
                        </span>
                      )}
                      <span style={{
                        background: `${meta.color}22`, border: `1px solid ${meta.color}`,
                        color: meta.color, fontSize: 11, fontWeight: 800,
                        padding: '4px 12px', borderRadius: 20,
                      }}>
                        ● {meta.label.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Customer + restaurant + time */}
                  <p style={{ color: WHITE, fontWeight: 900, fontSize: 20, margin: '0 0 3px' }}>👤 {order.customerName}</p>
                  <p style={{ color: MUTED, fontSize: 13, margin: '0 0 3px' }}>
                    {resto ? `${resto.image} ${resto.name}` : `Restaurant #${order.restaurantId}`}
                  </p>
                  <p style={{ color: MUTED, fontSize: 12, margin: '0 0 14px' }}>{timeAgo(order.createdAt)}</p>

                  {/* Items */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginBottom: 12 }}>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: MUTED, fontSize: 13 }}>{item.emoji} {item.name} × {item.qty}</span>
                        <span style={{ color: WHITE, fontSize: 13 }}>{fmt(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rider input */}
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginBottom: 12,
                    display: 'flex', gap: 8, alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 16 }}>🛵</span>
                    <input
                      value={riderInputs[order.id] ?? order.rider ?? ''}
                      onChange={(e) => setRiderInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                      placeholder="Assign rider name..."
                      style={{ ...S.input, fontSize: 13, padding: '9px 12px', flex: 1 }}
                    />
                    <button
                      onClick={() => handleRiderSave(order.id)}
                      style={{
                        background: 'rgba(200,255,0,0.12)', border: `1px solid ${LIME}`,
                        borderRadius: 10, padding: '9px 14px', color: LIME,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                      }}
                    >
                      Save
                    </button>
                  </div>

                  {/* Total */}
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginBottom: 14,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ color: MUTED, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>TOTAL</span>
                    <span style={{ color: LIME, fontWeight: 900, fontSize: 20, fontFamily: 'monospace' }}>{fmt(order.total)}</span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {nextMeta && (
                      <button
                        onClick={() => handleStatusChange(order.id, nextStatus)}
                        style={{
                          flex: 1, background: `${nextMeta.color}18`,
                          border: `1.5px solid ${nextMeta.color}`, borderRadius: 12,
                          padding: '10px 12px', color: nextMeta.color,
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        → {nextMeta.label}
                      </button>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'canceled')}
                        style={{
                          background: 'rgba(255,80,80,0.1)', border: '1.5px solid rgba(255,80,80,0.4)',
                          borderRadius: 12, padding: '10px 12px', color: '#FF5050',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        ✕ Cancel
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(order.id)}
                      style={{
                        background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.15)',
                        borderRadius: 12, padding: '10px 14px', color: MUTED,
                        fontSize: 14, cursor: 'pointer',
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppMain() {
  const [page, setPage] = useState('home');
  const [selectedResto, setResto] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartResto, setCartResto] = useState(null);
  const [order, setOrder] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('Victoria Island');
  const [showAddressModal, setShowAddressModal] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0) + (cartResto?.deliveryFee || 0);

  function fetchRestaurants() {
    setLoading(true);
    setError(null);
    fetch('/api/restaurants')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchRestaurants();
  }, []);

  function addToCart(item, restaurant) {
    if (cartResto && cartResto.id !== restaurant.id) {
      if (
        !window.confirm(`Replace your ${cartResto.name} cart with items from ${restaurant.name}?`)
      )
        return;
      setCart([]);
    }
    setCartResto(restaurant);
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      if (ex) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  }

  async function handlePay(customerName) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const total = subtotal + (cartResto?.deliveryFee || 0);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || 'Guest',
          restaurantId: cartResto.id,
          items: cart,
          total,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrder({ id: data.id, items: cart, restaurant: cartResto });
      setCart([]);
      setCartResto(null);
      setPage('tracking');
    } catch {
      alert('Failed to place order. Please try again.');
    }
  }

  function goHome() {
    setPage('home');
    setResto(null);
  }

  const showHeader = ['home', 'menu', 'cart', 'payment'].includes(page);

  return (
    <div style={{ minHeight: '100vh', background: '#06091a' }}>
      <style>{CSS}</style>
      <div
        style={{
          maxWidth: 580,
          margin: '0 auto',
          background: BG,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {showHeader && (
          <Header cartCount={cartCount} onCart={() => setPage('cart')} onHome={goHome} />
        )}

        {page === 'home' && (
          <HomePage
            restaurants={restaurants}
            loading={loading}
            error={error}
            address={address}
            onSelect={(r) => {
              setResto(r);
              setPage('menu');
            }}
            onRetry={fetchRestaurants}
            onChangeAddress={() => setShowAddressModal(true)}
          />
        )}
        {page === 'menu' && selectedResto && (
          <MenuPage
            restaurant={selectedResto}
            cart={cart}
            onAdd={addToCart}
            onBack={goHome}
            onGoCart={() => setPage('cart')}
          />
        )}
        {page === 'cart' && (
          <CartPage
            cart={cart}
            restaurant={cartResto}
            onRemove={(id) => setCart((prev) => prev.filter((c) => c.id !== id))}
            onProceed={() => setPage('payment')}
            onBack={() => setPage(selectedResto ? 'menu' : 'home')}
          />
        )}
        {page === 'payment' && (
          <PaymentPage
            total={cartTotal}
            cart={cart}
            restaurant={cartResto}
            onPay={handlePay}
            onBack={() => setPage('cart')}
          />
        )}
        {page === 'tracking' && order && (
          <TrackingPage order={order} onFeedback={() => setPage('feedback')} />
        )}
        {page === 'feedback' && order && <FeedbackPage order={order} onHome={goHome} />}

        {showAddressModal && (
          <AddressModal
            current={address}
            onSelect={setAddress}
            onClose={() => setShowAddressModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  if (new URLSearchParams(window.location.search).has('admin')) return <AdminPage />;
  return <AppMain />;
}
