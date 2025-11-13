import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    Package,
    Settings,
    Camera,
    LogOut,
    Plus,
    Edit2,
    Trash2,
    Eye,
} from "lucide-react";

import fragrance1 from "../resources/fragrance1.jpg";

export default function AdminAccount() {    
    const [activeTab, setActiveTab] = useState("products");
    const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
    
    // Mock data
    const [products, setProducts] = useState([
        { id: "p1", name: "Rose Perfume", price: 24.99, stock: 12, image: fragrance1 },
        { id: "p2", name: "Citrus Body Mist", price: 14.5, stock: 30, image: fragrance1 },
    ]);

    const [orders] = useState([
        { id: "o1", customer: "Jane Doe", productId: "p1", total: 24.99, status: "Processing" },
        { id: "o2", customer: "Mark Lee", productId: "p2", total: 14.5, status: "Shipped" },
    ]);

    const [users, setUsers] = useState([
        { id: "u1", name: "Sarah Johnson", email: "sarahjohnson@email.com", role: "Customer", image: fragrance1 },
        { id: "u2", name: "Admin User", email: "admin@example.com", role: "Admin", image: fragrance1 },
    ]);

    // Product form state
    const emptyProduct = { id: null, name: "", price: "", stock: "", image: "" };
    const [productForm, setProductForm] = useState(emptyProduct);
    const [editingProduct, setEditingProduct] = useState(null);
    const resetProductForm = () => setProductForm(emptyProduct);

    // Handle product image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductForm((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Add product
    const handleAddProduct = () => {
        if (!productForm.name) return;
        const newProduct = {
            id: `p${Date.now()}`,
            name: productForm.name,
            price: parseFloat(productForm.price) || 0,
            stock: parseInt(productForm.stock) || 0,
            image: productForm.image || fragrance1,
        };
        setProducts((prev) => [newProduct, ...prev]);
        resetProductForm();
    };

    // Start editing
    const handleStartEdit = (p) => {
        setEditingProduct(p.id);
        setProductForm({
            id: p.id,
            name: p.name,
            price: String(p.price),
            stock: String(p.stock),
            image: p.image,
        });
    };

    // Save edited product
    const handleSaveEdit = () => {
        setProducts((list) =>
            list.map((p) =>
                p.id === editingProduct
                    ? {
                        ...p,
                        ...productForm,
                        price: parseFloat(productForm.price),
                        stock: parseInt(productForm.stock),
                    }
                    : p
            )
        );
        setEditingProduct(null);
        resetProductForm();
    };

    // Delete product
    const handleDeleteProduct = (id) => {
        if (confirm("Delete this product?")) {
            setProducts((list) => list.filter((p) => p.id !== id));
        }
    };

    // Toggle user role
    const handleToggleRole = (id) => {
        setUsers((list) =>
            list.map((u) =>
                u.id === id
                    ? { ...u, role: u.role === "Admin" ? "Customer" : "Admin" }
                    : u
            )
        );
    };

    // Delete user
    const handleDeleteUser = (id) => {
        if (confirm("Remove this user?")) {
            setUsers((list) => list.filter((u) => u.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 py-20 px-4 md:px-8">
            {/* Header */}
            <div className="text-center md:text-left w-full max-w-6xl mb-8">
                <h1 className="text-3xl md:text-4xl font-medium text-[#4A3B47]">My Account</h1>
                <p className="text-gray-500">Manage your profile, products, orders and users</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
                {/* Sidebar */}
                <aside className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center w-full md:w-1/4">
                    <div className="relative">
                        <img src={fragrance1} alt="Profile" className="w-28 h-28 rounded-full object-cover" />
                        <button className="absolute bottom-0 right-0 bg-pink-100 p-2 rounded-full hover:bg-pink-200 transition">
                            <Camera size={16} className="text-gray-700" />
                        </button>
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-gray-800 text-center">{storedUser.fname} {storedUser.lname}</h2>
                    <p className="text-gray-500 text-sm text-center break-all">{storedUser.email}</p>

                    <div className="mt-6 w-full space-y-3">
                        <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                            <span>Orders</span>
                            <span className="bg-white px-2 rounded-full font-medium">{orders.length}</span>
                        </div>
                        <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                            <span>Products</span>
                            <span className="bg-white px-2 rounded-full font-medium">{products.length}</span>
                        </div>
                        <div className="flex justify-between bg-rose-50 px-4 py-2 rounded-lg text-gray-700 text-sm">
                            <span>Users</span>
                            <span className="bg-white px-2 rounded-full font-medium">{users.length}</span>
                        </div>
                    </div>

                    <button className="mt-6 flex items-center gap-2 bg-rose-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-rose-200 transition text-sm" onClick={handleLogout}>
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </aside>

                {/* Main */}
                <main className="flex-1 w-full">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto bg-[#ffeee8] rounded-full justify-center md:justify-evenly text-[#4A3B47] mb-6 p-1 space-x-2">
                        {[
                            { id: "dashboard", label: "Dashboard", icon: <User size={15} /> },
                            { id: "products", label: "Products", icon: <Package size={15} /> },
                            { id: "orders", label: "Orders", icon: <Package size={15} /> },
                            { id: "users", label: "Users", icon: <User size={15} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center justify-center md:justify-between cursor-pointer gap-2 px-4 py-1 whitespace-nowrap transition ${activeTab === tab.id
                                    ? "bg-white rounded-full text-gray-800 shadow-sm"
                                    : "text-gray-600 hover:bg-rose-100 rounded-full"
                                    }`}
                            >
                                {tab.icon}
                                <span className="hidden md:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* DASHBOARD MEN */}
                    {activeTab === "dashboard" && (
                        <section className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Dashboard</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-rose-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Orders</div>
                                    <div className="mt-2 text-2xl font-bold text-gray-800">{orders.length}</div>
                                </div>
                                <div className="bg-rose-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Products</div>
                                    <div className="mt-2 text-2xl font-bold text-gray-800">{products.length}</div>
                                </div>
                                <div className="bg-rose-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Users</div>
                                    <div className="mt-2 text-2xl font-bold text-gray-800">{users.length}</div>
                                </div>
                            </div>
                        </section>
                    )}


                    {/* PRODUCTS TAB */}
                    {activeTab === "products" && (
                        <section className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Products</h3>
                            </div>

                            {/* Add / Edit Form */}
                            <div className="mb-6 border border-rose-50 p-4 rounded-lg">


                                {/* Image Upload */}
                                <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
                                    <label className="flex items-center gap-2 cursor-pointer text-gray-700 bg-rose-100 px-3 py-2 rounded-lg hover:bg-rose-200 transition">
                                        <Camera size={16} />
                                        Upload Image
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                    {productForm.image && (
                                        <img
                                            src={productForm.image}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                                    <input
                                        value={productForm.name}
                                        onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))}
                                        className="px-3 py-2 text-black rounded-lg border"
                                        placeholder="Product name"
                                    />
                                    <input
                                        value={productForm.price}
                                        onChange={(e) => setProductForm((s) => ({ ...s, price: e.target.value }))}
                                        className="px-3 py-2 text-black rounded-lg border"
                                        placeholder="Price"
                                        type="number"
                                        step="0.01"
                                    />
                                    <input
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm((s) => ({ ...s, stock: e.target.value }))}
                                        className="px-3 py-2 text-black rounded-lg border"
                                        placeholder="Stock"
                                        type="number"
                                    />
                                </div>



                                {/* Buttons */}
                                <div className="mt-3 flex gap-2">
                                    {editingProduct ? (
                                        <>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="bg-pink-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    resetProductForm();
                                                    setEditingProduct(null);
                                                }}
                                                className="bg-gray-100 px-4 py-2 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleAddProduct}
                                            className="flex items-center gap-2 bg-rose-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-rose-200 transition text-sm"
                                        >
                                            <Plus size={14} />
                                            Add Product
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Product List */}
                            <div className="space-y-3">
                                {products.map((p) => (
                                    <div
                                        key={p.id}
                                        className="flex flex-col gap-3 items-center justify-between md:flex-row bg-rose-50 p-3 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            {p.image && (
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-800">{p.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    ${p.price.toFixed(2)} • Stock: {p.stock}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleStartEdit(p)}
                                                className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === "orders" && (
                        <section className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Orders</h3>
                            <div className="space-y-3">
                                {orders.map((o) => {
                                    const orderedProduct = products.find((p) => p.id === o.productId);
                                    return (
                                        <div
                                            key={o.id}
                                            className="flex flex-col items-center md:flex-row justify-between bg-rose-50 p-3 rounded-lg"
                                        >
                                            <div className="flex flex-col gap-3 text-center md:text-left md:flex-row items-center">
                                                {orderedProduct?.image && (
                                                    <img
                                                        src={orderedProduct.image}
                                                        alt={orderedProduct.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <div className="flex justify-center md:justify-start font-medium text-gray-800">
                                                        <p>#{o.id}</p>
                                                        <p>— {o.customer}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1 justify-center md:justify-start md:flex-row text-gray-800">
                                                        <p>Product: {orderedProduct?.name || "Unknown"}</p>
                                                        <p>• ${o.total.toFixed(2)}</p>
                                                        <p>• Status: {o.status}</p>
                                                    </div>
                                                
                                                </div>
                                            </div>
                                            <button className="flex items-center mt-4 text-black gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50">
                                                <Eye size={14} /> View
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* USERS TAB */}
                    {activeTab === "users" && (
                        <section className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Users</h3>
                            <div className="space-y-3">
                                {users.map((u) => (
                                    <div
                                        key={u.id}
                                        className="flex flex-col items-center justify-between md:flex-row bg-rose-50 p-3 rounded-lg"
                                    >
                                        <div className="flex flex-col items-center text-center md:flex-row md:text-left gap-3">
                                            {u.image && (
                                                <img
                                                    src={u.image}
                                                    alt={u.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-800">{u.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    {u.email} • Role:{" "}
                                                    <span className="font-semibold">{u.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleRole(u.id)}
                                                className="px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50"
                                            >
                                                {u.role === "Admin" ? "Revoke Admin" : "Make Admin"}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </main>
            </div>
        </div>
    );
}
