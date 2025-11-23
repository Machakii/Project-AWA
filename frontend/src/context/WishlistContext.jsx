import { createContext, useEffect, useState, useCallback } from "react";

export const WishlistContext = createContext({
  wishlist: [],
  loading: true,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isProductWishlisted: () => false,
  refreshWishlist: async () => {}
});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStoredUserId = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      return storedUser?.id || null;
    } catch {
      return null;
    }
  };

  const userId = getStoredUserId();

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlist(data || []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Add to wishlist (optimistic update + refresh)
  const addToWishlist = async (productId) => {
    if (!userId) throw new Error("No user logged in");

    const exists = wishlist.find(
      (w) => String(w.product_id) === String(productId) || w.product_id === productId
    );
    if (exists) return exists;

    try {
      const res = await fetch("http://localhost:5000/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, user_id: userId })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown" }));
        throw new Error(err.error || "Failed to add to wishlist");
      }
      await res.json();

      // ✅ REFRESH IMMEDIATELY AFTER ADD
      await fetchWishlist();
    } catch (err) {
      console.error("Add wishlist error:", err);
      throw err;
    }
  };

  // Remove wishlist item by the wishlist document _id (refresh immediately)
  const removeFromWishlist = async (wishlistItemId) => {
    if (!wishlistItemId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/wishlist/delete/${wishlistItemId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete wishlist item");

      // ✅ REFRESH IMMEDIATELY AFTER DELETE
      await fetchWishlist();
    } catch (err) {
      console.error("Remove wishlist error:", err);
      // best-effort refresh
      await fetchWishlist();
    }
  };

  const findWishlistItemByProductId = (productId) => {
    return wishlist.find(
      (w) =>
        String(w.product_id) === String(productId) ||
        (w.product_id && w.product_id._id && String(w.product_id._id) === String(productId))
    );
  };

  const isProductWishlisted = (productId) =>
    !!findWishlistItemByProductId(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isProductWishlisted,
        findWishlistItemByProductId,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
