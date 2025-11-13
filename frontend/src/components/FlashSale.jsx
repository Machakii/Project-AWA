import React, { useEffect, useState } from "react";
import skincareImage from "../resources/skincare1.jpg"; // replace with your actual image path
import { Clock } from "lucide-react";

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 40,
    seconds: 9,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="
        flex flex-col md:flex-row items-center justify-center 
        h-auto md:h-[880px] 
        bg-gradient-to-br from-pink-50 to-[#FFF7ED] 
        p-2 md:p-4 
      "
    >
      {/* Left image section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-full">
          <span className="absolute top-4 left-4 bg-[#F4A4B4] text-white text-sm px-4 py-1 rounded-full shadow-sm">
            Limited Time Offer
          </span>
          <img
            src={skincareImage}
            alt="Beauty products"
            className="rounded-3xl shadow-md object-cover w-full h-[400px] md:h-[700px]"
          />
        </div>
      </div>

      {/* Right text section */}
      <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-16 flex flex-col justify-center">
        <span className="bg-[#F4A4B4]/20 text-[#4A3B47] text-sm px-4 py-2 rounded-full w-fit">
          Flash Sale
        </span>

        <h1 className="text-4xl md:text-5xl mt-8 mb-4 text-[#4A3B47] leading-snug">
          Get 30% Off Complete Bundles
        </h1>

        <p className="text-[#4A3B47]/70 mb-8 text-lg leading-relaxed">
          Experience the full Marshmallow Beauty collection at an incredible
          price. Our curated bundles include everything you need for a complete
          beauty routine.
        </p>

        {/* Countdown Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 w-full ">
          <p className="text-[#4A3B47]/70 text-sm mb-4">Offer ends in</p>
          <div className="flex items-center gap-4 text-[#4A3B47]">
            <Clock size={20} className="text-[#F4A4B4]" />
            <div className="flex gap-6 font-semibold">
              <div className="text-center">
                <p className="text-xl">{timeLeft.hours}</p>
                <p className="text-xs">Hours</p>
              </div>
              <div className="text-center">
                <p className="text-xl">{timeLeft.minutes}</p>
                <p className="text-xs">Minutes</p>
              </div>
              <div className="text-center">
                <p className="text-xl">{timeLeft.seconds}</p>
                <p className="text-xs">Seconds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button className="bg-[#F4A4B4] hover:bg-[#f7b8c3] text-[#4A3B47] px-6 py-3 rounded-xl shadow-md transition">
            Shop Bundles Now
          </button>
          <button className="border border-[#F4A4B4] text-[#4A3B47] hover:bg-[#F4A4B4]/10 px-6 py-3 rounded-xl transition">
            View All Deals
          </button>
        </div>
      </div>
    </section>
  );
}
