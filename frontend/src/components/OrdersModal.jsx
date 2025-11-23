import React from "react";
import { X, FileText, Truck, Home, Package, Brush } from "lucide-react";

export default function OrderTrackingModal({ onClose, modalType, order }) {
  if (!order) return null;

  const firstItem = order.items?.[0] || {};

  const steps = [
    { icon: FileText, label: "Order Processed" },
    { icon: Brush, label: "Order Designing" },
    { icon: Package, label: "Order Shipped" },
    { icon: Truck, label: "Order En Route" },
    { icon: Home, label: "Order Arrived" },
  ];

  const statusLower = (order.status || "").toLowerCase();
  const activeStep = steps.findIndex((step) =>
    statusLower.includes(step.label.toLowerCase().replace("order ", ""))
  );

  // ETA does not exist in your data → use order.date or fallback
  const formattedETA = order.date || "Date unavailable";

  /* -------------------------------------------------------
      TRACKING MODAL
  ------------------------------------------------------- */
  if (modalType === "tracking") {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8 relative border border-[#FFE5EC]">

          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-[#F4A4B4]"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#F4A4B4]">
              ORDER <span className="text-gray-800">{order.id}</span>
            </h2>

            <p className="text-gray-500 text-sm">
              Expected Arrival <strong>{formattedETA}</strong> —{" "}
              {firstItem.name || "Product"}
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#FFE5EC] -z-10 rounded-full" />

            <div
              className="absolute top-1/2 left-0 h-1 bg-[#F4A4B4] rounded-full transition-all duration-500"
              style={{
                width: `${((activeStep >= 0 ? activeStep : 0) / (steps.length - 1)) * 100}%`,
              }}
            />

            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                    index <= activeStep
                      ? "border-[#F4A4B4] bg-[#F4A4B4] text-white"
                      : "border-[#FFE5EC] bg-white text-gray-400"
                  }`}
                >
                  <step.icon size={20} />
                </div>

                <p
                  className={`text-sm mt-2 ${
                    index <= activeStep ? "text-[#F4A4B4]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-[#F4A4B4] text-white rounded-lg hover:bg-[#ffb5c4] transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
      DETAILS MODAL
  ------------------------------------------------------- */
  if (modalType === "details") {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative border border-[#FFE5EC]">

          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-[#F4A4B4]"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          <h3 className="text-lg font-semibold text-[#F4A4B4] mb-4">
            Order Details
          </h3>

          <ul className="text-gray-600 space-y-2">
            <li><strong>Order ID:</strong> {order.id}</li>
            <li><strong>Status:</strong> {order.status}</li>
            <li><strong>Expected Arrival:</strong> {formattedETA}</li>

            {/* Shipping address does NOT exist, so remove it */}
          </ul>

          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-[#F4A4B4] text-white rounded-lg hover:bg-[#ffb5c4] transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
