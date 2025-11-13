import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";

export default function CheckoutModal({ onClose, product }) {
  const [showThankYou, setShowThankYou] = useState(false);

  const handleCompleteOrder = () => {
    setShowThankYou(true); // show thank-you modal

    // Automatically close after 2 seconds
    setTimeout(() => {
      setShowThankYou(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
      {/* Checkout Content */}
      {!showThankYou ? (
        <div className="bg-[#fff5f0] w-full max-w-md md:max-w-lg rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Checkout</h2>

          {/* Order Summary */}
          <div className="bg-[#ffeee880] border border-rose-100 rounded-lg p-3 mb-4">
            <h4 className="mb-5">Order Summary:</h4>
            <div className="flex justify-between text-sm text-[#4a3b47]">
              <span>
                {product?.name || "Product"} x {product?.quantity || "x1"}
              </span>
              <span>${product?.price || 52}.00</span>
            </div>
            <hr className="my-2 border-rose-100" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-rose-500">${product?.price || 52}.00</span>
            </div>
          </div>

          {/* Contact Info */}
          <h3 className="font-medium text-gray-700 mb-2">
            Contact Information
          </h3>
          <input
            type="email"
            placeholder="you@example.com"
            required
            className="w-full p-2 border rounded-lg border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 mb-4"
          />

          {/* Shipping */}
          <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
          <input
            type="text"
            required
            placeholder="Full Name"
            className="w-full p-2 mb-2 border rounded-lg border-rose-200"
          />
          <input
            type="text"
            placeholder="Address"
            required
            className="w-full p-2 mb-2 border rounded-lg border-rose-200"
          />
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              required
              placeholder="City"
              className="w-1/2 p-2 border rounded-lg border-rose-200"
            />
            <input
              required
              type="text"
              placeholder="ZIP Code"
              className="w-1/2 p-2 border rounded-lg border-rose-200"
            />
          </div>

          {/* Payment */}
          <h3 className="font-medium text-gray-700 mb-2">
            Payment Information
          </h3>
          <input
            required
            type="text"
            placeholder="Card Number"
            className="w-full p-2 mb-2 border rounded-lg border-rose-200"
          />
          <div className="flex gap-2 mb-4">
            <input
              required
              type="text"
              placeholder="MM/YY"
              className="w-1/2 p-2 border rounded-lg border-rose-200"
            />
            <input
              required
              type="text"
              placeholder="CVV"
              className="w-1/2 p-2 border rounded-lg border-rose-200"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleCompleteOrder}
            className="w-full bg-[#f4a4b4] hover:bg-[#fbb6c1] font-medium py-2 rounded-lg transition"
          >
            Complete Order – ${product?.price || 52}.00
          </button>
        </div>
      ) : (
        // Thank You Modal
        <div className="bg-[#FFF5F0] w-full max-w-sm rounded-2xl shadow-xl p-6 text-center">
          <CheckCircle className="mx-auto text-rose-400 mb-3" size={48} />
          <h2 className="text-xl font-semibold text-gray-800">
            Thank you for your order!
          </h2>
          <p className="text-gray-500 mt-2">
            Your order has been successfully placed.
          </p>
        </div>
      )}
    </div>
  );
}
