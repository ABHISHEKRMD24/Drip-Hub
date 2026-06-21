import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate('/products');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, navigate]);

  if (!product) return <div className="page-root" style={{ background: 'var(--dark-bg)' }}><Navbar /></div>;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="page-root">
      <Navbar />
      
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1 }}>
        <div style={{ display: 'flex', gap: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Product Image */}
          <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px' }}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', height: '500px' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div style={{ flex: '1 1 400px', animation: 'fadeInRight 0.8s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
                {product.category}
              </span>
              <div style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                ⭐ {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#fff', marginBottom: '24px', lineHeight: 1.1 }}>
              {product.name}
            </h1>
            
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginBottom: '32px' }}>
              ${product.price.toFixed(2)}
            </div>
            
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '40px' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', color: '#fff', padding: '12px 16px', cursor: 'pointer', fontSize: '18px' }}
                >−</button>
                <span style={{ padding: '0 16px', fontSize: '16px', fontWeight: 600 }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', color: '#fff', padding: '12px 16px', cursor: 'pointer', fontSize: '18px' }}
                >+</button>
              </div>
              
              <button 
                className="btn-gold" 
                onClick={handleAddToCart}
                style={{ flex: 1, padding: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
              >
                {added ? (
                  <>✓ Added to Cart</>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Features list */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201,168,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>Free Premium Shipping</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>On all orders over $100</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201,168,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>30-Day Returns</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No questions asked return policy</div>
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

export default ProductDetails;
