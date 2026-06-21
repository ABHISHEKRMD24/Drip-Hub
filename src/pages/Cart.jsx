import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="page-root">
      <Navbar />
      
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#fff', marginBottom: '40px' }}>
          Your <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Cart</span>
        </h1>

        {cart.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(201,168,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gold)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', marginBottom: '16px' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Looks like you haven't added anything to your cart yet.</p>
            <button className="btn-gold" onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Cart Items */}
            <div style={{ flex: '1 1 600px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                  <div style={{ flex: 2 }}>Product</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>Quantity</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>Total</div>
                </div>

                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ flex: 2, display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: '#fff' }}>
                          <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', marginBottom: '4px', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.target.style.color = 'var(--gold)'} onMouseOut={(e) => e.target.style.color = '#fff'}>{item.name}</h4>
                        </Link>
                        <div style={{ color: 'var(--gold)', fontSize: '14px', marginBottom: '8px' }}>${item.price.toFixed(2)}</div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ 
                            background: 'rgba(255,100,100,0.1)', 
                            border: '1px solid rgba(255,100,100,0.3)', 
                            color: 'rgba(255,100,100,0.9)', 
                            fontSize: '11px', 
                            cursor: 'pointer', 
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontFamily: "'Space Grotesk', sans-serif",
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(255,100,100,0.2)'}
                          onMouseOut={(e) => e.target.style.background = 'rgba(255,100,100,0.1)'}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}>−</button>
                        <span style={{ fontSize: '14px', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                    
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '20px', fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--gold)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                
                <button className="btn-gold" style={{ width: '100%', marginTop: '32px', padding: '16px' }} onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
