// src/context/CartContext.jsx
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!storedUser?.id) {
      setCart([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/user/${storedUser.id}`);
      const data = await res.json();

      // Clean cart data - ensure proper size and price handling
      const clean = data.map(item => {
        let sizeData = null;
        
        // If item has a selected size, use it
        if (item.size && item.size.label) {
          sizeData = item.size;
        } 
        // If no size selected but product has sizes, use first available size
        else if (item.sizes && item.sizes.length > 0) {
          sizeData = item.sizes[0];
        }
        // If no sizes at all, create a default size object with product price
        else {
          sizeData = {
            label: "One Size",
            price: item.price || 0,
            stock: 999 // Default high stock for products without size variants
          };
        }

        return { 
          ...item, 
          size: sizeData,
          // Ensure base price exists
          price: item.price || sizeData.price || 0
        };
      });

      setCart(clean);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [storedUser?.id]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = async (productId, quantity = 1, size = null) => {
    if (!storedUser?.id) return alert("Please login first!");
    
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: storedUser.id, 
          product_id: productId, 
          quantity, 
          size 
        }),
      });
      
      if (!res.ok) throw new Error("Failed to add to cart");
      
      const savedItem = await res.json();
      
      // Ensure the saved item has proper size data
      let cleanedItem = { ...savedItem };
      if (!cleanedItem.size || !cleanedItem.size.label) {
        if (cleanedItem.sizes && cleanedItem.sizes.length > 0) {
          cleanedItem.size = cleanedItem.sizes[0];
        } else {
          cleanedItem.size = {
            label: "One Size",
            price: cleanedItem.price || 0,
            stock: 999
          };
        }
      }
      
      setCart(prev => {
        const existing = prev.find(i => i._id === cleanedItem._id);
        if (existing) {
          return prev.map(i => i._id === cleanedItem._id ? cleanedItem : i);
        }
        return [...prev, cleanedItem];
      });
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart");
    }
  };

  const removeFromCart = async itemId => {
    try {
      await fetch(`http://localhost:5000/api/cart/delete/${itemId}`, { 
        method: "DELETE" 
      });
      setCart(prev => prev.filter(i => i._id !== itemId));
    } catch (err) { 
      console.error("Remove from cart error:", err);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      await fetch(`http://localhost:5000/api/cart/update/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      setCart(prev => prev.map(i => i._id === itemId ? { ...i, quantity } : i));
    } catch (err) { 
      console.error("Update cart error:", err);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      loading, 
      addToCart, 
      removeFromCart, 
      updateCartItem, 
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}