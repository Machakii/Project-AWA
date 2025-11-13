import { useEffect, useState } from "react";
import { Leaf, Heart, Sparkles, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Whywe() {
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("why-choose");
            if (section && section.getBoundingClientRect().top < window.innerHeight - 150) {
                setVisible(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pillars = [
        {
            icon: <Leaf size={32} className="text-pink-400" />,
            title: "100% Natural",
            description:
                "Only the finest natural ingredients, carefully selected and sustainably sourced.",
        },
        {
            icon: <Heart size={32} className="text-pink-400" />,
            title: "Cruelty-Free",
            description:
                "Never tested on animals. Beauty should never cause harm.",
        },
        {
            icon: <Sparkles size={32} className="text-pink-400" />,
            title: "Luxurious Feel",
            description:
                "Indulgent textures that transform your daily routine into a spa experience.",
        },
        {
            icon: <Award size={32} className="text-pink-400" />,
            title: "Award Winning",
            description:
                "Recognized globally for innovation, quality, and sustainable practices.",
        },
    ];

    return (
        <section
            id="why-choose"
            className="flex flex-col items-center justify-center text-center bg-gradient-to-b from-pink-50 to-pink-100 py-20 px-6"
        >
            <h2
                className={`text-4xl md:text-5xl font-semibold text-[#3d2e38] mb-2 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                Why Choose Marshmallow
            </h2>
            <p
                className={`text-gray-500 mb-12 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                Four pillars that make us different
            </p>

            <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
            >
                {pillars.map((pillar, index) => (
                    <div
                        key={index}
                        className="bg-white/60 backdrop-blur-sm shadow-sm rounded-2xl p-8 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="bg-pink-100 rounded-full p-4">{pillar.icon}</div>
                        </div>
                        <h3 className="text-lg font-semibold text-[#3d2e38] mb-2">
                            {pillar.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {pillar.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
