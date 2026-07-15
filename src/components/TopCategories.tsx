"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@heroui/react";
import { Package, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from 'next/link';

interface Category {
    _id: string;
    name: string;
    icon: string;
    image: string;
    shortDescription: string;
    isDefault: boolean;
}

export default function TopCategories() {
    const [randomCategories, setRandomCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL ;

    useEffect(() => {
        const fetchRandomCategories = async () => {
            try {
                setIsLoading(true);
                // Calls the dedicated custom random endpoint
                const res = await fetch(`${baseUrl}/api/categories/random`);
                const data = await res.json();
                
                if (data.success) {
                    setRandomCategories(data.data);
                }
            } catch (err) {
                console.error("Error fetching top categories:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRandomCategories();
    }, [baseUrl]);

    const RenderIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? (
            <IconComponent className="w-5 h-5 text-slate-400" />
        ) : (
            <Package className="w-5 h-5 text-slate-400" />
        );
    };

    return (
        <section className="space-y-6 container mx-auto px-4 py-8">
            {/* Header Layout Component */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Categories</h2>
                    <p className="text-sm text-slate-500 mt-1">Explore some of our structural vault classes at a glance.</p>
                </div>
                <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition-colors shadow-sm self-start sm:self-auto whitespace-nowrap"
                >
                    Explore All Categories
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Render 3 Cards Grid Container */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="h-72 p-4 flex flex-col justify-between space-y-3 animate-pulse border border-slate-200" />
                    ))}
                </div>
            ) : randomCategories.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No categories available</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {randomCategories.map((cat) => (
                        <Card key={cat._id} className="group overflow-hidden bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col h-full rounded-2xl">
                            <div className="w-full aspect-video relative bg-slate-100 overflow-hidden shrink-0 border-b border-slate-100">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                        <Package size={40} className="text-slate-300" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />

                                <div className="absolute top-3 right-3">
                                    {cat.isDefault && (
                                        <span className="bg-white/90 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-md shadow-sm">
                                            System Default
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <RenderIcon name={cat.icon} />
                                        <h3 className="font-bold text-slate-800 text-base group-hover:text-orange-500 transition-colors truncate">{cat.name}</h3>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{cat.shortDescription || "No description provided."}</p>
                                </div>

                                <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2">
                                    <Link
                                        href={`/categories/${cat._id}`}
                                        className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold hover:bg-orange-500 hover:text-white transition-colors flex-1 text-center border border-slate-200 hover:border-orange-500"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}