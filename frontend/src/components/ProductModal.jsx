import React, { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { Star, Heart, ShoppingCart, ShoppingBag, X } from "lucide-react";


export default function ProductModal({ product, onClose, onBuyNow }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[1].id);
  const [quantity, setQuantity] = useState(1);

  const currentSize = product.sizes.find((s) => s.id === selectedSize);
  const priceToShow = currentSize?.price ?? product.price;
  const totalPrice = (priceToShow * quantity).toFixed(2);


  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); 

  //switch with actual logic
  function addToCart() {
    const payload = { productId: product.id, size: selectedSize, qty: quantity };
    console.log("Add to cart", payload);
    alert(`Added ${quantity} × ${product.name} (${currentSize.label}) to cart`);
  }

  return (

    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
        <div className="
        bg-white w-full max-w-5xl rounded-2xl shadow-lg overflow-auto md:overflow-hidden relative 
        grid grid-cols-1 md:grid-cols-2
        max-h-[90vh] md:max-h-[700px]
      ">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-3 right-3 bg-white rounded-full text-gray-400 p-2 shadow hover:bg-gray-100 z-50"
          >
            <X size={18} />
          </button>

          {/* Image Section */}
          <div className="bg-rose-50 flex items-center justify-center h-[250px] sm:h-[350px] md:h-auto">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="p-4 md:p-6 overflow-y-auto">
            {/* Title + Wishlist */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-rose-500 font-medium">{product.category}</p>
                <h1 className="text-xl md:text-3xl font-semibold text-gray-800 mt-1">
                  {product.name}
                </h1>
              </div>

            </div>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-3 text-sm">
              <Star size={16} className="text-yellow-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500">{product.reviews} reviews</span>

            </div>

            {/* price section */}
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${priceToShow.toFixed(2)} <span className="text-sm text-gray-500">each</span>
                </div>
                <div className="text-sm text-gray-600">
                  × {quantity} = <strong>${totalPrice}</strong>
                </div>
                <div className="text-sm text-gray-500">incl. taxes</div>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div>{product.note}</div>
                <div className="mt-1">{product.returnPolicy}</div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.id)}
                    className={`px-3 py-2 rounded-lg cursor-pointer border text-sm transition ${selectedSize === s.id
                      ? "bg-rose-100 border-rose-200 text-rose-700"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border rounded-md overflow-hidden self-start sm:self-center">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 cursor-pointer bg-gray-100 text-gray-700"
                >
                  −
                </button>
                <div className="px-4 py-2 text-black">{quantity}</div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 cursor-pointer bg-gray-100 text-gray-700"
                >
                  +
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={addToCart}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-gray-200 px-4 py-2 hover:shadow-md text-gray-700 cursor-pointer rounded-lg"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>

                <button
                  onClick={onBuyNow}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#F4A4B4] px-4 py-2 rounded-lg text-gray-700 hover:bg-[#FDA4AF]/80 cursor-pointer transition">
                  <ShoppingBag size={16}

                  />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Extra Info */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                Free shipping over $50
              </div>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                30-day return policy
              </div>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                Secure payment
              </div>


            </div>

          </div>
        </div>
      </div>
    
    </>

  );
}
