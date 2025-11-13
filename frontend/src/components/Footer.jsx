import { FaInstagram, FaFacebookF, FaTwitter, FaEnvelope } from "react-icons/fa";
import { useState } from "react";

export default function Footer() {

  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log(`Subscribed with: ${email}`);
  };

  return (
    <>
      <footer className="bg-white text-gray-800">

        <div className="bg-[#FFF7F5] py-20 px-6 mb-10 sm:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-5xl font-medium text-[#4A3B47] mb-4">Join Our Beauty Community</h2>
            <p className="text-base text-gray-700 mb-6">
              Subscribe to receive exclusive offers, beauty tips, and updates on new product launches.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white w-full sm:w-80 px-4 py-1  border-2 border-none rounded-lg placeholder-black-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FDA4AF]"
                required
              />
              <button
                type="submit"
                className="bg-[#FDA4AF] text-white px-4 py-1 rounded-lg hover:opacity<80> cursor-pointer transition font-medium"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              By subscribing, you agree to our <a href="#" className="underline">Privacy Policy</a> and consent to receive updates.
            </p>
          </div>
        </div>
        {/* --- Top Section --- */}
        <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-pink-100 pb-10 px-5 text-center md:text-left">

          {/* Brand */}
          <div>
            <h2 className="text-[#FDA4AF] text-m sm:text-base mb-2">
              Marshmallow Beauty
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto md:mx-0">
              Luxurious cosmetics that feel as soft as they look. <br />
              Natural ingredients for your delicate skin.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-3 text-m sm:text-base">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#FDA4AF] transition">All Products</a></li>
              <li><a href="#" className="hover:text-[#FDA4AF] transition">Skincare</a></li>
              <li><a href="#" className="hover:text-[#FDA4AF] transition">Makeup</a></li>
              <li><a href="#" className="hover:text-[#FDA4AF] transition">Bestsellers</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-3 text-m sm:text-base">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#FDA4AF] transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#FDA4AF] transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-[#FDA4AF] transition">Returns</a></li>
              <li><a href="#" className="hover:text-[#FDA4AF] transition">FAQ</a></li>
            </ul>
          </div>

          {/* Connect Icons */}
          <div>
            <h3 className=" mb-3 text-m sm:text-base">Connect</h3>
            <div className="flex justify-center md:justify-start space-x-4 text-[#FDA4AF]">
              <a
                href="#"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition"
                aria-label="Email"
              >
                <FaEnvelope className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* --- Bottom Section --- */}
        <div className="max-full px-4 mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 mt-6 space-y-2 sm:space-y-0">
          <p className="text-center sm:text-left">
            © 2025 Marshmallow Beauty. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#FDA4AF] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#FDA4AF] transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
