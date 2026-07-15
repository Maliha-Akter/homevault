"use client";

import React from 'react';
import { 
  UserPlus, 
  FolderOpen, 
  PackagePlus, 
  BarChart3 
} from "lucide-react";

interface StepProps {
  stepNumber: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const stepsData: StepProps[] = [
  {
    stepNumber: "01",
    title: "Create Account",
    description: "Register or sign in to your personal HomeVault account to securely manage your inventory.",
    Icon: UserPlus
  },
  {
    stepNumber: "02",
    title: "Choose Category",
    description: "Browse default categories like Electronics, Furniture, Books, or create your own custom categories.",
    Icon: FolderOpen
  },
  {
    stepNumber: "03",
    title: "Add Your Inventory",
    description: "Add item details including images, brand, purchase date, value, room, condition, warranty, and personal notes.",
    Icon: PackagePlus
  },
  {
    stepNumber: "04",
    title: "Track & Manage",
    description: "Search, filter, and monitor your inventory through your personal dashboard with interactive analytics.",
    Icon: BarChart3
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 container mx-auto my-12 relative">
      {/* Dynamic Keyframes Injection for Right-to-Left Shifting Background */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dynamicBgGradient {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-bg {
          background-size: 200% 200%;
          animation: dynamicBgGradient 6s ease infinite;
        }
      `}} />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Simple Workflow
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          How It Works
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Get your household tracking up and running in four straight-forward developmental milestones.
        </p>
      </div>

      {/* Grid Constrained to exactly 2 items per row on medium screens and up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {stepsData.map((step, index) => {
          const IconComponent = step.Icon;
          return (
            <div 
              key={index}
              className="relative p-6 sm:p-8 rounded-2xl overflow-hidden bg-gradient-to-r from-orange-500 via-slate-400 to-orange-600 animate-gradient-bg shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-6 min-h-[220px]"
            >
              {/* Header Context Inside Card */}
              <div className="flex justify-between items-start gap-4 z-10">
                {/* Premium Glassmorphism Icon Container */}
                <div className="p-3.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white shrink-0 shadow-inner">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-5xl font-black tracking-tighter text-white/20 selection:bg-transparent select-none">
                  {step.stepNumber}
                </span>
              </div>

              {/* Text Content with high contrast values */}
              <div className="space-y-2 flex-grow z-10">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-orange-50 leading-relaxed font-medium opacity-90">
                  {step.description}
                </p>
              </div>

              {/* Decorative clean radial overlay flare for depth */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_45%)] pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
}