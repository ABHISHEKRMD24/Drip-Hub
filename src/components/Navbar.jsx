import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartItemCount } = useCart();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      transition: 'all 0.3s ease',
      padding: scrolled ? '15px 0' : '25px 0',
      background: scrolled ? 'rgba(13, 13, 13, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--gold)',
            boxShadow: '0 0 10px rgba(201,168,106,0.5)'
          }}></div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.5px'
          }}>Drip<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Hub</span></span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {location.pathname.startsWith('/admin') ? (
            <>
              <Link to="/admin" style={{
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: isActive('/admin') ? 'var(--gold)' : '#fff',
                letterSpacing: '1px',
                transition: 'color 0.3s ease'
              }}>Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/home" style={{
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: isActive('/home') ? 'var(--gold)' : '#fff',
                letterSpacing: '1px',
                transition: 'color 0.3s ease'
              }}>Home</Link>
              
              <Link to="/products" style={{
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: isActive('/products') ? 'var(--gold)' : '#fff',
                letterSpacing: '1px',
                transition: 'color 0.3s ease'
              }}>Products</Link>
              
              <Link to="/cart" style={{
                textDecoration: 'none',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isActive('/cart') ? 'rgba(201,168,106,0.1)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  border: isActive('/cart') ? '1px solid var(--gold)' : '1px solid transparent'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive('/cart') ? 'var(--gold)' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
                
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'var(--gold)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </>
          )}
          
          <Link to="/login" style={{
            textDecoration: 'none',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '1px',
            padding: '8px 20px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            transition: 'all 0.3s ease'
          }}>Log Out</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
