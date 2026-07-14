"use client";

import React, { useState, useEffect } from 'react';
import { Card, Input } from "@heroui/react";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import Link from 'next/link';

interface Category {
    _id: string;
    name: string;
    icon: string;
    image: string;
    description: string;
    isDefault: boolean;
    isApproved: boolean;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryNames, setCategoryNames] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchInitialNames = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/categories`);
                const data = await res.json();
                if (data.success) {
                    const names: string[] = data.data.map((cat: Category) => cat.name);
                    setCategoryNames(names);
                }
            } catch (err) {
                console.error("Error setting filter navigation:", err);
            }
        };
        fetchInitialNames();
    }, [baseUrl]);

    const fetchFilteredCategories = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search: search,
                categoryName: selectedCategory
            });
            const res = await fetch(`${baseUrl}/api/categories?${queryParams}`);
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            } else {
                toast.error(data.message || "Failed to load categories.");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            toast.error("Network error connecting to backend.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchFilteredCategories();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, selectedCategory]);

    const RenderIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-5 h-5 text-slate-400" /> : <Package className="w-5 h-5 text-slate-400" />;
    };

    return (
        // Applied consistent px-4 throughout to ensure spacing
        <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">
            
            {/* Centered Header */}
            <header className="text-center w-full">
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Vault Categories</h1>
                <p className="text-sm md:text-lg text-slate-500 mt-2 max-w-lg mx-auto">Search, organize and structure your inventory storage classes with ease.</p>
            </header>

            {/* Fixed Filter & Search Section */}
            <section className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm w-full">
                <div className="max-w-xl mx-auto w-full mb-6">
                    <Input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startContent={<Search className="text-slate-400" size={20} />}
                        className="w-full"
                    />
                </div>

                {/* Filter Row - Made explicit block with flex-wrap to ensure visibility */}
                <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest mr-2">
                            <SlidersHorizontal size={14} /> Filter:
                        </span>
                        
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === "all" ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                            All
                        </button>

                        {categoryNames.map((name) => (
                            <button
                                key={name}
                                onClick={() => setSelectedCategory(name)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selectedCategory === name ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid Layout */}
            <main className="w-full">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i} className="h-72 animate-pulse bg-slate-100" />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800">No categories found</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <Card key={cat._id} className="group flex flex-col rounded-3xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-lg">
                                <div className="h-40 w-full relative bg-slate-100 overflow-hidden">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="font-black text-slate-900 mb-2 truncate">{cat.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-1">{cat.description || "No description provided."}</p>
                                    <Link
                                        href={`/dashboard/add-inventory?categoryId=${cat._id}&categoryName=${encodeURIComponent(cat.name)}`}
                                        className="w-full text-center py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                                    >
                                        View Inventory
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}