import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart whenever user changes (login/logout)
  useEffect(() => {
    const loadCart = async () => {
      if (currentUser) {
        // Load from Firestore for logged-in user
        try {
          const cartRef = doc(db, 'users', currentUser.uid);
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists() && cartSnap.data().cart) {
            setCart(cartSnap.data().cart);
          } else {
            // New user or no cart yet — start fresh
            setCart([]);
          }
        } catch (error) {
          console.error('Error loading cart from Firestore:', error);
          // Fall back to localStorage on error
          const savedCart = localStorage.getItem('driphub_cart');
          setCart(savedCart ? JSON.parse(savedCart) : []);
        }
      } else {
        // Guest: use localStorage
        const savedCart = localStorage.getItem('driphub_cart');
        setCart(savedCart ? JSON.parse(savedCart) : []);
      }
    };

    loadCart();
  }, [currentUser]);

  // Persist cart whenever it changes
  useEffect(() => {
    if (currentUser) {
      // Save to Firestore under the user's document
      const saveToFirestore = async () => {
        try {
          const cartRef = doc(db, 'users', currentUser.uid);
          await setDoc(cartRef, { cart }, { merge: true });
        } catch (error) {
          console.error('Error saving cart to Firestore:', error);
        }
      };
      saveToFirestore();
    } else {
      // Guest: save to localStorage
      localStorage.setItem('driphub_cart', JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
