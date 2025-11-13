import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../reusables/useProducts";

export default function SignatureCollection() {
    const [visible, setVisible] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);
    const { products } = useProducts();


    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate("/home");
    };

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

    const filtered = products
        // .filter((p) => p.tag?.toLowerCase() === "bestseller")
        .slice(0, 3);


    return (
        <>
            {/* Signature Collection Section */}
            <section
                id="signature-collection"
                className="flex flex-col items-center justify-center text-center bg-[#FFF5F0] py-25 px-6"
            >
                <h2
                    className={`text-4xl md:text-5xl font-semibold text-[#3d2e38] mb-2 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    Signature Collection
                </h2>
                <p
                    className={`text-gray-500 mb-12 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    Discover our most loved products
                </p>

                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    {filtered.map((product, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="rounded-2xl w-100 h-100 object-cover mb-4"
                            />
                            <h3 className="text-[#3d2e38] font-medium">{product.name}</h3>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleExploreClick}
                    className={`bg-[#F4A4B4] text-[#4A3B47] px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-sm cursor-pointer mb-20 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    Shop Full Collection →
                </button>
            </section>

            {/* CTA Section */}
            <section
                className={`text-center bg-gradient-to-b from-[#FFE4E6] to-rose-50 py-16 px-6 transition-all duration-1000`}
            >
                <div id="cta-section" className={`max-w-3xl mx-auto rounded-2xl transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}>
                    <h3 className="text-2xl md:text-5xl font-meduim text-[#4A3B47] mb-4">
                        Ready to Transform Your Beauty Routine?
                    </h3>
                    <p className="text-[#4A3B47] text-base mb-6">
                        Join thousands of satisfied customers who’ve discovered the marshmallow difference.
                    </p>
                    <button
                        onClick={handleExploreClick}
                        className="bg-[#F4A4B4] text-[#4A3B47] px-6 py-2 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:shadow-sm">
                        Start Shopping →
                    </button>
                </div>
            </section>
        </>
    );
}
