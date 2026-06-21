import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="page-root">
        <Navbar />
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(201,168,106,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gold)', boxShadow: '0 0 20px rgba(201,168,106,0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '16px' }}>Order Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              Thank you for your purchase, {formData.firstName}. Your order has been received and is being processed. You will receive an email confirmation shortly at {formData.email}.
            </p>
            <button className="btn-gold" onClick={() => navigate('/home')} style={{ width: '100%' }}>Return to Home</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-root">
      <Navbar />
      
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#fff', marginBottom: '40px' }}>
          Secure <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Checkout</span>
        </h1>

        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Checkout Form */}
          <div style={{ flex: '1 1 500px' }}>
            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', marginBottom: '20px', color: 'var(--gold)' }}>Shipping Information</h3>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>First Name</label>
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>Last Name</label>
                  <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>Street Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>ZIP Code</label>
                  <input required type="text" name="zip" value={formData.zip} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', marginBottom: '20px', color: 'var(--gold)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>Payment Details</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>Card Number</label>
                <input required type="text" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>Expiry Date</label>
                  <input required type="text" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-muted)' }}>CVV</label>
                  <input required type="text" name="cvv" placeholder="123" value={formData.cvv} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="btn-gold" style={{ width: '100%', marginTop: '32px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                {isProcessing ? (
                  <>
                    <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'rotateBorder 1s linear infinite' }}></span>
                    Processing...
                  </>
                ) : (
                  <>Pay ${cartTotal.toFixed(2)}</>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Mini */}
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                <span>Taxes</span>
                <span>Calculated at next step</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '20px', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--gold)' }}>${cartTotal.toFixed(2)}</span>
              </div>
              
              <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Transactions are encrypted and secure.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '14px',
  outline: 'none',
  transition: 'all 0.3s ease'
};

export default Checkout;
