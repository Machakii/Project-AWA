import { useState } from "react";
import { Heart, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductModal from "../components/ProductModal";
import CheckoutModal from "../components/CheckoutModal";
import useProducts from "../reusables/useProducts";
import useWishlistContext from "../reusables/useWishlistContext";

const categories = ["All", "Skincare", "Makeup", "Fragrance", "Tools", "Bundle"];

export default function Bestsellers() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const { products, loading } = useProducts();

  // Wishlist context
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isProductWishlisted,
    findWishlistItemByProductId,
  } = useWishlistContext();

  // Filter products: show only bestsellers
  const filtered =
    selectedCategory === "All"
      ? products.filter((p) => p.tag?.toLowerCase() === "bestseller")
      : products.filter(
          (p) =>
            p.category === selectedCategory &&
            p.tag?.toLowerCase() === "bestseller"
        );

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setShowFilter(false);
  };

  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation(); // prevent opening product modal
    const pid = product._id || product.id;

    const already = isProductWishlisted(pid);
    if (already) {
      const wItem = findWishlistItemByProductId(pid);
      if (wItem) await removeFromWishlist(wItem._id);
    } else {
      await addToWishlist(pid);
    }
  };

  const handleCloseDetails = () => setSelectedProduct(null);

  const handleBuyNow = (checkoutData) => {
    setSelectedProduct(null);
    setTimeout(() => {
      // Ensure we pass properly formatted checkout data
      const formattedCheckout = {
        ...checkoutData,
        // Ensure price is available
        price: checkoutData.checkoutPrice || checkoutData.selectedSize?.price || checkoutData.price || 0,
        // Include size info if available
        size: checkoutData.selectedSize || null,
        quantity: checkoutData.quantity || 1
      };
      setCheckoutProduct(formattedCheckout);
    }, 200);
  };

  const handleCloseCheckout = () => setCheckoutProduct(null);

  // Helper function to get display price
  const getDisplayPrice = (product) => {
    // If product has sizes, use the first size price or the minimum price
    if (product.sizes && product.sizes.length > 0) {
      const prices = product.sizes.map(s => s.price).filter(p => p > 0);
      if (prices.length > 0) {
        return Math.min(...prices);
      }
    }
    // Fallback to product base price
    return product.price || 0;
  };

  return (
    <>
      <Header />

      <section className="bg-[#FFF6F3] py-25 px-6">
        <div className="max-w-full mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#4A3B47]">
            Bestseller Products
          </h2>
          <p className="text-gray-500 mt-2">
            Handpicked favorites from our marshmallow collection
          </p>

          {/* Search + Filter */}
          <div className="flex justify-center mt-5 flex-col md:flex-row gap-5">
            <div className="flex items-center gap-1 bg-white rounded-lg p-1">
              <Search className="text-gray-500" />
              <input
                type="text"
                placeholder="Search:"
                className="bg-white w-full sm:w-80 px-4 py-1 border-none placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
              />
              <button className="bg-[#FDA4AF] text-white px-4 py-1 rounded-lg hover:opacity-80 cursor-pointer transition font-medium">
                Search
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowFilter(true)}
                className="flex items-center gap-2 cursor-pointer rounded-xl border border-gray-200 px-4 py-2 hover:bg-pink-50 transition text-gray-600"
              >
                <SlidersHorizontal size={16} />
                Filter:{" "}
                <span className="text-[#F4A4B4] font-medium">{selectedCategory}</span>
              </button>
            </div>
          </div>

          {/* Filter Modal */}
          {showFilter && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[100]">
              <div className="bg-white rounded-2xl shadow-lg w-80 p-6 relative">
                <button
                  onClick={() => setShowFilter(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-left">
                  Select Category
                </h3>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
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
                const displayPrice = getDisplayPrice(product);

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
                      <Heart
                        className={`w-4 h-4 ${
                          liked ? "text-pink-500 fill-pink-500" : "text-gray-700"
                        }`}
                      />
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
                        <div className="flex flex-col">
                          <p className="text-pink-600 font-semibold">
                            ${displayPrice.toFixed(2)}
                          </p>
                          {product.sizes && product.sizes.length > 1 && (
                            <span className="text-xs text-gray-400">Starting price</span>
                          )}
                        </div>
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
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal product={checkoutProduct} onClose={handleCloseCheckout} />
      )}
    </>
  );
}