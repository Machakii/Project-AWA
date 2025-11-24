import { useEffect, useState } from "react";
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
import useProducts from "../reusables/useProducts";

export default function AdminAccount() {
    const [activeTab, setActiveTab] = useState("products");
    const [modalOpen, setModalOpen] = useState(false);
    const { products, setProducts } = useProducts();
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);


    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setOrderModalOpen(true);
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/all", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Response error:", errorText);
                    throw new Error(`Failed to fetch users: ${res.status} - ${errorText}`);
                }

                const data = await res.json();
                console.log("Fetched users:", data); // Debug log

                // Ensure data is an array
                if (Array.isArray(data)) {
                    setUsers(data);
                    console.log("Users set successfully:", data.length);
                } else if (data.users && Array.isArray(data.users)) {
                    // In case your backend returns { users: [...] }
                    setUsers(data.users);
                    console.log("Users set successfully:", data.users.length);
                } else {
                    console.warn("Unexpected data format:", data);
                    setUsers([]);
                }
            } catch (err) {
                console.error("Fetch users error:", err);
                console.error("Full error details:", err);
            }
        };

        const fetchOrders = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/orders/all", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Orders response error:", errorText);
                    throw new Error(`Failed to fetch orders: ${res.status} - ${errorText}`);
                }

                const data = await res.json();
                console.log("Fetched orders:", data);

                if (Array.isArray(data)) {
                    setOrders(data);
                    console.log("Orders set successfully:", data.length);
                } else {
                    console.warn("Unexpected orders data format:", data);
                    setOrders([]);
                }
            } catch (err) {
                console.error("Fetch orders error:", err);
            }
        };

        fetchUsers();
        fetchOrders();
    }, [])


    const handleDeleteUser = async (id) => {
        if (!confirm("Remove this user?")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to delete user: ${errorText}`);
            }

            setUsers(prev => prev.filter(u => u._id !== id));
            alert("User deleted successfully!");
        } catch (err) {
            console.error("Delete user error:", err);
            alert(`Failed to delete user: ${err.message}`);
        }
    };






    // Product form state
    const emptyProduct = { id: null, name: "", price: "", stock: "", image: "" };
    const [productForm, setProductForm] = useState(emptyProduct);
    const [editingProduct, setEditingProduct] = useState(null);
    const resetProductForm = () => setProductForm(emptyProduct);

    // Handle product image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProductForm(prev => ({ ...prev, imageFile: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setProductForm(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };


    // Add product
    const handleAddProduct = async () => {
        try {
            const formData = new FormData();
            formData.append("name", productForm.name);
            formData.append("category", productForm.category || "");
            formData.append("price", productForm.price);
            formData.append("stock", productForm.stock);
            formData.append("tag", productForm.tag || "");
            formData.append("description", productForm.description || "");
            formData.append("note", productForm.note || "");
            formData.append("returnPolicy", productForm.returnPolicy || "");
            formData.append("sizes", JSON.stringify(productForm.sizes || []));

            if (productForm.imageFile) formData.append("image", productForm.imageFile);

            const res = await fetch("http://localhost:5000/api/products/add", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to add product");
            const saved = await res.json();

            alert("Product Added successfully!");
            setProducts(prev => [saved, ...prev]);
            resetProductForm();
        } catch (err) {
            console.error("Add error:", err);
        }
    };



    // Start editing
    const handleStartEdit = (p) => {
        setEditingProduct(p._id);
        setProductForm({
            id: p._id,
            name: p.name,
            price: String(p.price),
            stock: String(p.stock),
            image: p.image,
        });
    };

    // Save edited product
    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", productForm.name);
            formData.append("category", productForm.category || "");
            formData.append("price", productForm.price);
            formData.append("stock", productForm.stock);
            formData.append("tag", productForm.tag || "");
            formData.append("description", productForm.description || "");
            formData.append("note", productForm.note || "");
            formData.append("returnPolicy", productForm.returnPolicy || "");
            formData.append("sizes", JSON.stringify(productForm.sizes || []));

            if (productForm.imageFile) formData.append("image", productForm.imageFile);

            const res = await fetch(`http://localhost:5000/api/products/edit/${editingProduct}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to edit product");
            const updated = await res.json();

            setProducts(prev => prev.map(p => (p._id === editingProduct ? updated : p)));

            alert("Product Edited successfully!");
            setEditingProduct(null);
            resetProductForm();
        } catch (err) {
            console.error("Edit error:", err);
        }
    };



    // Delete product
    const handleDeleteProduct = async (id) => {
        if (!confirm("Delete this product?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/products/delete/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete product");
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };


    // Toggle user role
    const handleToggleRole = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/users/toggle-role/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update role: ${errorText}`);
            }

            const data = await res.json();
            setUsers(prev => prev.map(u => (u._id === id ? data.user : u)));
            alert("Role updated successfully!");
        } catch (err) {
            console.error("Toggle role error:", err);
            alert(`Failed to update role: ${err.message}`);
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
                        <section className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Products</h3>

                            {/* Add Product Button */}
                            <button
                                onClick={() => {
                                    resetProductForm();
                                    setEditingProduct(null); // clearly indicate "adding"
                                    setModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-rose-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-rose-200 transition text-sm mb-4"
                            >
                                <Plus size={14} />
                                Add Product
                            </button>

                            {/* Product List */}
                            <div className="w-full space-y-3">
                                {products.map((p) => (
                                    <div
                                        key={p._id}
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
                                                {p.sizes && p.sizes.length > 0 && (
                                                    <div className="text-sm text-gray-500">
                                                        Sizes: {p.sizes.map(s => `${s.label} ($${s.price})`).join(", ")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(p._id); // indicate "editing"
                                                    setProductForm({
                                                        ...p,
                                                        price: String(p.price),
                                                        stock: String(p.stock),
                                                        sizes: p.sizes || [],
                                                    });
                                                    setModalOpen(true); // open modal
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeleteProduct(p._id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {modalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                                    <div className="bg-white rounded-2xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                                        {/* Close button */}
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
                                        >
                                            ✕
                                        </button>

                                        {/* Scrollable content */}
                                        <div
                                            className="overflow-y-auto p-6 flex-1"
                                            style={{
                                                scrollbarWidth: "thin", // Firefox
                                                scrollbarColor: "#FBCFE8 #F3F4F6", // Firefox thumb color #FBCFE8, track #F3F4F6
                                            }}
                                        >
                                            <style>
                                                {`
            /* Chrome, Edge, Safari */
            .scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .scrollbar::-webkit-scrollbar-track {
              background: #F3F4F6; /* light gray track */
              border-radius: 9999px;
            }
            .scrollbar::-webkit-scrollbar-thumb {
              background-color: #FBCFE8; /* rose/pink thumb */
              border-radius: 9999px;
            }
            .scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #F472B6; /* darker rose on hover */
            }
          `}
                                            </style>

                                            <div className="scrollbar">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                                    {editingProduct ? "Edit Product" : "Add Product"}
                                                </h4>

                                                {/* Image Upload Centered */}
                                                <div className="flex flex-col items-center mb-6">
                                                    {productForm.image && (
                                                        <img
                                                            src={productForm.image}
                                                            alt="Preview"
                                                            className="w-32 h-32 object-cover rounded-lg border mb-3"
                                                        />
                                                    )}
                                                    <label className="flex items-center gap-2 cursor-pointer text-gray-700 bg-rose-100 px-4 py-2 rounded-lg hover:bg-rose-200 transition">
                                                        <Camera size={16} />
                                                        {editingProduct ? "Change Image" : "Upload Image"}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>

                                                {/* Product Details Inputs */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        value={productForm.name}
                                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border"
                                                        placeholder="Product Name"
                                                    />
                                                    <input
                                                        value={productForm.category}
                                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border"
                                                        placeholder="Category"
                                                    />
                                                    <input
                                                        value={productForm.price}
                                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border"
                                                        placeholder="Price"
                                                        type="number"
                                                        step="0.01"
                                                    />
                                                    <input
                                                        value={productForm.tag}
                                                        onChange={(e) => setProductForm({ ...productForm, tag: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border"
                                                        placeholder="Tag"
                                                    />
                                                    <input
                                                        value={productForm.stock}
                                                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border"
                                                        placeholder="Stock"
                                                        type="number"
                                                    />
                                                    <textarea
                                                        value={productForm.description}
                                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border col-span-2"
                                                        placeholder="Description"
                                                    />
                                                    <textarea
                                                        value={productForm.note}
                                                        onChange={(e) => setProductForm({ ...productForm, note: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border col-span-2"
                                                        placeholder="Note"
                                                    />
                                                    <textarea
                                                        value={productForm.returnPolicy}
                                                        onChange={(e) => setProductForm({ ...productForm, returnPolicy: e.target.value })}
                                                        className="px-3 py-2 text-black rounded-lg border col-span-2"
                                                        placeholder="Return Policy"
                                                    />

                                                    {/* Sizes */}
                                                    <div className="col-span-2">
                                                        <label className="font-medium text-gray-700 mb-1 block">Sizes</label>
                                                        {productForm.sizes?.map((size, idx) => (
                                                            <div key={idx} className="flex gap-2 mb-2">
                                                                <input
                                                                    value={size.label}
                                                                    onChange={(e) => {
                                                                        const newSizes = [...productForm.sizes];
                                                                        newSizes[idx].label = e.target.value;
                                                                        setProductForm({ ...productForm, sizes: newSizes });
                                                                    }}
                                                                    className="px-3 py-2 text-black rounded-lg border flex-1"
                                                                    placeholder="Label (e.g., Small)"
                                                                />
                                                                <input
                                                                    value={size.price}
                                                                    onChange={(e) => {
                                                                        const newSizes = [...productForm.sizes];
                                                                        newSizes[idx].price = e.target.value;
                                                                        setProductForm({ ...productForm, sizes: newSizes });
                                                                    }}
                                                                    className="px-3 py-2 text-black rounded-lg border w-24"
                                                                    placeholder="Price"
                                                                    type="number"
                                                                    step="0.01"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newSizes = productForm.sizes.filter((_, i) => i !== idx);
                                                                        setProductForm({ ...productForm, sizes: newSizes });
                                                                    }}
                                                                    className="px-2 bg-red-100 rounded-lg hover:bg-red-200 text-red-700"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newSizes = [...(productForm.sizes || []), { id: Date.now(), label: "", price: "" }];
                                                                setProductForm({ ...productForm, sizes: newSizes });
                                                            }}
                                                            className="px-3 py-2 bg-rose-100 rounded-lg hover:bg-rose-200 text-gray-700 text-sm"
                                                        >
                                                            Add Size
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Modal Buttons */}
                                        <div className="mt-4 flex justify-center gap-2 p-4 border-t">
                                            <button
                                                onClick={() => setModalOpen(false)}
                                                className="bg-gray-100 px-4 py-2 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (editingProduct) await handleSaveEdit(); // editing
                                                    else await handleAddProduct();            // adding
                                                    setModalOpen(false);                      // close modal
                                                }}
                                                className="bg-pink-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                {editingProduct ? "Save Changes" : "Add Product"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}




                        </section>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === "orders" && (
                        <section className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Orders</h3>
                            <div className="space-y-3">
                                {orders.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No orders found</p>
                                ) : (
                                    orders.map((o) => {
                                        // Calculate total from products array using price field
                                        const total = o.product?.reduce((sum, item) => {
                                            const price = item.price || 0;
                                            const amount = item.amount || 1;
                                            return sum + (price * amount);
                                        }, 0) || 0;

                                        const orderedProduct = o.product?.[0]?.product_id;

                                        return (
                                            <div
                                                key={o._id}
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
                                                            <p>{o.order_id || `#${o._id.slice(-6)}`}</p>
                                                            <p>— {o.username || o.user_id?.username || "Guest"}</p>
                                                        </div>
                                                        <div className="flex flex-col gap-1 justify-center md:justify-start md:flex-row text-gray-800">
                                                            <p>
                                                                {o.product?.length > 1
                                                                    ? `${o.product.length} items`
                                                                    : `Product: ${orderedProduct?.name || "Unknown"}`}
                                                            </p>
                                                            <p>• ${total.toFixed(2)}</p>
                                                            <p>• Status: {o.status || "Processing"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleViewOrder(o)}
                                                    className="flex items-center mt-4 text-black gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50"
                                                >
                                                    <Eye size={14} /> View
                                                </button>

                                            </div>
                                        );
                                    })
                                )}
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
                                        key={u._id}
                                        className="flex flex-col items-center justify-between md:flex-row bg-rose-50 p-3 rounded-lg"
                                    >
                                        <div className="flex flex-col items-center text-center md:flex-row md:text-left gap-3">
                                            {u.image && (
                                                <img
                                                    src={u.image}
                                                    alt={`${u.fname} ${u.lname}`}

                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-800">{`${u.fname} ${u.lname}`}</div>
                                                <div className="text-sm text-gray-600">
                                                    {u.email} • Role:{" "}
                                                    <span className="font-semibold">{u.role || "Customer"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleRole(u._id)}
                                                className="px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50"
                                            >
                                                {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
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

                    {orderModalOpen && selectedOrder && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
                            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">

                                {/* Close Button */}
                                <button
                                    onClick={() => setOrderModalOpen(false)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>

                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Details</h3>

                                {/* Order Info */}
                                <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
                                <p><strong>Customer:</strong> {selectedOrder.username || "Guest"}</p>
                                <p><strong>Status:</strong> {selectedOrder.status}</p>
                                {/* <p><strong>Shipping Address:</strong> {selectedOrder.shipping_address || "N/A"}</p> */}

                                {/* ETA */}
                                <p>
                                    <strong>ETA:</strong>{" "}
                                    {selectedOrder.eta
                                        ? new Date(selectedOrder.eta).toLocaleDateString()
                                        : "Not available"}
                                </p>

                                {/* Products */}
                                <div className="space-y-2">
                                    {selectedOrder.product.map((item, index) => {
                                        const product = item.product_id; // populated product

                                        return (
                                            <div key={index} className="flex justify-between bg-rose-50 p-2 rounded-lg">

                                                {/* PRODUCT NAME (safe fallback in case populate failed) */}
                                                <span>
                                                    {product?.name ||
                                                        product?.productName ||
                                                        product?.title ||
                                                        "Unknown Product"}
                                                </span>

                                                <span>x{item.amount}</span>

                                                {/* DISPLAY CALCULATED PRICE */}
                                                <span>${(item.price * item.amount).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}
                                </div>


                                {/* Total Price */}
                                <div className="mt-4 text-right font-semibold text-gray-800">
                                    Total: $
                                    {selectedOrder.product
                                        .reduce((sum, i) => sum + i.price * i.amount, 0)
                                        .toFixed(2)}
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setOrderModalOpen(false)}
                                    className="mt-6 bg-rose-100 text-gray-800 w-full py-2 rounded-lg hover:bg-rose-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}



                </main>
            </div>
        </div>
    );
}