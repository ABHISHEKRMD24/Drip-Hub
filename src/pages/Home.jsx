import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { categories } from '../mockData';
import { db } from '../firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'products'), limit(4));
        const querySnapshot = await getDocs(q);
        const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeaturedProducts(prods);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-root">
      <Navbar />
      
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '80px'
      }}>
        {/* Background Image & Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5) contrast(1.1)',
          zIndex: -2
        }}></div>
        
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, rgba(5,5,15,0.8) 0%, rgba(15,10,5,0.4) 50%, rgba(5,5,15,0.9) 100%)',
          zIndex: -1
        }}></div>

        <div className="container" style={{ textAlign: 'center', animation: 'fadeInUp 1s ease both' }}>
          <div style={{ display: 'inline-block', marginBottom: '20px' }}>
            <span style={{
              padding: '6px 16px',
              border: '1px solid rgba(201,168,106,0.3)',
              borderRadius: '20px',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--gold)',
              background: 'rgba(201,168,106,0.1)',
              backdropFilter: 'blur(5px)'
            }}>New Collection 2026</span>
          </div>
          
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '72px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: '24px',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            Elevate Your <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Style</span>
          </h1>
          
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}>
            Discover our curated collection of premium fashion and accessories. Designed for those who appreciate the finer things in life.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button className="btn-gold" onClick={() => navigate('/products')} style={{ padding: '16px 40px', fontSize: '16px' }}>
              Shop Now
            </button>
            <button className="btn-outline" onClick={() => navigate('/products?category=sunglasses')} style={{ padding: '16px 40px', fontSize: '16px' }}>
              Explore Sunglasses
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '100px 0', background: 'var(--dark-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '50px' }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#fff', marginBottom: '10px' }}>
                Shop by Category
              </h2>
              <div style={{ width: '60px', height: '2px', background: 'var(--gold)' }}></div>
            </div>
            <Link to="/products" className="text-gold font-space" style={{ textDecoration: 'none', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              View All Categories &rarr;
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
            {categories.filter(c => c.id !== 'all').map((cat, index) => (
              <div key={cat.id} onClick={() => navigate(`/products?category=${cat.id}`)} style={{
                height: '250px',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                group: 'category-card' // For hover effects
              }} className="category-card">
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  zIndex: 1
                }}></div>
                {/* Mock specific images based on category */}
                <img 
                  src={
                    cat.id === 'shirts' ? 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400' :
                    cat.id === 'pants' ? 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400' :
                    cat.id === 'shoes' ? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' :
                    cat.id === 'watches' ? 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400' :
                    cat.id === 'sunglasses' ? 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400' :
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400'
                  }
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  zIndex: 2,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '1px'
                }}>
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section style={{ padding: '60px 0', background: 'var(--dark-bg)' }}>
        <div className="container">
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px 60px',
            background: 'linear-gradient(135deg, rgba(201,168,106,0.15) 0%, rgba(201,168,106,0.05) 100%)',
            border: '1px solid rgba(201,168,106,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              right: '-10%',
              top: '-50%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(201,168,106,0.2) 0%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: 0
            }}></div>
            
            <div style={{ zIndex: 1, maxWidth: '50%' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '16px' }}>
                Exclusive Member Offer
              </h3>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '0' }}>
                Join the DripHub club today and get 20% off your first purchase. Plus, enjoy free shipping on all orders over $100.
              </p>
            </div>
            <div style={{ zIndex: 1 }}>
              <button className="btn-gold">Join Now</button>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: '80px 0 120px', background: 'var(--dark-bg)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: '#fff', marginBottom: '16px' }}>
                Featured Products
              </h2>
              <div style={{ width: '60px', height: '2px', background: 'var(--gold)', margin: '0 auto' }}></div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
              {featuredProducts.map(product => (
                <div key={product.id} className="glass-panel" style={{ padding: '16px', cursor: 'pointer', transition: 'transform 0.3s ease' }} 
                     onClick={() => navigate(`/product/${product.id}`)}
                     onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ borderRadius: '12px', overflow: 'hidden', height: '300px', marginBottom: '16px', background: 'rgba(0,0,0,0.2)' }}>
                    {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</div>
                    <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 600 }}>{product.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700 }}>${parseFloat(product.price).toFixed(2)}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>⭐ {product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;
