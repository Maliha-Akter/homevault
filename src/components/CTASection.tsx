"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Package, 
  Sofa, 
  Laptop, 
  Book, 
  Car, 
  ArrowRight, 
  FolderOpen 
} from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto my-12 relative overflow-hidden bg-gradient-to-br from-orange-50/60 via-white to-slate-50/80 rounded-3xl border border-slate-100">
      
      {/* Dynamic Keyframes Injection for Floating Effects & Shifting Button Borders */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatSmooth {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(6deg); }
        }
        @keyframes floatDrift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(-8deg); }
        }
        @keyframes ctaButtonFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float-slow {
          animation: floatSmooth 6s ease-in-out infinite;
        }
        .animate-float-drift {
          animation: floatDrift 8s ease-in-out infinite;
        }
        .animate-cta-btn {
          background-size: 200% 200%;
          animation: ctaButtonFlow 3s ease infinite;
        }
      `}} />

      {/* ========================================================
          FLOATING BACKGROUND ELEMENTS (Hidden on Mobile for UX)
          ======================================================== */}
      {/* Top Left - Home Icon */}
      <div className="hidden lg:block absolute top-12 left-16 text-orange-200/80 dark:text-orange-900/20 animate-float-slow">
        <Home size={44} strokeWidth={1.5} />
      </div>

      {/* Mid Left - Sofa Icon */}
      <div className="hidden md:block absolute top-1/2 left-8 -translate-y-1/2 text-slate-300/70 dark:text-slate-800/30 animate-float-drift">
        <Sofa size={40} strokeWidth={1.5} />
      </div>

      {/* Bottom Left - Book Icon */}
      <div className="hidden lg:block absolute bottom-12 left-24 text-orange-300/60 dark:text-orange-950/20 animate-float-slow" style={{ animationDelay: '1s' }}>
        <Book size={36} strokeWidth={1.5} />
      </div>

      {/* Top Right - Package Icon */}
      <div className="hidden md:block absolute top-16 right-16 text-slate-300/70 dark:text-slate-800/30 animate-float-drift" style={{ animationDelay: '0.5s' }}>
        <Package size={42} strokeWidth={1.5} />
      </div>

      {/* Mid Right - Laptop Icon */}
      <div className="hidden lg:block absolute top-1/2 right-12 -translate-y-1/2 text-orange-200/80 dark:text-orange-900/20 animate-float-slow" style={{ animationDelay: '1.5s' }}>
        <Laptop size={38} strokeWidth={1.5} />
      </div>

      {/* Bottom Right - Car Icon */}
      <div className="hidden md:block absolute bottom-14 right-28 text-slate-300/60 dark:text-slate-800/20 animate-float-drift" style={{ animationDelay: '2s' }}>
        <Car size={40} strokeWidth={1.5} />
      </div>

      {/* ========================================================
          CORE INTERACTIVE CONTENT AREA
          ======================================================== */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6 py-6">
        
        {/* Dynamic Launch Badge */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-orange-100 shadow-sm">
          <span className="text-base select-none">🏠</span>
          <span className="text-xs font-bold text-slate-700 tracking-tight">
            Your Digital Home Inventory Starts Here
          </span>
        </div>

        {/* Primary Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Take Control of Your <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Home Inventory</span> Today
        </h2>

        {/* Informative Description */}
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
          Organize your household belongings, securely store purchase details and warranty information, and manage everything from one intuitive dashboard.
        </p>

        {/* CTA Interactive Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full sm:w-auto">
          
          {/* Get Started Button Wrapper - Featuring Animated Gradient Edge */}
          <Link 
            href="/auth/register" 
            className="w-full sm:w-auto p-[2px] rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 via-slate-300 to-orange-400 animate-cta-btn shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex"
          >
            <span className="w-full bg-slate-900 text-white font-bold text-xs px-6 py-3.5 rounded-[10px] inline-flex items-center justify-center gap-2 transition-colors hover:bg-slate-850">
              Get Started
              <ArrowRight size={14} className="text-orange-400" />
            </span>
          </Link>

          {/* Secondary Explore Categories Route Button */}
          <Link
            href="/categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold px-6 py-4 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <FolderOpen size={14} className="text-slate-400" />
            Explore Categories
          </Link>

        </div>

      </div>
    </section>
  );
}