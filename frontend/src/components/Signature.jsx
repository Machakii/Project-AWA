import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../reusables/useProducts";

export default function SignatureCollection() {
    const [visible, setVisible] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);
    const [flippedIndex, setFlippedIndex] = useState(null);
    const { products } = useProducts(); // ✅ dynamic products
    const navigate = useNavigate();

    const handleExploreClick = () => navigate("/home");
    const ExploreShop = () => navigate("/shop");

    // Scroll animations
    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("signature-collection");
            const ctaSection = document.getElementById("cta-section");

            if (section && section.getBoundingClientRect().top < window.innerHeight - 150) {
                setVisible(true);
            }
            if (ctaSection && ctaSection.getBoundingClientRect().top < window.innerHeight - 150) {
                setCtaVisible(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Only take the first 3 products
    const filteredProducts = products.slice(0, 3);

    return (
        <>
            {/* Signature Collection Section */}
            <section
                id="signature-collection"
                className="flex flex-col items-center justify-center text-center bg-[#FFF5F0] py-25 px-6"
            >
                <h2
                    className={`text-4xl md:text-5xl font-semibold text-[#3d2e38] mb-2 transition-all duration-1000 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    Signature Collection
                </h2>
                <p
                    className={`text-gray-500 mb-12 transition-all duration-1000 delay-200 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    Discover our most loved products
                </p>

                <div
                    className={`w-full flex flex-col md:flex-row gap-8 mb-12 items-center transition-all duration-1000 delay-400 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                >
                    {filteredProducts.map((product, i) => (
                        <div
                            key={product.id || i}
                            className="w-full cursor-pointer"
                            onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
                        >
                            <div
                                className="relative w-full h-[500px] [transform-style:preserve-3d] transition-transform duration-700"
                                style={{ transform: flippedIndex === i ? "rotateY(180deg)" : "rotateY(0deg)" }}
                            >
                                {/* Front side */}
                                <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden bg-white shadow-md">
                                    <div className="w-full h-110 overflow-hidden mb-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover mb-4 transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="text-[#3d2e38] font-medium mt-3">{product.name}</h3>
                                </div>

                                {/* Back side */}
                                <div className="absolute w-full h-full bg-white rounded-2xl shadow-md text-center p-6 [transform:rotateY(180deg)] backface-hidden flex flex-col justify-center items-center">
                                    <h3 className="text-[#3d2e38] font-semibold mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{product.description || product.category}</p>
                                    <button
                                        onClick={ExploreShop}
                                        className="bg-[#F4A4B4] cursor-pointer text-[#4A3B47] px-3 py-1 rounded-lg hover:shadow-sm"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleExploreClick}
                    className={`bg-[#F4A4B4] text-[#4A3B47] px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-sm cursor-pointer mb-20 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    Shop Full Collection →
                </button>
            </section>

            {/* CTA Section */}
            <section
                className={`text-center bg-gradient-to-b from-[#FFE4E6] to-rose-50 py-16 px-6 transition-all duration-1000`}
            >
                <div
                    id="cta-section"
                    className={`max-w-3xl mx-auto rounded-2xl transition-all duration-1000 delay-400 ${
                        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                >
                    <h3 className="text-2xl md:text-5xl font-meduim text-[#4A3B47] mb-4">
                        Ready to Transform Your Beauty Routine?
                    </h3>
                    <p className="text-[#4A3B47] text-base mb-6">
                        Join thousands of satisfied customers who’ve discovered the marshmallow difference.
                    </p>
                    <button
                        onClick={handleExploreClick}
                        className="bg-[#F4A4B4] text-[#4A3B47] px-6 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:shadow-sm"
                    >
                        Start Shopping →
                    </button>
                </div>
            </section>
        </>
    );
}
