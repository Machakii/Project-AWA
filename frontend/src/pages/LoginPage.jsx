import React, { useState } from "react";
import { Eye, EyeOff, Heart, Sparkle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // axios instance

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  function getTabClass(activeTab, tabName) {
    return activeTab === tabName
      ? "bg-white rounded-full text-[#4A3B47] shadow-sm"
      : "text-[#4A3B47]/70";
  }

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-[#FFF7ED] text-[#4A3B47]">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-20 py-10">
        <h1 className="text-6xl md:text-7xl font-medium mb-4">
          Welcome to <br />
          <span className="text-[#F4A4B4]">Marshmallow Beauty</span>
        </h1>
        <p className="text-[#4A3B47]/70 text-lg leading-relaxed mb-10">
          Join our beauty community and discover luxurious, natural cosmetics
          that care for your skin and the planet.
        </p>

        <ul className="space-y-5">
          <li className="flex items-start gap-3">
            <div className="bg-[#F4A4B4]/20 p-2 rounded-full">
              <Sparkle size={20} className="text-[#F4A4B4]" />
            </div>
            <div>
              <p className="font-semibold text-[#4A3B47]">Exclusive Offers</p>
              <p className="text-sm text-[#4A3B47]/70">
                Get 20% off your first order as a new member
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="bg-[#F4A4B4]/20 p-2 rounded-full">
              <Heart size={20} className="text-[#F4A4B4] fill-[#F4A4B4]" />
            </div>
            <div>
              <p className="font-semibold text-[#4A3B47]">
                Wishlist & Favorites
              </p>
              <p className="text-sm text-[#4A3B47]/70">
                Save your favorite products and get notified of sales
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 rounded-t-3xl md:rounded-none px-8 md:px-16 py-10 flex flex-col justify-center">
        {/* Tabs */}
        <div className="flex mb-8 bg-[#ffeee8] py-1 px-1 rounded-full overflow-hidden">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-1 text-center cursor-pointer font-medium transition ${getTabClass(activeTab, "login")}`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-1 text-center font-medium cursor-pointer transition ${getTabClass(activeTab, "register")}`}
          >
            Register
          </button>
        </div>

        {/* Conditional Form */}
        {activeTab === "login" ? (
          <LoginForm
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        ) : (
          <RegisterForm
            activeTab={activeTab}
            getTabClass={getTabClass}
            setActiveTab={setActiveTab}
          />
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------ LOGIN FORM
function LoginForm({ showPassword, setShowPassword }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Update form state
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // create a copy of form with email lowercased
    const submitForm = { ...form, email: form.email.toLowerCase() };

    try {
      const res = await API.post("/auth/login", submitForm);
      console.log(res.data);

      // Save the full user data
      const userData = {
        id: res.data.id,
        token: res.data.token,
        role: res.data.role,
        fname: res.data.fname,
        lname: res.data.lname || "",
        email: res.data.email,
        phone: res.data.phone || null,
        birthday: res.data.birthday || null,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // Optional: also keep token separate if you use it for API headers
      localStorage.setItem("token", res.data.token);


      if (res.data.role === "admin") {
        navigate("/admin"); // admin redirect
      } else {
        navigate("/landing"); // user redirect
      }

      alert(`Welcome back, ${res.data.fname || "user"}!`);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <form className="space-y-4 bg-white p-5 rounded-xl" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-medium mb-1">Welcome Back</h2>
      <p className="text-sm text-[#4A3B47]/70 mb-6">
        Enter your credentials to access your account
      </p>

      {/* Email */}
      <div>
        <label className="block text-sm mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full border border-pink-100 rounded-lg p-2 focus:ring-2 focus:ring-[#F4A4B4] focus:outline-none"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <label className="block text-sm mb-1">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full border border-pink-100 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-[#F4A4B4] focus:outline-none"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-gray-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Remember + Forgot Password */}
      <div className="flex justify-between items-center text-sm mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[#F4A4B4]" />
          Remember me
        </label>
        <a href="#" className="text-[#F4A4B4] hover:underline">
          Forgot Password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#F4A4B4] text-[#4A3B47] py-2 rounded-2xl mt-4 hover:bg-[#f7b8c3] transition"
      >
        Sign In
      </button>
    </form>
  );
}


// ------------------------------------------------------------ REGISTER FORM
function RegisterForm({ activeTab, getTabClass, setActiveTab }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" ,phone: "", birthday: ""});
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registration successful!");
      setActiveTab("login"); // Switch to login tab
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      className="space-y-4 bg-white p-5 rounded-xl"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-medium mb-1">Create Account</h2>
      <p className="text-sm text-[#4A3B47]/70 mb-6">
        Join our beauty community today
      </p>

      <div>
        <label className="block text-sm mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Jane Doe"
          onChange={handleChange}
          className="w-full border border-pink-100 rounded-lg p-2 focus:ring-2 focus:ring-[#F4A4B4] focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          onChange={handleChange}
          className="w-full border border-pink-100 rounded-lg p-2 focus:ring-2 focus:ring-[#F4A4B4] focus:outline-none"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-sm mb-1">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create a strong password"
          onChange={handleChange}
          className="w-full border border-pink-100 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-[#F4A4B4] focus:outline-none"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-gray-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="relative">
        <label className="block text-sm mb-1">Confirm Password</label>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Re-enter your password"
          className="w-full border border-pink-100 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-[#F4A4B4] focus:outline-none"
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-8 text-gray-400"
        >
          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <button
        type="submit"
        className={`w-full bg-rose-200 text-[#4A3B47] py-2 rounded-2xl mt-4 hover:bg-[#f7b8c3] transition ${getTabClass(activeTab, "login")}`}
      >
        Create Account
      </button>
    </form>
  );
}