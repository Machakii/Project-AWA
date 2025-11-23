import { useEffect, useState } from "react";

export default function useCart(userId) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!userId) return; // Do nothing if userId is missing

    async function fetchCart() {
      try {
        const response = await fetch(`http://localhost:5000/api/cart/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart");

        const data = await response.json();
        setCart(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [userId]);

  return { cart, setCart, loading };
}