import React from "react";
import { Quote, Droplet, Sparkles, Star } from "lucide-react";
import profilePic from "../resources/fragrance1.jpg"

export default function CustomerSection() {
    const Feedbacks = [
        {
            image: profilePic,
            name: "Kenneth De Jesus",
            role: "Beauty Enthusiast",
            text: "Marshmallow Beauty has completely transformed my skincare routine! The Glow Serum is absolutely amazing. My skin has never looked better.",
        },
        {
            image: profilePic,
            name: "Cj Andres",
            role: "Makeup Artist",
            text: "As a professional makeup artist, I'm very particular about products. The Cloud Blush Palette is now my go-to for all my clients. The colors are stunning!",
        },
        {
            image: profilePic,
            name: "Masaki Saito",
            role: "Skincare Blogger",
            text: "I love that everything is natural and cruelty-free. The quality is exceptional and the marshmallow theme is so charming. Highly recommend!",
        },
    ];

    const categories = [
        {
            icon: <Droplet size={32} />,
            title: "Skincare",
            desc: "Nourish your skin with gentle, natural ingredients",
            button: "Explore Skincare",
        },
        {
            icon: <Sparkles size={32} />,
            title: "Makeup",
            desc: "Express yourself with our soft color palettes",
            button: "Explore Makeup",
        },
        {
            icon: <Star size={32} />,
            title: "Bestsellers",
            desc: "Customer favorites that everyone loves",
            button: "Explore Bestsellers",
        },
    ];

    return (
        <section className="bg-pink-50 text-[#4A3B47]">
            {/* --- Feedbacks --- */}
            <div className="text-center py-16">
                <h2 className="text-3xl md:text-5xl font-semibold mb-2">What Our Customers Say</h2>
                <p className="text-gray-600">
                    Join thousands of happy customers who've discovered the marshmallow difference
                </p>
            </div>
            {/* Feedback Card */}
            <div className="flex flex-col md:flex-row gap-6 justify-center px-2 md:px-4">
                {Feedbacks.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl hover:shadow-xl p-6 flex flex-col justify-between flex-1 gap-6"
                    >
                        <Quote className="opacity-30 mb-3" />
                        <div>
                            <div className="flex mb-3 text-[#F4A4B4]">
                                {Array(5)
                                    .fill()
                                    .map((_, i) => (
                                        <Star key={i} size={18} fill="#F4A4B4" stroke="none" />
                                    ))}
                            </div>
                            <p className="italic text-sm mb-5">"{item.text}"</p>
                        </div>
                        <div className="flex items-center gap-3 mt-auto">
                            <div className="w-10 h-10 rounded-full bg-gray-200" >
                                <img src={item.image}
                                    alt="Profile pic"
                                    className="w-full h-full overflow-hidden rounded-full"
                                />
                            </div>

                            <div>
                                <p className="font-semibold text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Shop by Category --- */}
            <div className="mt-24 text-center bg-white py-20">
                <h2 className="text-3xl md:text-5xl font-semibold mb-2">Shop by Category</h2>
                <p className="text-gray-600 mb-10">
                    Find the perfect products for your beauty routine
                </p>
                {/*Card Div*/}
                <div className="flex flex-col md:flex-row justify-center py-3 gap-6 px-2 md:px-4">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-[#FFE5EC] to-[#EDE7F6] rounded-2xl p-8 flex flex-col items-start flex-1
                                 hover:shadow-2xl cursor-pointer transition-shadow duration-300"
                        >
                            <div className="bg-white p-4 rounded-full mb-4 text-[#F4A4B4]">
                                {cat.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{cat.title}</h3>
                            <p className="text-sm text-gray-600 mb-6">{cat.desc}</p>
                            <button
                                className="px-5 py-2 rounded-xl text-sm font-medium"
                                style={{
                                    backgroundColor: "#FFF7F5",
                                    color: "#4A3B47",
                                }}
                            >
                                {cat.button}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
