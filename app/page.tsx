"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, HelpCircleIcon, LogInIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        router.push("/farm/");
    };

    const scrollToFeatures = () => {
        const element = document.getElementById("features");
        element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* The sidebar trigger would appear here from layout.tsx */}
            {/* We start our content below that */}

            {/* Hero Section with Login Form */}
            <section className="pt-20 mb-40 px-6">
                <div className="max-w-6xl mx-auto items-center">
                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-8 md:mb-0">
                                <img src="/logo.png" alt="EcoHarvest Logo" className="h-10" />
                                <span className="text-xl font-bold text-primary">EcoHarvest</span>
                            </div>
                        </div>

                        <p className="text-gray-600 text-lg max-w-2xl">
                            Transform your agricultural operations with our cutting-edge platform.
                            Monitor, analyze, and optimize every aspect of your farm to maximize
                            yields and sustainability.
                        </p>

                        <p className="flex space-x-4">
                            <Button
                                onClick={handleLogin}
                                variant={"default"}
                            >
                                Get Started
                                <LogInIcon size={20} className="ml-2" />
                            </Button>
                            <Button
                                onClick={scrollToFeatures}
                                variant="outline"
                            >
                                Help
                                <HelpCircleIcon size={20} />
                            </Button>
                        </p>
                    </motion.div>


                </div>
            </section>

            {/* Features Section with Screenshots */}
            <section id="features" className=" px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className=" mb-40"
                    >
                        <h2 className="text-3xl font-bold  mb-4">Explore EcoHarvest Farm Management Features</h2>
                        <p className="text-lg text-gray-600 max-w-2xl ">
                            Our platform offers comprehensive tools to help you optimize your farming operations.
                            Here's what you can expect when you log in:
                        </p>
                    </motion.div>

                    {/* Feature 1 - Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h4 className="font-semibold text-primary mb-6">
                                    Comprehensive Dashboard
                                </h4>
                                <p className="text-gray-600 mb-6 text-lg">
                                    Get a bird's-eye view of your entire farm operation with our customizable dashboard.
                                    Monitor key metrics, view alerts, and access all your farming data in one place.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Real-time weather data and forecasts integrated directly into your view</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Customizable widgets for the metrics that matter most to your operation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Status indicators for all your connected farm equipment and sensors</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="">
                                <img
                                    src="home-analytics.jpg"
                                    alt="EcoHarvest Dashboard"
                                    className="rounded-lg "
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 1 - Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h4 className="font-semibold text-primary mb-6">
                                    Comprehensive Dashboard
                                </h4>
                                <p className="text-gray-600 mb-6 text-lg">
                                    Get a bird's-eye view of your entire farm operation with our customizable dashboard.
                                    Monitor key metrics, view alerts, and access all your farming data in one place.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Real-time weather data and forecasts integrated directly into your view</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Customizable widgets for the metrics that matter most to your operation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Status indicators for all your connected farm equipment and sensors</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="">
                                <img
                                    src="home-analytics.jpg"
                                    alt="EcoHarvest Dashboard"
                                    className="rounded-lg "
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 1 - Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h4 className="font-semibold text-primary mb-6">
                                    Comprehensive Dashboard
                                </h4>
                                <p className="text-gray-600 mb-6 text-lg">
                                    Get a bird's-eye view of your entire farm operation with our customizable dashboard.
                                    Monitor key metrics, view alerts, and access all your farming data in one place.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Real-time weather data and forecasts integrated directly into your view</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Customizable widgets for the metrics that matter most to your operation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Status indicators for all your connected farm equipment and sensors</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="">
                                <img
                                    src="home-analytics.jpg"
                                    alt="EcoHarvest Dashboard"
                                    className="rounded-lg "
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 1 - Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h4 className="font-semibold text-primary mb-6">
                                    Comprehensive Dashboard
                                </h4>
                                <p className="text-gray-600 mb-6 text-lg">
                                    Get a bird's-eye view of your entire farm operation with our customizable dashboard.
                                    Monitor key metrics, view alerts, and access all your farming data in one place.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Real-time weather data and forecasts integrated directly into your view</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Customizable widgets for the metrics that matter most to your operation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <ArrowRight size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                        <span>Status indicators for all your connected farm equipment and sensors</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="">
                                <img
                                    src="home-analytics.jpg"
                                    alt="EcoHarvest Dashboard"
                                    className="rounded-lg "
                                />
                            </div>
                        </div>
                    </motion.div>


                </div>
            </section>


        </div>
    );
}