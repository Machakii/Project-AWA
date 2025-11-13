import React from "react";
import aboutImage from "../resources/story_image.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function About() {
    return (

        <>
            <Header/>

            <section className="bg-[#FFF5F0] py-20 px-6 md:px-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                            About Marshmallow Beauty
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Marshmallow Beauty was born from a dream to make everyone feel
                            soft, confident, and effortlessly radiant. Our products are
                            designed with love, using the finest natural ingredients for
                            your skin’s delicate needs.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Every formula embodies the spirit of comfort and beauty —
                            lightweight, luxurious, and kind to your skin and the planet.
                        </p>
                    </div>
                    <div>
                        <img
                            src={aboutImage}
                            alt="About Marshmallow Beauty"
                            className="rounded-2xl shadow-md w-full object-cover"
                        />
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    );
}
