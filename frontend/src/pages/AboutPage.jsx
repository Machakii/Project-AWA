import React from "react";
import aboutImage from "../resources/story_image.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function About() {

    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 200);
            }
        }
    }, [hash]);

    return (

        <>
            <Header />

            {/* ABOUT SECTION */}
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

            {/* SUPPORT SECTION */}
            <section className="py-20 px-6 md:px-16 bg-white">
                <div id="contact" className="max-w-5xl mx-auto space-y-16">

                    {/* CONTACT US */}
                    <div>
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                            Contact Us
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            We're here to help with any questions about your order, our products,
                            or anything else you need.
                        </p>

                        <div className="text-gray-600 space-y-1 mt-4">
                            <p><strong>Email:</strong> support@marshmallowbeauty.com</p>
                            <p><strong>Phone:</strong> +63 900 000 0000</p>
                            <p><strong>Support Hours:</strong> Mon–Fri, 9AM–6PM</p>
                        </div>

                        <p className="text-gray-600 mt-3">
                            You may also reach us anytime through our social channels.
                        </p>
                    </div>

                    {/* SHIPPING INFO */}
                    <div id="shipping">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                            Shipping Information
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            We aim to deliver your Marshmallow Beauty favorites quickly and safely.
                        </p>

                        <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                            <li><strong>Processing time:</strong> 1–2 business days</li>
                            <li><strong>Local shipping:</strong> 2–5 days (LBC, J&T, NinjaVan)</li>
                            <li><strong>International shipping:</strong> 7–14 days</li>
                            <li><strong>Shipping rates:</strong> Calculated at checkout</li>
                            <li><strong>Tracking:</strong> You will receive a tracking link via email once shipped.</li>
                        </ul>
                    </div>

                    {/* RETURNS POLICY */}
                    <div id="returns">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                            Returns & Refunds
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            Your satisfaction matters to us. If something isn’t right, we’re here to help.
                        </p>

                        <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                            <li><strong>Return window:</strong> Within 7–30 days upon receiving the item</li>
                            <li><strong>Eligible conditions:</strong> Unused, sealed, or received damaged/wrong item</li>
                            <li><strong>Refund options:</strong> Replacement, store credit, or bank refund</li>
                            <li><strong>Process:</strong> Contact us with your order ID and photos if applicable</li>
                            <li><strong>Non-returnable items:</strong> Used/opened beauty products</li>
                        </ul>
                    </div>

                    {/* FAQ */}
                    <div id="faq">
                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                            Frequently Asked Questions (FAQ)
                        </h3>

                        <div className="space-y-3 text-gray-600">
                            <p><strong>• How do I track my order? </strong>
                                You will receive a tracking link via email after shipping.
                            </p>
                            <p><strong>• What payment methods do you accept? </strong>
                                We accept GCash, debit/credit card, and COD (selected areas).
                            </p>
                            <p><strong>• How long does shipping take? </strong>
                                Local deliveries take 2–5 days, international 7–14 days.
                            </p>
                            <p><strong>• Can I change my order? </strong>
                                Yes—contact us within 12 hours of placing the order.
                            </p>
                            <p><strong>• Do you ship internationally? </strong>
                                Yes, to selected countries. Fees apply.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}
