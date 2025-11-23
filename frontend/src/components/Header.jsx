import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { ShoppingCart, Heart, User, Search, X, Minus, Plus } from "lucide-react";

import { CartContext } from "../context/CartContext";
import useWishlistContext from "../reusables/useWishlistContext";

import skincare2 from "../resources/skincare2.jpg";
import makeup1 from "../resources/makeup1.jpg";
import CheckoutModal from "./CheckoutModal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  // Cart context
  const { cart, cartCount, removeFromCart, updateCartItem, loading: cartLoading, fetchCart } = useContext(CartContext);

  // Wishlist
  const { wishlist, loading: wishlistLoading, removeFromWishlist, addToWishlist, refreshWishlist } = useWishlistContext();

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      setIsLoggedIn(!!storedUser);
    };

    checkAuth();

    // Listen for storage changes (logout events)
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkAuth();
        // Close all drawers and reset state on logout
        if (!e.newValue) {
          setCartOpen(false);
          setWishlistOpen(false);
          setSearchOpen(false);
          setCheckoutOpen(false);
          setSelectedItems([]);
          setQuery("");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab logout
    const handleLogout = () => {
      checkAuth();
      setCartOpen(false);
      setWishlistOpen(false);
      setSearchOpen(false);
      setCheckoutOpen(false);
      setSelectedItems([]);
      setQuery("");
    };

    window.addEventListener("user-logout", handleLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-logout", handleLogout);
    };
  }, []);

  // Refresh cart and wishlist when drawers open
  useEffect(() => {
    if (cartOpen && isLoggedIn) {
      fetchCart();
    }
  }, [cartOpen, isLoggedIn]);

  useEffect(() => {
    if (wishlistOpen && isLoggedIn) {
      refreshWishlist();
    }
  }, [wishlistOpen, isLoggedIn]);

  // Sample products for search
  const products = [
    { id: 1, name: "Marshmallow Glow Serum", category: "Skincare", price: 48, image: skincare2 },
    { id: 2, name: "Cloud Soft Face Cream", category: "Skincare", price: 52, image: makeup1 },
  ];

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  // Subtotal only for selected items
  const subtotal = cart
    .filter(item => selectedItems.includes(item._id))
    .reduce((t, i) => {
      const price = i.size?.price || i.price || 0;
      return t + (i.quantity * price);
    }, 0);

  // Handle checkbox toggle
  const handleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(i => i !== id));
    } else {
      setSelectedItems(prev => [...prev, id]);
    }
  };

  // Handle remove from cart with real-time update
  const handleRemoveFromCart = async (itemId) => {
    await removeFromCart(itemId);
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  // Handle remove from wishlist with real-time update
  const handleRemoveFromWishlist = async (itemId) => {
    await removeFromWishlist(itemId);
  };

  // Handle add to cart from wishlist
  const handleAddToCartFromWishlist = async (item) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.id) {
      alert("Please login first!");
      return;
    }

    try {
      // Determine size to send
      let sizeToSend = null;

      if (item.sizes && item.sizes.length > 0) {
        // Use first available size
        sizeToSend = item.sizes[0];
      } else {
        // Create default size for products without size variants
        sizeToSend = {
          id: 1,
          label: "One Size",
          price: item.price || 0,
          stock: 999
        };
      }

      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: storedUser.id,
          product_id: item._id || item.product_id,
          quantity: 1,
          size: sizeToSend
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      await fetchCart(); // Refresh cart
      alert(`${item.name} added to cart!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 left-0 z-60">
        <div className="max-w-full px-1 py-1 md:px-6 py-4 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center space-x-4">
            <button className="lg:hidden text-gray-700 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-[#FDA4AF] font-semibold text-m sm:text-xl md:text-2xl">
              <Link to="/landing">Marshmallow Beauty</Link>
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex space-x-8 text-gray-700">
            <Link to="/shop" className="hover:text-[#FDA4AF] transition">Shop</Link>
            <Link to="/bestseller" className="hover:text-[#FDA4AF] transition">Bestseller</Link>
            <Link to="/collection" className="hover:text-[#FDA4AF] transition">Collection</Link>
            <Link to="/about" className="hover:text-[#FDA4AF] transition">About</Link>
          </nav>

          {/* ICONS */}
          <div className="flex items-center space-x-2 md:space-x-3 text-gray-600">
            <button onClick={() => setSearchOpen(true)} className="px-2 py-2 rounded-xl hover:bg-[#FFE4E6] transition">
              <Search className="w-5 h-5" />
            </button>

            <button onClick={() => setWishlistOpen(true)} className="relative px-2 py-2 rounded-xl hover:bg-[#FFE4E6] transition">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-rose-300 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistLoading ? "…" : wishlist.length}
              </span>
            </button>

            <button onClick={() => setCartOpen(true)} className="relative px-2 py-2 rounded-xl hover:bg-[#FFE4E6] transition">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-rose-300 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {cartLoading ? "…" : cartCount}
              </span>
            </button>

            <button onClick={() => navigate("/user-acc")} className="px-2 py-2 rounded-xl hover:bg-[#FFE4E6] transition">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-white shadow-md flex flex-col items-center space-y-4 py-6 text-gray-700 font-medium">
            <Link to="/shop">Shop</Link>
            <Link to="/bestseller">Bestseller</Link>
            <Link to="/collection">Collection</Link>
            <Link to="/about">About</Link>
          </div>
        )}
      </header>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-rose-50 w-full max-w-lg rounded-2xl shadow-xl p-4">
            <div className="text-right mb-2">
              <button onClick={() => setSearchOpen(false)}>
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-b pb-2 border-rose-100">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white py-2 px-4 rounded-full outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between px-2 py-3 hover:bg-rose-100 rounded-xl transition">
                    <div className="flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <p className="text-rose-400 font-semibold">${product.price}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-6">No results found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-rose-50 h-full shadow-xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Wishlist ({wishlist.length})</h2>
              <button onClick={() => setWishlistOpen(false)}>
                <X className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
              {wishlistLoading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : wishlist.length === 0 ? (
                <p className="text-center text-gray-500">Your wishlist is empty.</p>
              ) : (
                wishlist.map((item) => {
                  // Handle both populated and non-populated product_id
                  const product = item.product_id?._id ? item.product_id : item;
                  const productImage = product.image || item.image;
                  const productName = product.name || item.name;
                  const productCategory = product.category || item.category;

                  return (
                    <div key={item._id} className="flex items-center justify-between bg-[#ffeee880] p-3 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img src={productImage} className="w-14 h-14 rounded-lg object-cover" alt={productName} />
                        <div>
                          <h4 className="font-medium">{productName}</h4>
                          <p className="text-sm text-gray-500">{productCategory}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="text-gray-400 hover:text-rose-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleAddToCartFromWishlist(product)}
                          className="bg-white hover:bg-rose-100 text-gray-700 border rounded-md w-20 h-7 flex items-center justify-center gap-1 transition"
                        >
                          <ShoppingCart size={14} /> Add
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-rose-50 h-full shadow-xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Shopping Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)}>
                <X className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
              {cartLoading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              ) : (
                cart.map((item) => {
                  // Better handling for size display
                  const sizeLabel = item.size?.label || "One Size";
                  const sizePrice = item.size?.price || item.price || 0;
                  const sizeStock = item.size?.stock || 999;
                  const totalPrice = sizePrice * item.quantity;

                  // Don't show stock for "One Size" products (default)
                  const showStock = item.sizes && item.sizes.length > 0;

                  return (
                    <div key={item._id} className="flex items-center justify-between bg-[#ffeee880] p-3 rounded-xl">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => handleSelect(item._id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <img src={item.image} className="w-14 h-14 rounded-lg object-cover" alt={item.name} />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          {showStock && (
                            <p className="text-sm text-gray-500">Size: {sizeLabel}</p>
                          )}
                          <p className="text-sm text-rose-400 font-semibold">Price: ${sizePrice.toFixed(2)}</p>
                          {showStock && (
                            <p className="text-xs text-gray-400">Stock: {sizeStock}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="text-gray-400 hover:text-rose-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 hover:bg-rose-100 rounded-md transition cursor-pointer"
                            onClick={() => updateCartItem(item._id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            className="p-1 hover:bg-rose-100 rounded-md transition cursor-pointer"
                            onClick={() => updateCartItem(item._id, item.quantity + 1)}
                            disabled={showStock && item.quantity >= sizeStock}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-rose-400 font-semibold mt-2">${totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Subtotal */}
            <div className="border-t px-6 py-4">
              <div className="flex justify-between text-gray-700 mb-2">
                <p>Subtotal ({selectedItems.length} items)</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">Shipping calculated at checkout</p>
              <button
                onClick={() => {
                  if (selectedItems.length === 0) {
                    alert("Please select at least one item to checkout");
                    return;
                  }

                  setCartOpen(false);

                  setTimeout(() => {
                    setCheckoutOpen(true); // OPEN MODAL
                  }, 50);
                }}


                disabled={subtotal === 0 || selectedItems.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition ${subtotal === 0 || selectedItems.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-rose-300 text-white hover:bg-rose-400 cursor-pointer'
                  }`}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <CheckoutModal
          onClose={() => {
            setCheckoutOpen(false);
            setSelectedItems([]); // clear after checkout
          }}
          selectedCartItems={cart.filter(item =>
            selectedItems.includes(item._id || item.id)
          )}
          totalAmount={subtotal}
        />
      )}

    </>
  );
}