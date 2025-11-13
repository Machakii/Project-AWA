import React, { useState } from "react";
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

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [modalType, setModalType] = useState(null); // "tracking" | "details" | null
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [userForm, setUserForm] = useState({
    fname: storedUser?.fname || "",
    lname: storedUser?.lname || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    birthday: storedUser?.birthday || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveChanges = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        alert("User info missing. Please log in again.");
        return;
      }

      // Convert empty strings to null or proper types before sending
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
          "Authorization": `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to update user info.");
        return;
      }

      // Update localStorage with backend response
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
    "Authorization": `Bearer ${storedUser.token}`,
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


  // papalitan to ng data from database, same don sa wishlist below
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
      items: [
        { name: "Pink Dream Collection", qty: 1, price: 89, img: fragrance1 },
      ],
      total: 89,
    },
    {
      id: "ORD-001143",
      date: "September 28, 2025",
      status: "Processing",
      statusColor: "bg-amber-100 text-amber-700",
      items: [
        { name: "Soft Touch Lipstick Set", qty: 1, price: 42, img: fragrance1 },
      ],
      total: 42,
    },
  ];

  const wishlist = [

  ];

  // const [userForm, setProductForm] = useState(storedUser);


  // const [birthday, setBirthday] = useState(() => {
  //   const [month, day, year] = storedUser.birthday.split("/");
  //   return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  // });


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
            <p className="text-gray-500 text-sm text-center break-all">
              {storedUser.email}
            </p>

            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                <span>Orders</span>
                <span className="bg-white px-2 rounded-full font-medium">
                  3
                </span>
              </div>
              <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                <span>Wishlist</span>
                <span className="bg-white px-2 rounded-full font-medium">
                  {wishlist.length}
                </span>
              </div>
            </div>

            <button className="mt-6 flex items-center gap-2 bg-rose-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-rose-200 transition text-sm" onClick={handleLogout}>
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
                  {/* Only show label on medium and up */}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Personal Information
                </h3>
                <p className="text-gray-500 mb-6">Update your personal details</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <p className="font-medium text-gray-600 mb-1">First Name</p>
                    <input type="text"
                      value={userForm.fname}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, fname: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1  border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"

                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Last Name</p>
                    <input type="text"
                      value={userForm.lname}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, lname: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1  border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"

                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Email</p>
                    <input type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1  border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"

                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Phone</p>
                    <input type="tel"
                      value={userForm.phone}
                      onChange={(e) => {
                        // Remove non-digit characters
                        let input = e.target.value.replace(/\D/g, "");
                        // Limit to 11 characters
                        if (input.length > 11) input = input.slice(0, 11);
                        setUserForm((prev) => ({ ...prev, phone: input }));
                      }}
                      className="bg-white w-full sm:w-80 px-4 py-1  border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"

                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 mb-1">Birthday</p>
                    <input type="date"
                      value={userForm.birthday}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, birthday: e.target.value }))}
                      className="bg-white w-full sm:w-80 px-4 py-1  border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"

                    />
                  </div>
                </div>

                <button className="mt-8 bg-[#f4a4b4] text-[#4A3B47] px-6 py-2 rounded-lg hover:bg-[#f28ba3] transition"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-rose-100 rounded-xl p-5 bg-white"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                      <h4 className="font-semibold text-gray-800 mb-2 sm:mb-0">
                        Order {order.id}
                      </h4>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{order.date}</p>

                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center flex-wrap gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-700">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.qty}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-800">${item.price}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-3 flex justify-between text-sm text-gray-600">
                      <span>Total</span>
                      <span className="text-rose-500 font-semibold">
                        ${order.total}.00
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalType("details");
                        }}
                        className="flex-1 bg-rose-100 py-2 rounded-lg text-gray-700 hover:bg-rose-200 transition">
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalType("tracking");
                        }}
                        className="flex-1 bg-rose-100 py-2 rounded-lg text-gray-700 hover:bg-rose-200 transition">
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WISHLIST */}
            {activeTab === "wishlist" && (
              <div>
                {wishlist.length === 0 ? (
                  //  Empty wishlist message
                  <div className="flex bg-white rounded-2xl flex-col items-center justify-center h-64 text-gray-500">
                    <Heart size={40} className="mb-2" />
                    <p className="text-lg font-medium italic">Your wishlist is empty</p>
                    <p className="text-sm mt-2">Start adding your favorite products!</p>
                  </div>
                ) : (
                  // Wishlist grid
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((item, index) => (
                      <div key={index} className="bg-white rounded-xl shadow flex flex-col">
                        <div className="w-full rounded-xl overflow-hidden">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-full h-[60vh] object-cover mb-4"
                          />
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
                {[
                  {
                    type: "Shipping Address",
                    isDefault: true,
                    name: "Sarah Johnson",
                    address: "123 Beauty Lane",
                    city: "Los Angeles, CA 90001",
                    country: "United States",
                    phone: "+1 (555) 123-4567",
                  },
                  {
                    type: "Billing Address",
                    isDefault: true,
                    name: "Sarah Johnson",
                    address: "123 Beauty Lane",
                    city: "Los Angeles, CA 90001",
                    country: "United States",
                    phone: null,
                  },
                ].map((entry, index) => (
                  <div key={index} className="border border-rose-100 rounded-xl p-6 bg-white">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">{entry.type}</h4>
                      {entry.isDefault && (
                        <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="bg-[#ffeee880] rounded-lg p-4 text-gray-700 space-y-1 text-sm">
                      <p>{entry.name}</p>
                      <p>{entry.address}</p>
                      <p>{entry.city}</p>
                      <p>{entry.country}</p>
                      {entry.phone && <p>{entry.phone}</p>}
                    </div>

                    <div className="flex gap-4 mt-4">
                      <button className="bg-[#ffeee880] border border-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-100 transition">
                        Edit
                      </button>
                      <button className="bg-[#ffeee880] border border-gray-300 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-100 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                <button className="w-full bg-[#f4a4b4] text-[#4A3B47] py-2 rounded-xl hover:bg-rose-600 transition">
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
                      <input type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f4a4b4]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f4a4b4]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full border border-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f4a4b4]" />
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="mt-6 bg-[#f4a4b4] text-[#4A3B47] px-6 py-1 rounded-lg hover:bg-[#f4a4b4]/80 transition">
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
                        <div >
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

    </>
  );
}
