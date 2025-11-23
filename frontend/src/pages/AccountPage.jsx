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

import OrderTrackingModal from "../components/OrdersModal";
import fragrance1 from "../resources/fragrance1.jpg";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import useWishlistContext from "../reusables/useWishlistContext";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [modalType, setModalType] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { wishlist, loading: wishlistLoading, removeFromWishlist } = useWishlistContext();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null); // ✅ ADDED MISSING STATE
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);


  useEffect(() => {
    if (!storedUser?.id) return;

    setOrdersLoading(true);

    fetch(`http://localhost:5000/api/orders/user/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserOrders(
          data.map((order) => {
            const items = order.product.map((p) => ({
              ...p,
              name: p.product_id?.name || "Product",
              img: p.product_id?.image || fragrance1,
            }));

            const total = items.reduce((s, i) => s + i.amount * i.price, 0);

            return {
              ...order,          // ← Keep entire DB order object
              items,
              total,
              date: new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
            };
          })
        );
      })

      .catch((err) => console.error("Failed to fetch user orders:", err))
      .finally(() => setOrdersLoading(false));

  }, [storedUser?.id]);



  const [addressForm, setAddressForm] = useState({
    _id: null, // ✅ CHANGED from user_id initially
    addressName: "",
    fullname: "",
    phone: "",
    street: "",
    city: "",
    postal: "",
    country: "",
    isDefault: false,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  };

  const [userForm, setUserForm] = useState({
    fname: storedUser?.fname || "",
    lname: storedUser?.lname || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    birthday: formatDate(storedUser?.birthday),
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  useEffect(() => {
    if (!storedUser?.id) return;

    fetch(`http://localhost:5000/api/address/all/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch((err) => console.error("Failed to fetch addresses:", err));
  }, [storedUser]);


  const handleSaveAddress = async () => {
    try {
      if (!storedUser?.id) {
        alert("User info missing.");
        return;
      }

      // Build base payload
      const basePayload = {
        user_id: storedUser.id,
        addressName: addressForm.addressName,
        fullname: addressForm.fullname,
        phone: addressForm.phone,
        street: addressForm.street,
        city: addressForm.city,
        postal: addressForm.postal,
        country: addressForm.country,
        tag: addressForm.isDefault ? "default" : "",
      };

      // Only include _id if editing (not null)
      const payload = addressForm._id
        ? { ...basePayload, _id: addressForm._id }
        : basePayload;

      // Decide if creating new or editing
      const url = addressForm._id
        ? `http://localhost:5000/api/address/edit/${addressForm._id}`
        : "http://localhost:5000/api/address/add";
      const method = addressForm._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save address");
        return;
      }

      // Update local list dynamically
      setAddresses((prev) => {
        if (addressForm._id) {
          // Update existing
          return prev.map((a) => (a._id === data._id ? data : a));
        }
        // Add new
        return [...prev, data];
      });

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
      alert("An error occurred while saving address.");
    }
  };


  const handleDeleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await fetch(`http://localhost:5000/api/address/delete/${id}`, {
        method: "DELETE",
      });

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
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        alert("User info missing. Please log in again.");
        return;
      }

      const payload = {
        fname: userForm.fname,
        lname: userForm.lname,
        email: userForm.email,
        phone: userForm.phone ? Number(userForm.phone) : null,
        birthday: userForm.birthday ? new Date(userForm.birthday) : null,
      };

      const response = await fetch(`http://localhost:5000/api/users/edit/${storedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to update user info.");
        return;
      }

      const updatedUser = {
        ...storedUser,
        ...result.user,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("User info updated successfully!");
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating user info.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.token) {
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

      const payload = {
        currentPassword: passwordForm.currentPassword.trim(),
        newPassword: passwordForm.newPassword.trim(),
      };

      const response = await fetch(`http://localhost:5000/api/users/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to update password.");
        return;
      }

      alert("Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const orders = [
    {
      id: "ORD-001234",
      date: "October 20, 2025",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-700",
      items: [
        { name: "Marshmallow Glow Serum", qty: 2, price: 48, img: fragrance1 },
        { name: "Cloud Blush Palette", qty: 1, price: 36, img: fragrance1 },
      ],
      total: 156,
    },
    {
      id: "ORD-001189",
      date: "October 5, 2025",
      status: "In Transit",
      statusColor: "bg-blue-100 text-blue-700",
      items: [{ name: "Pink Dream Collection", qty: 1, price: 89, img: fragrance1 }],
      total: 89,
    },
    {
      id: "ORD-001143",
      date: "September 28, 2025",
      status: "Processing",
      statusColor: "bg-amber-100 text-amber-700",
      items: [{ name: "Soft Touch Lipstick Set", qty: 1, price: 42, img: fragrance1 }],
      total: 42,
    },
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-pink-50 py-20 px-4 md:px-10">
        {/* Page Header */}
        <div className="text-center md:text-left w-full max-w-6xl mt-15 mb-8">
          <h1 className="text-3xl mx-0 md:mx-30 md:text-4xl font-meduim text-[#4A3B47]">
            My Account
          </h1>
          <p className="text-gray-500 mx-0 md:mx-30">Manage your profile and orders</p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className="bg-white rounded-2xl h-100 shadow-sm p-6 flex flex-col items-center w-full md:w-1/4">
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
              {storedUser.fname} {storedUser.lname}
            </h2>
            <p className="text-gray-500 text-sm text-center break-all">{storedUser.email}</p>

            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                <span>Orders</span>
                <span className="bg-white px-2 rounded-full font-medium">3</span>
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
              <LogOut size={16} />
              Sign Out
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
                  className={`flex items-center justify-center md:justify-between cursor-pointer gap-2 px-4 md:px-15 py-1 whitespace-nowrap transition ${activeTab === tab.id
                    ? "bg-white rounded-full text-gray-800 shadow-sm"
                    : "text-gray-600 hover:bg-rose-100 rounded-full"
                    }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Personal Information</h3>
                <p className="text-gray-500 mb-6">Update your personal details</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <p className="font-medium text-gray-600 mb-1">First Name</p>
                    <input
                      type="text"
                      value={userForm.fname}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, fname: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1 border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Last Name</p>
                    <input
                      type="text"
                      value={userForm.lname}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, lname: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1 border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Email</p>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1 border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Phone</p>
                    <input
                      type="tel"
                      value={userForm.phone}
                      onChange={(e) => {
                        let input = e.target.value.replace(/\D/g, "");
                        if (input.length > 11) input = input.slice(0, 11);
                        setUserForm((prev) => ({ ...prev, phone: input }));
                      }}
                      className="bg-white w-full sm:w-80 px-4 py-1 border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Birthday</p>
                    <input
                      type="date"
                      value={userForm.birthday}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, birthday: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1 border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                    />
                  </div>
                </div>

                <button
                  className="mt-8 bg-[#f4a4b4] text-[#4A3B47] px-6 py-2 rounded-lg hover:bg-[#f28ba3] transition"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* ORDERS TAB */}
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
                    <div key={order.id} className="border border-rose-100 rounded-xl p-5 bg-white">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2 sm:mb-0">Order {order.id}</h4>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{order.date}</p>

                      ```
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.img || fragrance1}
                                alt={item.name}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-700">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                              </div>
                            </div>
                            <p className="text-gray-800">
                              ${(item.qty * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="border-t mt-4 pt-3 flex justify-between text-sm text-gray-600">
                        <span>Total</span>
                        <span className="text-rose-500 font-semibold">
                          ${order.total.toFixed(2)}
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
                ```

              </div>
            )}



            {/* WISHLIST */}
            {activeTab === "wishlist" && (
              <div>
                {wishlist.length === 0 ? (
                  <div className="flex bg-white rounded-2xl flex-col items-center justify-center h-64 text-gray-500">
                    <Heart size={40} className="mb-2" />
                    <p className="text-lg font-medium italic">Your wishlist is empty</p>
                    <p className="text-sm mt-2">Start adding your favorite products!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item, index) => (
                      <div key={index} className="bg-white rounded-xl shadow flex flex-col">
                        <div className="w-full rounded-xl overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-[60vh] object-cover mb-4" />
                        </div>
                        <div className="flex p-4 gap-5">
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-rose-500 font-bold mt-2">${item.price}</p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <button className="flex items-center gap-2 text-rose-600 bg-rose-50 justify-center hover:bg-rose-200 px-4 py-1 rounded-full transition">
                              <ShoppingCart size={14} />
                              Add
                            </button>
                            <button className="flex items-center gap-2 bg-white justify-center text-rose-600 px-4 py-1 rounded-full hover:bg-rose-100 transition">
                              <Trash size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                {addresses.length > 0 ? (
                  addresses.map((entry) => (
                    <div key={entry._id} className="border border-rose-100 rounded-xl p-6 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800">{entry.addressName || "Address"}</h4>
                        {entry.tag === "default" && (
                          <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="bg-[#ffeee880] rounded-lg p-4 text-gray-700 space-y-1 text-sm">
                        <p>{entry.fullname}</p>
                        <p>{entry.street}</p>
                        <p>{entry.city}</p>
                        <p>{entry.postal}</p>
                        <p>{entry.country}</p>
                        {entry.phone && <p>{entry.phone}</p>}
                      </div>

                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => handleEditAddress(entry)}
                          className="bg-[#ffeee880] border border-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(entry._id)}
                          className="bg-[#ffeee880] border border-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center">No addresses added yet.</p>
                )}

                {/* ✅ UPDATED: ADD BUTTON RESETS FORM */}
                <button
                  onClick={() => {
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
                    setShowAddressModal(true);
                  }}
                  className="w-full bg-[#f4a4b4] text-[#4A3B47] py-2 rounded-xl hover:bg-rose-600 transition"
                >
                  Add New Address
                </button>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-10">
                {/* Password & Security */}
                <section className="bg-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Password & Security</h3>
                  <p className="text-gray-500 mb-6">Manage your login credentials</p>

                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f4a4b4]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f4a4b4]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f4a4b4]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="mt-6 bg-[#f4a4b4] text-[#4A3B47] px-6 py-1 rounded-lg hover:bg-[#f4a4b4]/80 transition"
                  >
                    Update Password
                  </button>
                </section>

                {/* Email Preferences */}
                <section className="bg-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Preferences</h3>
                  <p className="text-gray-500 mb-6">Choose what updates you want to receive</p>

                  <div className="space-y-4">
                    {[
                      { label: "Order Updates", description: "Get notified about your orders" },
                      { label: "Promotions & Offers", description: "Receive special deals and offers" },
                      { label: "New Products", description: "Be the first to know about new arrivals" },
                    ].map((pref, index) => (
                      <label key={index} className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-700">{pref.label}</p>
                          <p className="text-sm text-gray-500">{pref.description}</p>
                        </div>
                        <input type="checkbox" className="mt-1 h-4 w-4 bg-white" />
                      </label>
                    ))}
                  </div>
                </section>

                {/* Danger Zone */}
                <section className="border border-red-200 p-5 rounded-xl bg-white">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Danger Zone</h3>
                  <p className="text-gray-500 mb-4">Irreversible account actions</p>

                  <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                    Delete Account
                  </button>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>

      {modalType && selectedOrder && (
        <OrderTrackingModal
          modalType={modalType}
          order={selectedOrder}
          onClose={() => {
            setModalType(null);
            setSelectedOrder(null);
          }}
        />
      )}


      {showAddressModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {addressForm._id ? "Edit Address" : "Add New Address"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Address Name (e.g. Home, Office)"
                value={addressForm.addressName}
                onChange={(e) => setAddressForm({ ...addressForm, addressName: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="Full Name"
                value={addressForm.fullname}
                onChange={(e) => setAddressForm({ ...addressForm, fullname: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <input
                type="number"
                placeholder="Phone Number"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="Street Address"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <input
                type="number"
                placeholder="Postal Code"
                value={addressForm.postal}
                onChange={(e) => setAddressForm({ ...addressForm, postal: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="Country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />

              {/* DEFAULT ADDRESS SWITCH */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-gray-700 font-medium">Set as Default Address</span>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="sr-only peer"
                  />

                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-pink-400 transition-all"></div>

                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                </label>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
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
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-[#f4a4b4] text-[#4A3B47] rounded-lg hover:bg-rose-600"
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