import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, MoveRight } from "lucide-react"; 

export default function Hero({ scrollToStory }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/home");
  };

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center p-10 md:p-0 justify-center text-center bg-gradient-to-br from-pink-200 via-rose-50 to-amber-50 px-6">

      {/*Icon Circle */}
      <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-[#f5dcdeff]">
        <Sparkles size={40} className="text-[#F4A4B4]" />
      </div>

      {/* Title */}
      <h1
        className={`text-4xl md:text-7xl text-[#4A3B47] mb-4 transition-opacity duration-1000 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        Marshmallow Beauty
      </h1>

      {/* Subtitle */}
      <p
        className={`text-lg md:text-2xl text-gray-500 mb-6 transition-opacity duration-1500 delay-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        Where Luxury Meets Nature
      </p>

      {/* Description */}
      <p
        className={`max-w-xl text-sm md:text-lg text-gray-500 mb-10 leading-relaxed transition-opacity duration-1500 delay-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        Experience the softest touch in beauty. Our signature marshmallow collection combines natural ingredients with luxurious textures for skin that feels as soft as it looks.
      </p>

      {/* Buttons */}
      <div
        className={`flex flex-col md:flex-row gap-4 transition-opacity duration-1500 delay-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={handleExploreClick}
          className="group bg-[#F4A4B4] text-[#4A3B47] cursor-pointer text-sm md:text-lg px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          Explore Collection
          <span className="transition-transform duration-300 group-hover:translate-x-1 text-xl">
            <MoveRight/>
          </span>
        </button>

        <button
          onClick={scrollToStory}
          className="bg-[#FFF7ED] border border-[#FFE4E6] cursor-pointer text-[#4A3B47] text-sm md:text-lg font-medium px-9 py-3 font-semibold rounded-xl transition-all duration-300 hover:bg-[#FFE4E6] hover:border-pink-300 hover:shadow-sm"
        >
          Our Story
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="mt-40 animate-bounce text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}