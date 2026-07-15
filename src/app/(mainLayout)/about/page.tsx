"use client";

import React from 'react';
import { Card } from "@heroui/react";
import { ShieldCheck, Package, LayoutDashboard, Search, BarChart3 } from "lucide-react";

export default function AboutPage() {
  const features = [
    { icon: <Package className="w-6 h-6" />, title: "Personal Inventory", desc: "Create a digital record of all your household items." },
    { icon: <LayoutDashboard className="w-6 h-6" />, title: "Smart Organization", desc: "Categorize belongings by room and custom types." },
    { icon: <Search className="w-6 h-6" />, title: "Search & Filter", desc: "Find any item instantly with powerful filtering tools." },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics", desc: "View item value and inventory health via charts." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            About HomeVault
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Who We Are
          </p>
        </header>

        {/* Introduction */}
        <section className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
          <p className="text-lg text-slate-700 leading-relaxed">
            HomeVault is a modern home inventory management platform designed to help people 
            organize and manage their household belongings digitally.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            Whether it's electronics, furniture, kitchen appliances, books, or valuable collectibles, 
            HomeVault provides a secure place to keep all your inventory records in one location.
          </p>
        </section>

        {/* Problem & Solution Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 border-none shadow-lg bg-orange-50 rounded-3xl">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">The Problem</h2>
            <p className="text-slate-700 mb-4">
              Many people own hundreds of items but have no organized record. Information is often 
              scattered across receipts and emails, making it difficult to track warranties, 
              costs, or locations.
            </p>
          </Card>

          <Card className="p-8 border-none shadow-lg bg-slate-900 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Our Solution</h2>
            <p className="text-slate-300 mb-4">
              HomeVault helps you build a digital inventory. Categorize belongings, upload images, 
              record details, and access everything from a single, secure dashboard.
            </p>
          </Card>
        </div>

        {/* Features Grid */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-slate-900">What You Can Do</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200">
                <div className="p-3 bg-slate-100 rounded-xl text-slate-600">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="text-center bg-white p-12 rounded-3xl border border-slate-200">
          <ShieldCheck className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4">Our Mission</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Our mission is to make home organization simple, secure, and accessible for everyone. 
            We believe that every household should have an easy way to keep track of valuable 
            possessions without relying on paper records or memory.
          </p>
        </section>

      </div>
    </div>
  );
}