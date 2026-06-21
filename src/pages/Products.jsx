import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { categories } from '../mockData';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(prods);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      return matchesCategory;
    });
  }, [activeCategory, allProducts]);

  return (
    <div className="page-root">
      <Navbar />
      
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1, display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar */}
        <div style={{ flex: '0 0 280px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#fff', marginBottom: '10px', lineHeight: 1.1 }}>
              Our <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Collection</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '0.5px' }}>
              Showing {filteredProducts.length} premium items
            </p>
          </div>
          


          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', color: '#fff', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    navigate(`/products?category=${cat.id}`, { replace: true });
                  }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeCategory === cat.id ? 'rgba(201,168,106,0.1)' : 'transparent',
                    color: activeCategory === cat.id ? 'var(--gold)' : 'var(--text-muted)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '14px',
                    fontWeight: activeCategory === cat.id ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div style={{ flex: 1, width: '100%' }}>
          {filteredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {filteredProducts.map(product => (
                <div key={product.id} className="glass-panel" style={{ padding: '16px', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} 
                     onClick={() => navigate(`/product/${product.id}`)}
                     onMouseOver={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px)';
                       e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.3)';
                     }}
                     onMouseOut={(e) => {
                       e.currentTarget.style.transform = 'translateY(0)';
                       e.currentTarget.style.boxShadow = 'none';
                     }}
                >
                  <div style={{ borderRadius: '12px', overflow: 'hidden', height: '240px', marginBottom: '16px', position: 'relative' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(4px)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ color: 'var(--gold)' }}>★</span> {product.rating}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</div>
                    <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)' }}>${product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '120px 0', width: '100%' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.2 }}>🔍</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#fff', marginBottom: '12px' }}>
                No products <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>found</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontFamily: "'Space Grotesk', sans-serif" }}>Try adjusting your search or filters to find what you're looking for.</p>
              <button className="btn-outline" style={{ marginTop: '24px' }} onClick={() => { setActiveCategory('all'); }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
