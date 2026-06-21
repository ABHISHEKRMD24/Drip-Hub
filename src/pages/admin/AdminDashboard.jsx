import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { categories } from '../../mockData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Dashboard states
  const [categoryCounts, setCategoryCounts] = useState({});
  const allCategories = ['shirts', 'pants', 'shoes', 'watches', 'sunglasses'];

  // Products states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'shirts',
    price: '',
    description: '',
    image: '', 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProductsAndStats = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      
      const prods = [];
      const counts = {};
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        prods.push({ id: docSnap.id, ...data });
        
        const cat = data.category;
        if (cat) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      });
      
      setProducts(prods);
      setCategoryCounts(counts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsAndStats();
  }, []);

  const maxCount = Math.max(...Object.values(categoryCounts).concat(0));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || '' : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.image,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'shirts',
        price: '',
        description: '',
        image: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: editingProduct ? editingProduct.rating : 5.0,
        reviews: editingProduct ? editingProduct.reviews : 0,
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
      await fetchProductsAndStats();
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        await fetchProductsAndStats();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="page-root">
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#fff', marginBottom: '10px' }}>
              Admin <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Dashboard</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back, {currentUser?.email}</p>
          </div>
        </div>

        {/* Categories Chart */}
        <div style={{ width: '100%', marginBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600 }}>Products by Category</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '240px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {allCategories.map(cat => {
              const count = categoryCounts[cat] || 0;
              const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={cat} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '60px', 
                    height: `${heightPercent}%`,
                    minHeight: '4px',
                    background: 'linear-gradient(180deg, var(--gold) 0%, rgba(201,168,106,0.1) 100%)', 
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    border: '1px solid rgba(201,168,106,0.3)',
                    borderBottom: 'none'
                  }}>
                     <div style={{
                       position: 'absolute',
                       top: '-28px',
                       left: '50%',
                       transform: 'translateX(-50%)',
                       fontSize: '14px',
                       fontWeight: 700,
                       color: 'var(--gold)'
                     }}>
                       {count > 0 ? count : ''}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {allCategories.map(cat => (
              <div key={cat} style={{ flex: 1, textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 500 }}>
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Products List */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 600 }}>Manage Products</h3>
            <button className="btn-gold" onClick={() => openModal()}>Add New Product</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading products...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {products.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>No products found.</div>
              ) : (
                products.map(product => (
                  <div key={product.id} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ borderRadius: '12px', overflow: 'hidden', height: '240px', marginBottom: '16px', background: 'rgba(0,0,0,0.2)' }}>
                      {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</div>
                      <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gold)' }}>${product.price.toFixed(2)}</div>
                    </div>
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <button onClick={() => openModal(product)} className="btn-outline" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleDelete(product.id)} style={{ flex: 1, padding: '8px', fontSize: '12px', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.1)'}
                      >Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)'
        }}>
          <style>{`
            .custom-select {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              background-image: url('data:image/svg+xml;utf8,<svg fill="%23c9a86a" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
              background-repeat: no-repeat;
              background-position-x: calc(100% - 16px);
              background-position-y: center;
            }
            .custom-select option {
              background: #111;
              color: #fff;
              padding: 10px;
            }
            .custom-file-input::-webkit-file-upload-button {
              background: var(--gold);
              color: #000;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 600;
              margin-right: 15px;
            }
            .custom-file-input::file-selector-button {
              background: var(--gold);
              color: #000;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 600;
              margin-right: 15px;
            }
            .custom-file-input {
              color: rgba(255, 255, 255, 0.5) !important;
            }
          `}</style>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '24px' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="custom-select"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Price ($)</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', resize: 'vertical' }}></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="custom-file-input"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                {formData.image && (
                  <div style={{ marginTop: '16px', height: '150px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={formData.image} alt="Preview" style={{ height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                <button type="button" onClick={closeModal} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-gold" style={{ flex: 1 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
