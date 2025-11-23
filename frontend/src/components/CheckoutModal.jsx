import { X, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function CheckoutModal({ onClose, product = null, selectedCartItems = null }) {
  const [showThankYou, setShowThankYou] = useState(false);
  const [loading, setLoading] = useState(false);

  // Multi-item support
  const items = selectedCartItems || (product ? [product] : []);

  // Compute total
  const computedTotal = items.reduce((sum, item) => {
    const price = item.size?.price || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  // Shipping & Payment state (unchanged)
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user_id = storedUser?._id || storedUser?.id;
  const username = (storedUser?.fname || "") + " " + (storedUser?.lname || "");

  useEffect(() => {
    if (!user_id) return;
    fetch(`http://localhost:5000/api/address/all/${user_id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
      .then((list) => {
        setAddresses(list);
        if (list.length > 0) {
          const defaultAddress = list.find((a) => a.tag === "default");
          setSelectedAddress(defaultAddress?._id || list[0]._id);
        }
      })
      .catch((err) => console.error("Failed to fetch addresses:", err));
  }, [user_id]);

  const handleCompleteOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address.");
      return;
    }

    setLoading(true);

    // Transform items to backend format
    const productsToSave = items.map((item) => ({
      product_id: item._id || item.id,
      amount: item.quantity || 1,
      price: item.size?.price || item.price || 0,
    }));

    try {
      const res = await fetch("http://localhost:5000/api/orders/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          username,
          shipping_address: selectedAddress,
          product: productsToSave,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
      {!showThankYou ? (
        <div className="bg-[#fff5f0] w-full max-w-md md:max-w-lg rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Checkout</h2>

          {/* Order Summary */}
          <div className="bg-[#ffeee880] border border-rose-100 rounded-lg p-3 mb-4">
            <h4 className="mb-5 text-gray-700 font-semibold">Order Summary</h4>
            {items.map((item) => {
              const sizeLabel = item.size?.label || "One Size";
              const unitPrice = item.size?.price || item.price || 0;
              const qty = item.quantity || 1;
              const lineTotal = unitPrice * qty;
              return (
                <div key={item._id || item.id} className="flex justify-between text-sm mb-2">
                  <span>{item.name} • {sizeLabel} × {qty}</span>
                  <span>${lineTotal.toFixed(2)}</span>
                </div>
              );
            })}
            <hr className="my-2 border-rose-100" />
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span className="text-rose-500">${computedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="w-full p-2 border rounded-lg border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 mb-4"
          >
            {addresses.length === 0 ? (
              <option disabled>No saved addresses</option>
            ) : (
              addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.addressName}
                </option>
              ))
            )}
          </select>

          {/* Payment Method */}
          <h3 className="font-medium text-gray-700 mb-2">Mode of Payment</h3>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="w-4 h-4 accent-rose-500"
            />
            <label htmlFor="cod" className="text-gray-700">Cash on Delivery</label>
          </div>

          <button
            onClick={handleCompleteOrder}
            disabled={loading}
            className="w-full bg-[#f4a4b4] hover:bg-[#fbb6c1] font-medium py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Placing Order..." : `Complete Order – $${computedTotal.toFixed(2)}`}
          </button>
        </div>
      ) : (
        <div className="bg-[#FFF5F0] w-full max-w-sm rounded-2xl shadow-xl p-6 text-center">
          <CheckCircle className="mx-auto text-rose-400 mb-3" size={48} />
          <h2 className="text-xl font-semibold text-gray-800">Thank you for your order!</h2>
          <p className="text-gray-500 mt-2">Your order has been successfully placed.</p>
        </div>
      )}
    </div>
  );
}
