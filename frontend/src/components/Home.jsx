import { Leaf, Heart, Truck, Award } from "lucide-react";
import modelImage from "../resources/modelImage.jpg"; 

export default function Home() {
  return (
    <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 min-h-screen flex flex-col ">
      <div className="container h-full max-w-full px-6 py-20 lg:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="text-center flex flex-col align-center md:text-left space-y-6">
          <span className="w-40 bg-pink-100 text-[#FDA4AF] text-sm font-medium px-3 py-3 rounded-full">
            New Collection 2025
          </span>

          <h1 className="text-4xl md:text-6xl font-meduim w-full text-[#4A3B47] leading-tight">
            Soft Touch, Bold Beauty
          </h1>

          <p className="text-gray-600 max-w-md mb-10 mx-auto md:mx-0">
            Discover our signature marshmallow collection — luxurious cosmetics
            that feel as soft as they look. Made with natural ingredients for
            your delicate skin.
          </p>

          <div className="flex sm:flex-row gap-3 justify-center md:justify-start">
            <button className="bg-[#F4A4B4] hover:bg-pink-400 text-gray-800 font-semibold px-6 py-1 rounded-xl transition-all duration-200 shadow-sm">
              Shop Collection
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-xl transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src={modelImage}
            alt="Model showcasing beauty collection"
            className="w-full sm:w-full rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Bottom Icons Section */}
      <div className="bg-gradient-to-br from-[#EDE7F6] via-rose-100 to-amber-[#C7D2FE] py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <Leaf className="mx-auto w-6 h-10 text-pink-400 mb-3" />
            <h3 className="font-semibold text-gray-800">Natural Ingredients</h3>
            <p className="text-gray-500 text-sm">
              100% natural and cruelty-free products
            </p>
          </div>
          <div>
            <Heart className="mx-auto w-6 h-10 text-pink-400 mb-3" />
            <h3 className="font-semibold text-gray-800">Made with Love</h3>
            <p className="text-gray-500 text-sm">
              Handcrafted with care and attention
            </p>
          </div>
          <div>
            <Truck className="mx-auto w-6 h-10 text-pink-400 mb-3" />
            <h3 className="font-semibold text-gray-800">Free Shipping</h3>
            <p className="text-gray-500 text-sm">
              On all orders over $50
            </p>
          </div>
          <div>
            <Award className="mx-auto w-6 h-10 text-pink-400 mb-3" />
            <h3 className="font-semibold text-gray-800">Award Winning</h3>
            <p className="text-gray-500 text-sm">
              Recognized for quality and innovation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
