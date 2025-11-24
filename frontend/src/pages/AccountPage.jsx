import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Camera,
  Trash,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import OrderTrackingModal from "../components/OrdersModal";
import useWishlistContext from "../reusables/useWishlistContext";
import fragrance1 from "../resources/fragrance1.jpg";

export default function AccountPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlistContext();

  const [storedUser, setStoredUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [modalType, setModalType] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    fname: storedUser?.fname || "",
    lname: storedUser?.lname || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    birthday: storedUser?.birthday ? storedUser.birthday.split("T")[0] : "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressForm, setAddressForm] = useState({
    _id: null,
    addressName: "",
    fullname: "",
    phone: "",
    street: "",
    city: "",
    postal: "",
    country: "",
    isDefault: false,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!storedUser?.id) navigate("/login");
  }, [storedUser, navigate]);

  // Fetch user orders
  useEffect(() => {
    if (!storedUser?.id) return;

    setOrdersLoading(true);
    fetch(`http://localhost:5000/api/orders/user/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) =>
        setUserOrders(
          data.map((order) => {
            const items = order.product.map((p) => ({
              ...p,
              name: p.product_id?.name || "Product",
              img: p.product_id?.image || fragrance1,
            }));
            const total = items.reduce((s, i) => s + i.amount * i.price, 0);
            return {
              ...order,
              items,
              total,
              date: new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
            };
          })
        )
      )
      .catch((err) => console.error("Failed to fetch user orders:", err))
      .finally(() => setOrdersLoading(false));
  }, [storedUser?.id]);

  // Fetch user addresses
  useEffect(() => {
    if (!storedUser?.id) return;

    fetch(`http://localhost:5000/api/address/all/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch((err) => console.error("Failed to fetch addresses:", err));
  }, [storedUser?.id]);

  // Save or edit address
  const handleSaveAddress = async () => {
    if (!storedUser?.id) {
      alert("User info missing.");
      return;
    }

    const payload = {
      user_id: storedUser.id,
      addressName: addressForm.addressName,
      fullname: addressForm.fullname,
      phone: addressForm.phone,
      street: addressForm.street,
      city: addressForm.city,
      postal: addressForm.postal,
      country: addressForm.country,
      tag: addressForm.isDefault ? "default" : "",
      ...(addressForm._id && { _id: addressForm._id }),
    };

    const url = addressForm._id
      ? `http://localhost:5000/api/address/edit/${addressForm._id}`
      : "http://localhost:5000/api/address/add";
    const method = addressForm._id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save address");

      setAddresses((prev) =>
        addressForm._id ? prev.map((a) => (a._id === data._id ? data : a)) : [...prev, data]
      );

      setShowAddressModal(false);
      setEditingId(null);
      setAddressForm({
        _id: null,
        addressName: "",
        fullname: "",
        phone: "",
        street: "",
        city: "",
        postal: "",
        country: "",
        isDefault: false,
      });
      alert("Address saved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await fetch(`http://localhost:5000/api/address/delete/${id}`, { method: "DELETE" });
      setAddresses(addresses.filter((a) => a._id !== id));
      alert("Address deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete address.");
    }
  };

  const handleEditAddress = (entry) => {
    setAddressForm({
      _id: entry._id,
      addressName: entry.addressName || "",
      fullname: entry.fullname || "",
      phone: entry.phone || "",
      street: entry.street || "",
      city: entry.city || "",
      postal: entry.postal || "",
      country: entry.country || "",
      isDefault: entry.tag === "default",
    });
    setEditingId(entry._id);
    setShowAddressModal(true);
  };

  const handleSaveChanges = async () => {
    if (!storedUser?.id) {
      alert("User info missing. Please log in again.");
      return;
    }

    const payload = {
      fname: userForm.fname,
      lname: userForm.lname,
      email: userForm.email,
      phone: userForm.phone || null,
      birthday: userForm.birthday || null,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/edit/${storedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update user info");

      const updatedUser = { ...storedUser, ...result.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setStoredUser(updatedUser);
      alert("User info updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleChangePassword = async () => {
    if (!storedUser?.token) {
      alert("User info missing. Please log in again.");
      return;
    }
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword.trim(),
          newPassword: passwordForm.newPassword.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update password");

      alert("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setStoredUser(null);
    navigate("/login");
  };

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <>
      <Header />

      <div className="min-h-screen bg-pink-50 py-20 px-4 md:px-10">
        {/* Page Header */}
        <div className="text-center md:text-left w-full max-w-6xl mt-15 mb-8">
          <h1 className="text-3xl md:text-4xl font-medium text-[#4A3B47]">My Account</h1>
          <p className="text-gray-500">Manage your profile and orders</p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center w-full md:w-1/4">
            <div className="relative">
              <img
                src={fragrance1}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-pink-100 p-2 rounded-full hover:bg-pink-200 transition">
                <Camera size={16} className="text-gray-700" />
              </button>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800 text-center">
              {storedUser?.fname} {storedUser?.lname}
            </h2>
            <p className="text-gray-500 text-sm text-center break-all">{storedUser?.email}</p>

            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                <span>Orders</span>
                <span className="bg-white px-2 rounded-full font-medium">{userOrders.length}</span>
              </div>
              <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                <span>Wishlist</span>
                <span className="bg-white px-2 rounded-full font-medium">{wishlist.length}</span>
              </div>
            </div>

            <button
              className="mt-6 flex items-center gap-2 bg-rose-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-rose-200 transition text-sm"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full">
            {/* Tabs */}
            <div className="flex overflow-x-auto bg-[#ffeee8] rounded-full justify-center md:justify-evenly text-[#4A3B47] mb-6 p-1 space-x-2">
              {[
                { id: "profile", label: "Profile", icon: <User size={15} /> },
                { id: "orders", label: "Orders", icon: <Package size={15} /> },
                { id: "wishlist", label: "Wishlist", icon: <Heart size={15} /> },
                { id: "addresses", label: "Addresses", icon: <MapPin size={15} /> },
                { id: "settings", label: "Settings", icon: <Settings size={15} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center md:justify-between cursor-pointer gap-2 px-4 md:px-15 py-1 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "bg-white rounded-full text-gray-800 shadow-sm"
                      : "text-gray-600 hover:bg-rose-100 rounded-full"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ------------------- PROFILE TAB ------------------- */}
            {activeTab === "profile" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Personal Information</h3>
                <p className="text-gray-500 mb-6">Update your personal details</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                  {["fname", "lname", "email", "phone", "birthday"].map((field) => (
                    <div key={field}>
                      <p className="font-medium text-gray-600 mb-1">
                        {field === "fname"
                          ? "First Name"
                          : field === "lname"
                          ? "Last Name"
                          : field === "email"
                          ? "Email"
                          : field === "phone"
                          ? "Phone"
                          : "Birthday"}
                      </p>
                      <input
                        type={field === "email" ? "email" : field === "birthday" ? "date" : "text"}
                        value={userForm[field]}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            [field]:
                              field === "phone"
                                ? e.target.value.replace(/\D/g, "").slice(0, 11)
                                : e.target.value,
                          }))
                        }
                        className="bg-white w-full sm:w-80 px-4 py-1 border-2 border-none rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="mt-8 bg-[#f4a4b4] text-[#4A3B47] px-6 py-2 rounded-lg hover:bg-[#f28ba3] transition"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* ------------------- ORDERS TAB ------------------- */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {ordersLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-gray-500">Loading orders...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-32 text-gray-500">
                    <Package size={40} className="mb-2 text-gray-400" />
                    <p className="text-lg font-medium italic">You have no orders yet.</p>
                    <p className="text-sm mt-1">Start shopping to place your first order!</p>
                  </div>
                ) : (
                  userOrders.map((order) => (
                    <div key={order._id} className="border border-rose-100 rounded-xl p-5 bg-white">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-0">
                          Order {order.order_id}
                        </h4>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{new Date(order.eta).toLocaleDateString()}</p>
                      {/* Products */}
                      <div className="space-y-3">
                        {order.product.map((item, index) => (
                          <div key={index} className="flex justify-between items-center flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product_id?.image || fragrance1}
                                alt={item.product_id?.name}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-700">
                                  {item.product_id?.name || "Unknown Product"}
                                </p>
                                <p className="text-sm text-gray-500">Qty: {item.amount}</p>
                              </div>
                            </div>
                            <p className="text-gray-800">${(item.price * item.amount).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t mt-4 pt-3 flex justify-between text-sm text-gray-600">
                        <span>Total</span>
                        <span className="text-rose-500 font-semibold">
                          ${order.product.reduce((sum, i) => sum + i.price * i.amount, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalType("details");
                          }}
                          className="flex-1 bg-rose-100 py-2 rounded-lg text-gray-700 hover:bg-rose-200 transition"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalType("tracking");
                          }}
                          className="flex-1 bg-rose-100 py-2 rounded-lg text-gray-700 hover:bg-rose-200 transition"
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ------------------- WISHLIST TAB ------------------- */}
            {activeTab === "wishlist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.length === 0 ? (
                  <p className="text-gray-500 col-span-full text-center py-10">Your wishlist is empty.</p>
                ) : (
                  wishlist.map((item) => (
                    <div key={item._id} className="bg-white p-3 rounded-lg shadow-sm flex flex-col gap-3">
                      <img
                        src={item.image || fragrance1}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      <div className="flex justify-between items-center mt-auto gap-2">
                        <button
                          className="flex-1 flex items-center justify-center gap-1 text-rose-600 bg-rose-50 py-1 rounded-full hover:bg-rose-200 transition text-sm"
                          onClick={() => alert("Add to cart logic here")}
                        >
                          <ShoppingCart size={14} />
                          Add
                        </button>
                        <button
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                          onClick={() => removeFromWishlist(item._id)}
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ------------------- ADDRESSES TAB ------------------- */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-rose-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-rose-200 transition"
                    onClick={() => setShowAddressModal(true)}
                  >
                    Add Address
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-10">No addresses yet.</p>
                  ) : (
                    addresses.map((a) => (
                      <div
                        key={a._id}
                        className="border border-rose-100 p-4 rounded-lg bg-white flex flex-col gap-2"
                      >
                        <h4 className="font-semibold text-gray-800">{a.addressName}</h4>
                        <p className="text-gray-500 text-sm">{a.fullname}</p>
                        <p className="text-gray-500 text-sm">{a.phone}</p>
                        <p className="text-gray-500 text-sm">{`${a.street}, ${a.city}, ${a.postal}, ${a.country}`}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            className="bg-rose-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-rose-200 transition text-sm"
                            onClick={() => handleEditAddress(a)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition text-sm"
                            onClick={() => handleDeleteAddress(a._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ------------------- SETTINGS TAB ------------------- */}
            {activeTab === "settings" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Change Password</h3>
                <p className="text-gray-500 mb-6">Update your account password</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                  {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                    <div key={field}>
                      <p className="font-medium text-gray-600 mb-1">
                        {field === "currentPassword"
                          ? "Current Password"
                          : field === "newPassword"
                          ? "New Password"
                          : "Confirm Password"}
                      </p>
                      <input
                        type="password"
                        value={passwordForm[field]}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                        className="bg-white w-full sm:w-80 px-4 py-1 border-2 border-none rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="mt-8 bg-[#f4a4b4] text-[#4A3B47] px-6 py-2 rounded-lg hover:bg-[#f28ba3] transition"
                  onClick={handleChangePassword}
                >
                  Update Password
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal */}
      {modalType && selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          type={modalType}
          closeModal={() => {
            setModalType(null);
            setSelectedOrder(null);
          }}
        />
      )}

      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-semibold text-gray-800 mb-4">
              {editingId ? "Edit Address" : "Add Address"}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {[
                { key: "addressName", label: "Address Name" },
                { key: "fullname", label: "Full Name" },
                { key: "phone", label: "Phone", type: "tel" },
                { key: "street", label: "Street" },
                { key: "city", label: "City" },
                { key: "postal", label: "Postal Code" },
                { key: "country", label: "Country" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <p className="font-medium text-gray-600 mb-1">{label}</p>
                  <input
                    type={type || "text"}
                    value={addressForm[key]}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                  }
                />
                Set as default
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 transition text-gray-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
