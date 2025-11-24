import { useState, useEffect } from "react";
import { Heart, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import ProductModal from "./ProductModal";
import CheckoutModal from "./CheckoutModal";
import useProducts from "../reusables/useProducts";
import useWishlistContext from "../reusables/useWishlistContext";
import { useParams, useLocation } from "react-router-dom";

const categories = ["All", "Skincare", "Makeup", "Fragrance", "Tools", "Bundle"];

export default function FeaturedProducts() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const { products, loading } = useProducts();

  // wishlist context
  const {
    wishlist,
    loading: wishlistLoading,
    addToWishlist,
    removeFromWishlist,
    isProductWishlisted,
    findWishlistItemByProductId
  } = useWishlistContext();

  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation(); // prevent opening product modal
    const pid = product._id || product.id;

    const already = isProductWishlisted(pid);
    if (already) {
      const wItem = findWishlistItemByProductId(pid);
      if (wItem) {
        // optimistic UI: remove immediately
        await removeFromWishlist(wItem._id);
      }
    } else {
      // optimistic UI: add immediately
      await addToWishlist(pid);
    }
  };

  const handleCloseDetails = () => setSelectedProduct(null);
  const handleBuyNow = (product, quantity, sizeId) => {
    setSelectedProduct(null);
    setTimeout(() => {
      setCheckoutProduct({ ...product, quantity, selectedSize: sizeId });
    }, 200);
  };
  const handleCloseCheckout = () => setCheckoutProduct(null);

  return (
    <>
      <Header />
      <section className="bg-[#FFF6F3] py-25 px-6">
        <div className="max-w-full mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#4A3B47]">Featured Products</h2>
          <p className="text-gray-500 mt-2">Handpicked favorites from our marshmallow collection</p>

          {/* Search + Filter */}
          <div className="flex justify-center mt-5 flex-col md:flex-row gap-5">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1">
              <Search className="text-gray-500" />
              <input
                type="text"
                placeholder="Search:"
                className="bg-white w-full sm:w-80 px-4 py-1 border-none placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
              />
              <button
                type="submit"
                className="bg-[#FDA4AF] text-white px-4 py-1 rounded-lg hover:opacity-80 cursor-pointer transition font-medium"
              >
                Search
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowFilter(true)}
                className="flex items-center gap-2 cursor-pointer rounded-xl border border-gray-200 px-4 py-2 hover:bg-pink-50 transition text-gray-600"
              >
                <SlidersHorizontal size={16} />
                Filter: <span className="text-[#F4A4B4] font-medium">{selectedCategory}</span>
              </button>
            </div>
          </div>

          {/* Filter modal */}
          {showFilter && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[100]">
              <div className="bg-white rounded-2xl shadow-lg w-80 p-6 relative">
                <button onClick={() => setShowFilter(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                  <X size={18} />
                </button>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-left">Select Category</h3>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setShowFilter(false); }}
                      className={`px-4 py-2 rounded-lg border text-sm text-left transition ${
                        selectedCategory === cat
                          ? "bg-pink-200 text-pink-800 border-pink-300"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-pink-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-lg font-medium">
              <p>Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-lg font-medium">
              <p className="italic">No products available in this category</p>
            </div>
          ) : (
            <div className="mt-15 w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => {
                const pid = product._id || product.id;
                const liked = isProductWishlisted(pid);

                return (
                  <div
                    key={pid}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.tag && (
                      <span
                        className={`absolute top-3 left-3 text-xs font-medium px-3 py-1 rounded-full ${
                          product.tag === "Bestseller"
                            ? "bg-pink-200 text-pink-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {product.tag}
                      </span>
                    )}

                    {/* Wishlist Heart */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className="absolute top-3 right-3 bg-white p-2 rounded-lg hover:bg-pink-100 transition z-10"
                    >
                      <Heart className={`w-4 h-4 ${liked ? "text-pink-500 fill-pink-500" : "text-gray-700"}`} />
                    </button>

                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-90 object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="p-5 text-left">
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <h3 className="font-medium text-gray-800 mt-1">{product.name}</h3>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-pink-600 font-semibold">${product.price}</p>
                        <button className="flex items-center gap-1 bg-pink-200 hover:bg-pink-300 text-pink-800 px-4 py-2 rounded-full text-sm transition">
                          <ShoppingCart size={14} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <hr className="text-gray-200" />
      <Footer />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseDetails}
          onBuyNow={(p, qty, sizeId) => handleBuyNow(p, qty, sizeId)}
        />
      )}

      {/* Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={handleCloseCheckout}
        />
      )}
    </>
  );
}
