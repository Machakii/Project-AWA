import React, { useEffect, useRef, useState, forwardRef } from 'react';
import story_image from '../resources/story_image.jpg';

const Story = forwardRef((props, ref) => {
  const imageRef = useRef(null);
  const textRef = useRef(null);

  const [imageVisible, setImageVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === imageRef.current) setImageVisible(true);
          if (entry.target === textRef.current) setTextVisible(true);
        }
      });
    }, observerOptions);

    if (imageRef.current) observer.observe(imageRef.current);
    if (textRef.current) observer.observe(textRef.current);

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
      if (textRef.current) observer.unobserve(textRef.current);
    };
  }, []);

  return (
    // 👇 Attach the forwarded ref here
    <div ref={ref} className="bg-[#FFFFFF] py-12 px-6">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Image */}
        <div
          ref={imageRef}
          className={`w-full h-200 md:h-300 bg-gray-200 rounded-lg overflow-hidden shadow-md transform transition-all duration-1000 ${
            imageVisible ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0'
          }`}
        >
          <img
            src={story_image}
            alt="Dior envelope"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Text */}
        <div
          ref={textRef}
          className={`text-left transform transition-all duration-1000 ${
            textVisible ? 'translate-x-0 opacity-100' : 'translate-x-40 opacity-0'
          }`}
        >
          <h3 className="bg-[#FFE4E6] w-35 text-center rounded-4xl py-2 text-m font-medium text-[#FDA4AF] mb-10">
            Our Philosophy
          </h3>
          <h2 className="text-5xl text-gray-700 mb-4">Beauty That Cares</h2>
          <p className="text-gray-500 text-lg mb-4 leading-[1.5]">
            Born from a passion for natural beauty and sustainable luxury, Marshmallow Beauty
            reimagines cosmetics as a gentle embrace for your skin. Every product is crafted
            with love, using only the finest natural ingredients.
          </p>
          <p className="text-gray-500 mb-6 leading-relaxed">
            We believe beauty should be kind—to your skin, to animals, and to our planet. That’s
            why we create completely cruelty-free, vegan formulations that deliver results without
            compromise.
          </p>
          <a
            href="#"
            className="inline-block bg-[#FDA4AF] text-[#4A3B47] px-4 py-2 rounded-xl cursor-pointer transition font-medium"
          >
            Discover Our Products
          </a>
        </div>
      </div>
    </div>
  );
});

export default Story;
