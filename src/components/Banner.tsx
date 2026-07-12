"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

import assetTrackingAnim from '../animations/Home.json';
import warrantyClockAnim from '../animations/vault-tracking.json';
import financialStatsAnim from '../animations/financial-analytics.json';
import roomSpacesAnim from '../animations/Living-room-animation.json';

interface HomeVaultSlide {
    id: number;
    tag: string;
    tagClass: string;
    title: string;
    description: string;
    ctaText: string;
    ctaClass: string;
    animation: object;
    layout: 'left' | 'right';
}

const slidesData: HomeVaultSlide[] = [
    {
        id: 1,
        tag: "SECURE INVENTORY",
        tagClass: "text-[#1E3A8A] bg-white border border-[#1E3A8A]/20 shadow-sm font-medium px-4 py-1.5 rounded-full text-[13px] tracking-wide",
        title: "Organize Your Home, Secure Your Peace of Mind.",
        description: "Ditch the messy drawers and lost receipts. Catalog your electronics, furniture, and valuables in one secure digital vault.",
        ctaText: "Start Inventorying",
        ctaClass: "text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-slate-600/30 bg-[linear-gradient(135deg,#D1D5DB_0%,#6B7280_45%,#374151_100%)] bg-[length:200%_200%] [background-position:0%_50%] hover:[background-position:100%_50%] transition-all duration-700 ease-out hover:-translate-y-0.5 hover:shadow-xl",
        animation: assetTrackingAnim,
        layout: "right",
    },
    {
        id: 2,
        tag: "SMART REMINDERS",
        tagClass: "text-[#B48A1D] bg-[#FEF9C3]/70 font-semibold px-4 py-1.5 rounded-full text-[13px] tracking-wide",
        title: "Never Miss a Warranty Expiration Again.",
        description: "Track purchase dates, upload receipts, and receive timely alerts before your product protection runs out.",
        ctaText: "Track Your Warranties",
        ctaClass: "text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-orange-300/30 bg-[linear-gradient(135deg,#E6A56C_0%,#CF8646_50%,#B76C2C_100%)] bg-[length:200%_200%] [background-position:0%_50%] hover:[background-position:100%_50%] transition-all duration-700 ease-out hover:-translate-y-0.5 hover:shadow-xl",
        animation: warrantyClockAnim,
        layout: "left",
    },
    {
        id: 3,
        tag: "ASSET VALUATION",
        tagClass: "text-[#1E3A8A] bg-white border border-[#1E3A8A]/20 shadow-sm font-medium px-4 py-1.5 rounded-full text-[13px] tracking-wide",
        title: "Instant Valuations for Insurance Claims.",
        description: "Keep tabs on total inventory worth, market depreciation, and generate structured reports to safeguard your assets.",
        ctaText: "View Asset Analytics",
        ctaClass: "text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-teal-300/30 bg-[linear-gradient(135deg,#6DE6CF_0%,#31D1B3_50%,#18B99A_100%)] bg-[length:200%_200%] [background-position:0%_50%] hover:[background-position:100%_50%] transition-all duration-700 ease-out hover:-translate-y-0.5 hover:shadow-xl",
        animation: financialStatsAnim,
        layout: "right",
    },
    {
        id: 4,
        tag: "SPACE MANAGEMENT",
        tagClass: "text-[#B48A1D] bg-[#FEF9C3]/70 font-semibold px-4 py-1.5 rounded-full text-[13px] tracking-wide",
        title: "Track Belongings Across Every Room.",
        description: "Assign items to specific rooms, containers, or custom categories. Know exactly where your items are located instantly.",
        ctaText: "Explore Rooms",
        ctaClass: "text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-orange-300/30 bg-[linear-gradient(135deg,#FDBA74_0%,#F97316_50%,#EA580C_100%)] bg-[length:200%_200%] [background-position:0%_50%] hover:[background-position:100%_50%] transition-all duration-700 ease-out hover:-translate-y-0.5 hover:shadow-xl",
        animation: roomSpacesAnim,
        layout: "left",
    }
];

export default function HomeVaultBanner(): React.JSX.Element {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slidesData.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    const handleDotClick = (index: number): void => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full h-[650px] bg-gradient-to-br from-white via-[#FCFBF7] to-[#F3F6FA] text-slate-900 overflow-hidden flex items-center border-b border-slate-100">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-200/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/30 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Slide Animation Wrapper */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="container mx-auto px-6 lg:px-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                    {/* Content Block */}
                    <div className={`flex flex-col justify-center space-y-6 z-10 text-center lg:text-left lg:col-span-6 ${slidesData[currentSlide].layout === 'left' ? 'lg:order-2 lg:pl-16' : 'lg:order-1 lg:pr-6'}`}>
                        {/* Dynamic Tag */}
                        <div>
                            <span className={`inline-block text-[11px] font-bold tracking-wider uppercase ${slidesData[currentSlide].tagClass}`}>
                                {slidesData[currentSlide].tag}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl lg:text-[52px] font-black text-[#0B132B] tracking-tight leading-[1.15]">
                            {slidesData[currentSlide].title}
                        </h2>

                        {/* Description */}
                        <p className="text-[#475569] text-lg lg:text-[19px] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                            {slidesData[currentSlide].description}
                        </p>

                        {/* CTA Button */}
                        <div className="pt-2">
                            <button className={`inline-flex items-center justify-center text-[16px] active:scale-[0.99] ${slidesData[currentSlide].ctaClass}`}>
                                {slidesData[currentSlide].ctaText}
                            </button>
                        </div>
                    </div>

                    {/* Animation View Frame */}
                    <div className={`w-full lg:col-span-6 z-10 flex items-center justify-center ${slidesData[currentSlide].layout === 'left' ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="w-full max-w-lg relative flex items-center justify-center p-4">
                            {slidesData[currentSlide].animation && (
                                <Lottie
                                    animationData={slidesData[currentSlide].animation}
                                    loop={true}
                                    autoplay={true}
                                    className="w-full h-auto max-h-[400px]"
                                />
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20 items-center">
                {slidesData.map((_, index: number) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className="h-[7px] rounded-full transition-all duration-300 cursor-pointer"
                        style={{
                            width: index === currentSlide ? '32px' : '10px',
                            backgroundColor: index === currentSlide ? '#CA8A04' : '#CBD5E1',
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}