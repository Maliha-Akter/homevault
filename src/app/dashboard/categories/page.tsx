"use client";

import React, { useState, useEffect } from 'react';
import { Card, Input, Button } from "@heroui/react";
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
    const [categoryNames, setCategoryNames] = useState<string[]>([]); // Holds distinct names for radio pills
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all"); // Tracks selected category name pill
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // 1. Initial Load: Fetch all available category names for the radio layout list
    useEffect(() => {
        const fetchInitialNames = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/categories`);
                const data = await res.json();
                if (data.success) {
                    // Extract unique names from all categories
                    const names: string[] = data.data.map((cat: Category) => cat.name);
                    setCategoryNames(names);
                }
            } catch (err) {
                console.error("Error setting filter navigation:", err);
            }
        };
        fetchInitialNames();
    }, []);

    // 2. Fetch/Filter categories based on text search input and chosen category pill
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
            toast.error("Network error connecting to resource cluster backend.");
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

    // Dynamic icon helper
    const RenderIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-5 h-5 text-slate-400" /> : <Package className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
            {/* Header section */}
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vault Categories</h1>
                <p className="text-sm text-slate-500 mt-1">Search, organize and structure storage inventory classes.</p>
            </div>

            {/* Top Bar: Search Bar & Dynamic Category Name Radio Pills */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">

                {/* Search Bar Input */}
                <div className="w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Search categories by keyword..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        startContent={<Search className="text-slate-400 mr-1" size={18} />}
                        className="w-full"
                    />
                </div>

                {/* Radio Type Filter Group using actual category names */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2 uppercase tracking-wider whitespace-nowrap">
                        <SlidersHorizontal size={14} /> Filter By:
                    </span>

                    {/* "All" Option Button */}
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${selectedCategory === "all"
                                ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        All Categories
                    </button>

                    {/* Dynamic Category Name Buttons */}
                    {categoryNames.map((name) => (
                        <button
                            key={name}
                            onClick={() => setSelectedCategory(name)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${selectedCategory === name
                                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Card Grid View Layout */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="h-72 p-4 flex flex-col justify-between space-y-3 animate-pulse border border-slate-200">
                            <div className="w-full h-36 bg-slate-200 rounded-xl" />
                            <div className="h-5 bg-slate-200 rounded w-1/2" />
                            <div className="h-4 bg-slate-200 rounded w-3/4" />
                        </Card>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No categories found</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">No match found for your current text parameters or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <Card key={cat._id} className="group overflow-hidden bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col h-full rounded-2xl">
                            {/* Card Image Cover Banner */}
                            <div className="h-36 w-full relative bg-slate-100 overflow-hidden shrink-0 border-b border-slate-100">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                        <Package className="w-10 h-10 text-slate-300" />
                                    </div>
                                )}

                                {/* Absolute Badges */}
                                <div className="absolute top-3 right-3 flex flex-col gap-1">
                                    {cat.isDefault && (
                                        <span className="bg-blue-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-sm">
                                            System Default
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Content Text Body */}
                            <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <RenderIcon name={cat.icon} />
                                        <h3 className="font-bold text-slate-800 text-base group-hover:text-orange-500 transition-colors truncate">
                                            {cat.name}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                        {cat.description || "No description asset supplied for this category profile."}
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-slate-50 flex items-center justify-end">
                                    <Link
                                        href={`/dashboard/add-inventory?categoryId=${cat._id}&categoryName=${encodeURIComponent(cat.name)}`}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition-colors"
                                    >
                                        View Inventory →
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}