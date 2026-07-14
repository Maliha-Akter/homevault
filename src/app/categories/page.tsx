"use client";

import React, { useState, useEffect } from 'react';
import { Card, Input } from "@heroui/react";
import { Search, SlidersHorizontal, Package, Edit2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import Link from 'next/link';
import { authClient } from '@/app/lib/auth-client';

interface Category {
    _id: string;
    name: string;
    icon: string;
    image: string;
    shortDescription: string;
    fullDescription: string;
    itemTypes: string[];
    popularBrands: string[];
    organizationTips: string[];
    isDefault: boolean;
    isApproved: boolean;
}

export default function CategoriesPage() {
    const { data: session } = authClient.useSession();
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

    const RenderIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-5 h-5 text-slate-400" /> : <Package className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vault Categories</h1>
                <p className="text-sm text-slate-500 mt-1">Search, organize and structure storage inventory classes.</p>
            </div>

            {/* Filter Section - Fully Responsive */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col gap-4">
                    {/* Search */}
                    <div className="w-full md:max-w-md">
                        <Input
                            type="text"
                            placeholder="Search categories by keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startContent={
                                <Search className="text-slate-400 mr-1" size={18} />
                            }
                            className="w-full"
                        />
                    </div>

                    {/* Filters */}
                    <div className="border-t border-slate-100 pt-3">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider shrink-0">
                                <SlidersHorizontal size={14} />
                                Filter By:
                            </span>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${selectedCategory === "all"
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    All Categories
                                </button>

                                {categoryNames.map((name) => (
                                    <button
                                        key={name}
                                        onClick={() => setSelectedCategory(name)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${selectedCategory === name
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="h-72 p-4 flex flex-col justify-between space-y-3 animate-pulse border border-slate-200" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No categories found</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                    {categories.map((cat) => (
                        <Card key={cat._id} className="group overflow-hidden bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col h-full rounded-2xl">
                            {/* Updated Image Section: 16:9 Aspect Ratio and better object fit */}
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

                                {/* Gradient overlay for better text readability on images */}
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
                                    {session?.user?.role === "admin" && (
                                        <Link
                                            href={`/dashboard/edit-category/${cat._id}`}
                                            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-orange-100 hover:text-orange-600 transition-colors"
                                            title="Edit Category"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                    )}
                                    <Link
                                        href={`/categories/${cat._id}`} // Updated Route
                                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition-colors flex-1 text-center"
                                    >
                                        View Category Details →
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