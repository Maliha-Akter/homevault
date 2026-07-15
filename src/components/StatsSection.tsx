"use client";

import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  Package, 
  Users, 
  Star, 
  Tag, 
  CircleDollarSign 
} from "lucide-react";

interface PlatformStats {
  totalCategories: number;
  totalItems: number;
  totalUsers: number;
  defaultCategories: number;
  customCategories: number;
  totalInventoryValue: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseUrl}/api/stats/platform`);
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Error loading system metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [baseUrl]);

  // Helper to format currency values cleanly into standard Dollar notation
  const formatUSD = (value: number) => {
    if (value >= 1000000000) return `$ ${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$ ${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$ ${(value / 1000).toFixed(1)}K`;
    return `$ ${value.toLocaleString()}`;
  };

  const cardsData = [
    { 
      label: "Total Categories", 
      value: stats ? `${stats.totalCategories}+` : "0+", 
      icon: Folder, 
      color: "text-blue-500" 
    },
    { 
      label: "Items Stored", 
      value: stats ? `${stats.totalItems}+` : "0+", 
      icon: Package, 
      color: "text-emerald-500" 
    },
    { 
      label: "Active Users", 
      value: stats ? `${stats.totalUsers}+` : "0+", 
      icon: Users, 
      color: "text-purple-500" 
    },
    { 
      label: "Default Categories", 
      value: stats ? String(stats.defaultCategories) : "0", 
      icon: Star, 
      color: "text-amber-500" 
    },
    { 
      label: "Community Categories", 
      value: stats ? String(stats.customCategories) : "0", 
      icon: Tag, 
      color: "text-pink-500" 
    },
    { 
      label: "Inventory Value", 
      value: stats ? formatUSD(stats.totalInventoryValue) : "$ 0", 
      icon: CircleDollarSign, 
      color: "text-orange-500" 
    },
  ];

  return (
    <section className="py-16 px-4 container mx-auto my-12 relative">
      {/* Infinite Orange and Silver Shifting Border Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-border-glow {
          background-size: 200% 200%;
          animation: borderFlow 4s ease infinite;
        }
      `}} />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          Platform Metrics
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          HomeVault by the Numbers
        </h2>
        <p className="text-sm text-slate-500">
          Real-time global ecosystem analytics scaling fluidly across our distributed user database.
        </p>
      </div>

      {/* Stats Cards Display Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cardsData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className="relative p-[2px] rounded-2xl overflow-hidden bg-gradient-to-r from-orange-500 via-slate-300 to-orange-400 animate-border-glow shadow-sm hover:shadow-md transition-all duration-300 flex"
            >
              {/* Inner Body Panel (Mask Background) */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-[14px] w-full flex flex-col justify-between gap-4 z-10">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {card.label}
                  </span>
                  <div className={`p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {isLoading ? (
                  <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg mt-2" />
                ) : (
                  <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-1">
                    {card.value}
                  </h3>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}