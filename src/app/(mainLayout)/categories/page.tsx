"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Package, Edit2, ChevronLeft, ChevronRight, Calendar, ArrowUpDown } from "lucide-react";
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
    createdAt?: string;
}

export default function CategoriesPage() {
    const { data: session } = authClient.useSession();
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryNames, setCategoryNames] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [timeFrame, setTimeFrame] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // 👈 Added Ref to keep track of active network requests
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchInitialNames = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/categories?limit=all`, {
                    cache: 'no-store' // 👈 Added frontend cache bypass
                });
                const data = await res.json();
                if (data.success) {
                    const names: string[] = Array.from(
                        new Set(data.data.map((cat: Category) => cat.name).filter(Boolean))
                    ) as string[];
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

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const queryParams = new URLSearchParams({
                search: search.trim(),
                categoryName: selectedCategory,
                timeFrame: timeFrame,
                sortBy: sortBy,
                page: page.toString(),
                limit: "9",
                timestamp: Date.now().toString() // 👈 ADD THIS BACK: The ultimate cache killer
            });

            const res = await fetch(`${baseUrl}/api/categories?${queryParams}`, {
                cache: 'no-store',
                signal: controller.signal
            });

            const data = await res.json();

            if (data.success) {
                setCategories(data.data);
                setTotalPages(data.pagination?.totalPages || 1);
            } else {
                toast.error(data.message || "Failed to load categories.");
            }
        } catch (err: any) {
            // 👈 If the error was just us cancelling the request, ignore it
            if (err.name === "AbortError") {
                return;
            }
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
    }, [search, selectedCategory, timeFrame, sortBy, page]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setPage(1);
    };

    const handleTimeFrameChange = (frame: string) => {
        setTimeFrame(frame);
        setPage(1);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setPage(1);
    };

    const RenderIcon = ({ name }: { name: string }) => {
        const IconComponent = (LucideIcons as any)[name];
        return IconComponent ? <IconComponent className="w-5 h-5 text-slate-400" /> : <Package className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="space-y-6 container mx-auto px-4 py-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vault Categories</h1>
                <p className="text-sm text-slate-500 mt-1">Search, organize and structure storage inventory classes.</p>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">

                {/* Search Input */}
                <div className="w-full md:max-w-md relative flex items-center">
                    <div className="absolute left-3.5 z-10 pointer-events-none">
                        <Search className="text-slate-400" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search categories by keyword..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500/20 transition-all placeholder-slate-400 text-slate-800"
                    />
                </div>

                {/* Filters Group */}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">

                    {/* Category Name Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider shrink-0 mt-2 min-w-[90px]">
                            <SlidersHorizontal size={14} />
                            Category:
                        </span>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleCategoryChange("all")}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${selectedCategory === "all"
                                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                    : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                                    }`}
                            >
                                All Categories
                            </button>

                            {categoryNames.map((name) => (
                                <button
                                    key={name}
                                    onClick={() => handleCategoryChange(name)}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${selectedCategory === name
                                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Created & Sort Filters */}
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider shrink-0 mt-2 min-w-[90px]">
                                <Calendar size={14} />
                                Created:
                            </span>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "All Time", value: "all" },
                                    { label: "Today", value: "today" },
                                    { label: "This Week", value: "week" },
                                    { label: "This Month", value: "month" },
                                ].map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() => handleTimeFrameChange(item.value)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${timeFrame === item.value
                                            ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                            : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Control */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider shrink-0 ml-0 md:ml-4">
                                <ArrowUpDown size={14} />
                                Sort:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-72 p-4 flex flex-col justify-between space-y-3 animate-pulse border border-slate-200 rounded-2xl bg-white shadow-sm"
                        />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No categories found</h3>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or date filter settings.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <div key={cat._id} className="group overflow-hidden bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col h-full rounded-2xl">
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
                                        {(session?.user as { role?: string })?.role === "admin" && (
                                            <Link
                                                href={`/dashboard/edit-category/${cat._id}`}
                                                className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-orange-100 hover:text-orange-600 transition-colors"
                                                title="Edit Category"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                        )}
                                        <Link
                                            href={`/categories/${cat._id}`}
                                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-orange-500 transition-colors flex-1 text-center"
                                        >
                                            View Category Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setPage(pageNumber)}
                                        className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${page === pageNumber
                                            ? "bg-slate-900 text-white border-slate-900"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}