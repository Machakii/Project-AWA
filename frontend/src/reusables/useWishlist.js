import { useEffect, useState } from "react";

export default function useWishlist(userId) {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!userId) return; // do nothing if userId not provided

    async function fetchWishlist() {
      try {
        const response = await fetch(`http://localhost:5000/api/wishlist/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch wishlist");

        const data = await response.json();
        setWishlist(data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [userId]);

  return { wishlist, setWishlist, loading };
}
