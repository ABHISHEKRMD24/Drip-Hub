import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(5,5,15,0.72)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '60px 0 40px',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--gold)'
          }}></div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.5px'
          }}>Drip<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Hub</span></span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '32px',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '13px',
          color: 'var(--text-muted)',
          letterSpacing: '1px'
        }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}>About Us</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}>Contact</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}>Privacy Policy</span>
        </div>
        
        <div style={{
          width: '100px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          opacity: 0.3
        }}></div>
        
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.5px'
        }}>
          &copy; {new Date().getFullYear()} DripHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
