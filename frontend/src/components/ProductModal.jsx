import { useState, useContext } from "react";
import { ShoppingCart, ShoppingBag, X, Star, PackageCheck, AlertCircle } from "lucide-react";
import { CartContext } from "../context/CartContext";

export default function ProductModal({ product, onClose, onBuyNow }) {
  // Initialize with first available size or null
  const initialSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { addToCart } = useContext(CartContext);

  // Get price: prioritize size price, fallback to product price
  const priceToShow = selectedSize?.price || product.price || 0;
  const totalPrice = (priceToShow * quantity).toFixed(2);
  
  // Get available stock for selected size
  const availableStock = selectedSize?.stock || 0;
  const isOutOfStock = product.sizes && product.sizes.length > 0 ? availableStock === 0 : false;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  // Check if quantity exceeds stock
  const exceedsStock = quantity > availableStock;

  const handleAddToCart = async () => {
    if (!storedUser?.id) return alert("Please login first!");
    if (isOutOfStock) return alert("This size is out of stock!");
    if (exceedsStock) return alert(`Only ${availableStock} items available in stock!`);

    setAdding(true);
    try {
      await addToCart(product._id, quantity, selectedSize);
      alert(`Added ${quantity} × ${product.name} ${selectedSize ? `(${selectedSize.label})` : ""} to cart`);
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return alert("This size is out of stock!");
    if (exceedsStock) return alert(`Only ${availableStock} items available in stock!`);
    
    // Create checkout data with proper price and size info
    const checkoutData = {
      ...product,
      quantity,
      selectedSize: selectedSize || null,
      checkoutPrice: priceToShow, // Include the calculated price
      checkoutTotal: parseFloat(totalPrice)
    };
    
    onBuyNow(checkoutData, quantity, selectedSize);
  };

  // Update quantity when size changes
  const handleSizeChange = (size) => {
    setSelectedSize(size);
    // Reset quantity if it exceeds new size's stock
    if (quantity > size.stock) {
      setQuantity(Math.min(1, size.stock));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg overflow-auto md:overflow-hidden relative grid grid-cols-1 md:grid-cols-2 max-h-[90vh] md:max-h-[700px]">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 bg-white rounded-full text-gray-400 p-2 shadow hover:bg-gray-100 z-50"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="bg-rose-50 flex items-center justify-center h-[250px] sm:h-[350px] md:h-auto">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="p-4 md:p-6 overflow-y-auto">
          <p className="text-sm text-rose-500 font-medium">{product.category}</p>
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800 mt-1">{product.name}</h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3 text-sm">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-gray-500">{product.reviews} reviews</span>
          </div>

          {/* Price */}
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">
              ${priceToShow.toFixed(2)} <span className="text-sm text-gray-500">each</span>
            </div>
            <div className="text-sm text-gray-600">× {quantity} = <strong>${totalPrice}</strong></div>
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">{product.description}</p>

          {/* Size Selection with Stock */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const sizeOutOfStock = s.stock === 0;
                  const sizeLowStock = s.stock > 0 && s.stock <= 5;
                  
                  return (
                    <button
                      key={s.id}
                      onClick={() => !sizeOutOfStock && handleSizeChange(s)}
                      disabled={sizeOutOfStock}
                      className={`px-3 py-2 rounded-lg border text-sm transition relative ${
                        sizeOutOfStock
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                          : selectedSize?.id === s.id
                          ? "bg-rose-100 border-rose-300 text-rose-700 ring-2 ring-rose-200"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{s.label}</span>
                        <span className={`text-xs mt-0.5 ${
                          sizeOutOfStock 
                            ? "text-red-500" 
                            : sizeLowStock 
                            ? "text-orange-500" 
                            : "text-gray-500"
                        }`}>
                          {sizeOutOfStock ? "Out of stock" : `${s.stock} left`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Status Alert */}
          {selectedSize && (
            <div className="mt-4">
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle size={16} />
                  <span>This size is currently out of stock</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                  <AlertCircle size={16} />
                  <span>Only {availableStock} items left in stock - Order soon!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <PackageCheck size={16} />
                  <span>{availableStock} items available</span>
                </div>
              )}
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center border rounded-md overflow-hidden self-start">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q-1))} 
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                  disabled={isOutOfStock}
                >
                  −
                </button>
                <div className="px-4 py-2 text-black min-w-[50px] text-center">{quantity}</div>
                <button 
                  onClick={() => setQuantity(q => Math.min(availableStock, q+1))} 
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                  disabled={isOutOfStock || quantity >= availableStock}
                >
                  +
                </button>
              </div>
              {exceedsStock && !isOutOfStock && (
                <span className="text-xs text-red-500">
                  Max quantity: {availableStock}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock || exceedsStock}
                className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg transition ${
                  isOutOfStock || exceedsStock
                    ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-200 hover:shadow-md text-gray-700 cursor-pointer"
                }`}
              >
                <ShoppingCart size={16} />
                {adding ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock || exceedsStock}
                className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg transition ${
                  isOutOfStock || exceedsStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#F4A4B4] text-gray-700 hover:bg-[#FDA4AF]/80 cursor-pointer"
                }`}
              >
                <ShoppingBag size={16} />
                {isOutOfStock ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}