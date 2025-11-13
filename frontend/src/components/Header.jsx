import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { ShoppingBag, ShoppingCart, Heart, User, Search, X, Minus, Plus } from "lucide-react";

import skincare2 from "../resources/skincare2.jpg";
import makeup1 from "../resources/makeup1.jpg";

import CheckoutModal from "./CheckoutModal";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  const [checkoutOpen, setCheckoutOpen] = useState(false); 

  // para sa selected product sa cart
  const handleSelect = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id); // uncheck
      } else {
        return [...prev, id]; // check
      }
    });
  };


  const handleQnty = (id, ope) => {
    setQuantities((prev) => {
      const currentQnty = prev[id] || 1; // default to 1
      let newQnty = currentQnty;

      if (ope === "plus") {
        if (currentQnty >= 10) {
          alert("Too much order");
        } else {
          newQnty = currentQnty + 1;
        }
      } else if (ope === "minus") {
        if (currentQnty <= 1) {
          alert("Add Quantity Please");
        } else {
          newQnty = currentQnty - 1;
        }
      }

      return { ...prev, [id]: newQnty }; // update only that product's quantity
    });
  };


  // Sample products
  const products = [
    {
      id: 1,
      name: "Marshmallow Glow Serum",
      category: "Skincare",
      price: 48,
      image: skincare2,
      size: "30ml",
    },
    {
      id: 2,
      name: "Cloud Soft Face Cream",
      category: "Skincare",
      price: 52,
      image: makeup1,
      size: "50ml",
    },
  ];

  // para sa search para mag intellisence
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );



  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 left-0 z-60">
        <div className="max-w-full px-1 py-1 md:px-6 py-4 flex items-center justify-between">
          {/* Left side: Burger + Logo */}
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden hover:cursor-pointer text-gray-700 text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <h1
              title="Marshmallow Beauty"
              className="text-[#FDA4AF] font-semibold text-m sm:text-xl md:text-2xl transition-all duration-200"
            >
              <Link to="/landing">Marshmallow Beauty</Link>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 text-gray-700">
            <Link to="/shop" className="hover:text-[#FDA4AF] transition">Shop</Link>
            <Link to="/bestseller" className="hover:text-[#FDA4AF] transition">Bestseller</Link>
            <Link to="/collection" className="hover:text-[#FDA4AF] transition">Collection</Link>
            <Link to="/about" className="hover:text-[#FDA4AF] transition">About</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2 md:space-x-3 text-gray-600 relative">
            {/* Search */}
            <button
              title="Search"
              onClick={() => setSearchOpen(true)}
              className="relative px-2 py-2 cursor-pointer md:px-3 md:py-3 rounded-xl hover:bg-[#FFE4E6] transition"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Wishlist with badge */}
            <button
              title="Wishlist"
              onClick={() => setWishlistOpen(true)}
              className="relative px-2 py-2 cursor-pointer md:px-3 md:py-3 rounded-xl hover:bg-[#FFE4E6] transition"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute -top-1 -right-1 bg-rose-300 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {/* number of products in wishlist, boi */}

                1
              </span>
            </button>

            <button
              title="Shopping Cart"
              onClick={() => setCartOpen(true)}
              className="relative px-2 py-2 cursor-pointer md:px-3 md:py-3 rounded-xl hover:bg-[#FFE4E6] transition"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute -top-1 -right-1 bg-rose-300 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {/* number of products in cart, boi */}
                2
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate("/user-acc")}
              title="Profile"
              className="relative px-2 py-2 cursor-pointer md:px-3 md:py-3 rounded-xl hover:bg-[#FFE4E6] transition"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {/* Cart with badge */}
          </div>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white shadow-md flex flex-col items-center space-y-4 py-6 text-gray-700 font-medium">
               <Link to="/shop" className="hover:text-[#FDA4AF] transition">Shop</Link>
            <Link to="/bestseller" className="hover:text-[#FDA4AF] transition">Bestseller</Link>
            <Link to="/collection" className="hover:text-[#FDA4AF] transition">Collection</Link>
            <Link to="/about" className="hover:text-[#FDA4AF] transition">About</Link>
          </div>
        )}
      </header>

      {/* ===== Search Modal ===== */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex  items-center justify-center px-4">

          <div className="bg-rose-50 w-full max-w-lg rounded-2xl shadow-xl p-4">

            <div className="w-full h-5 text-right mb-2 ">

              <button onClick={() => setSearchOpen(false)}>
                <X size={20} className="cursor-pointer text-gray-400 hover:text-gray-600 transition" />
              </button>
            </div>
            {/* Search bar */}
            <div className="flex items-center gap-2 border-rose-100 pb-2">
              <Search className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white py-2 px-4 rounded-full outline-none text-gray-700 placeholder-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />


            </div>

            <hr className="border-gray-400 mt-1 " />

            {/* Product list */}
            <div className="mt-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-transparent">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-6 justify-between py-3 px-2 hover:bg-rose-100 rounded-xl transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <p className="text-rose-400 font-semibold">
                      ${product.price}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-6">
                  No results found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Cart Drawer ===== */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-rose-50 h-full shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-rose-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Shopping Cart ({selectedItems.length})
              </h2>
              <button onClick={() => setCartOpen(false)}>
                <X className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      className="w-4 h-4 accent-rose-400 cursor-pointer"
                    />

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => handleQnty(item.id, "minus")}
                          className="p-1 rounded-md hover:bg-rose-100"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-gray-800 text-sm">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQnty(item.id, "plus")}
                          className="p-1 rounded-md hover:bg-rose-100"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="text-gray-400 hover:text-rose-400">
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-rose-400 font-semibold mt-4">
                      ${(item.price * (quantities[item.id] || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal Section */}
            <div className="border-t border-rose-100 px-6 py-4">
              {(() => {
                const subtotal = products
                  .filter((item) => selectedItems.includes(item.id))
                  .reduce((total, item) => {
                    const qty = quantities[item.id] || 1;
                    return total + item.price * qty;
                  }, 0);

                return (
                  <>
                    <div className="flex justify-between text-gray-700 mb-2">
                      <p>Subtotal</p>
                      <p className="font-semibold">${subtotal.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Shipping and taxes calculated at checkout
                    </p>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        setTimeout(() => setCheckoutOpen(true), 200);
                      }}

                      disabled={subtotal === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition ${subtotal === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-rose-300 text-white hover:bg-rose-400"
                        }`}
                    >
                      Proceed to Checkout
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}


      {/* ===== Wishlist Drawer ===== */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-rose-50 h-full shadow-xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-rose-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Wishlist (2)
              </h2>
              <button onClick={() => setWishlistOpen(false)}>
                <X className="text-gray-500 cursor-pointer hover:text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
              {products.map((item) => (
                <div key={item.id}
                  className="flex items-center justify-between bg-[#ffeee880] p-3 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="w-1/4 flex flex-col justify-end gap-6">
                    <button className="self-end text-gray-400 hover:text-rose-400">
                      <X className="w-4 h-4 cursor-pointer" />
                    </button>
                    <button className="flex items-center justify-center gap-1 bg-[#fff5f0] hover:bg-[#F4A4B4]/20 cursor-pointer text-[#4a3b47] w-full h-7 text-sm rounded-md transition">
                      <ShoppingCart size={14} />
                      Add
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          product={{
            name: "Selected Items",
            price: 100, // just for demo
            quantity: selectedItems.length,
          }}
        />
      )}
    </>
  );
}
