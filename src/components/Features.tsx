"use client";

import React from 'react';
import { 
  Package, 
  Layers, 
  Image as ImageIcon, 
  Search, 
  BarChart3, 
  ShieldCheck 
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const featuresData: FeatureCardProps[] = [
  {
    title: "Inventory Management",
    description: "Easily add, organize, update, and manage all your household belongings in one secure digital inventory.",
    Icon: Package
  },
  {
    title: "Smart Categories",
    description: "Organize your items into default or custom categories for faster browsing and better organization.",
    Icon: Layers
  },
  {
    title: "Detailed Item Records",
    description: "Save photos, purchase details, brand information, room location, and personal notes for every item.",
    Icon: ImageIcon
  },
  {
    title: "Smart Search",
    description: "Quickly find any item using search, category filters, sorting options, and advanced filtering.",
    Icon: Search
  },
  {
    title: "Analytics Dashboard",
    description: "Visualize your inventory with interactive charts showing categories, item conditions, and inventory growth.",
    Icon: BarChart3
  },
  {
    title: "Secure Personal Vault",
    description: "Every inventory is private and protected with secure authentication so only you can access your belongings.",
    Icon: ShieldCheck
  }
];

export default function Features() {
  return (
    <section className="bg-slate-50/50 py-16 px-4 container mx-auto rounded-3xl my-12 border border-slate-100">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
          Platform Capabilities
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Why Choose HomeVault
        </h2>
        <p className="text-base text-slate-500">
          Manage your household inventory with powerful organization, granular tracking tools, and secure cloud replication.
        </p>
      </div>

      {/* 3D Flip Card Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresData.map((feature, idx) => {
          const IconComponent = feature.Icon;
          return (
            <div 
              key={idx} 
              className="group h-64 [perspective:1000px] w-full"
            >
              {/* Card Inner Wrapper handling the 3D rotation */}
              <div className="relative w-full h-full duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-sm group-hover:shadow-xl rounded-2xl transition-all">
                
                {/* FRONT FACE */}
                <div className="absolute inset-0 w-full h-full bg-white border border-orange-400/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 [backface-visibility:hidden] text-center">
                  <div className="p-4 bg-slate-50 text-slate-700 rounded-2xl border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors duration-300">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {feature.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-2 group-hover:text-orange-400 transition-colors">
                    Hover to reveal details →
                  </span>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 w-full h-full bg-slate-900 text-white border border-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {/* Decorative structural top indicator */}
                  <div className="absolute top-4 w-12 h-1 bg-orange-500 rounded-full" />
                  
                  <h3 className="text-base font-bold text-orange-400 tracking-tight mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}