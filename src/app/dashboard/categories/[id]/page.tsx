"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, ArrowLeft, Calendar, Tag, PlusCircle, ChevronRight, CheckCircle2, Star, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";

export default function CategoryDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL ;

            try {
                const res = await fetch(`${baseUrl}/api/categories/${id}`);
                const data = await res.json();
                if (data.success) setCategory(data.data);
            } catch (err) {
                console.error("Error fetching category:", err);
            }

            const { data: sessionData } = await authClient.getSession();
            setSession(sessionData);
            setLoading(false);
        };

        if (id) fetchData();
    }, [id]);

    const handleAddInventoryClick = () => {
        if (!session) {
            const currentPath = `/dashboard/category/${id}`;
            toast.info("Please log in to add inventory.");
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
        } else {
            router.push(`/dashboard/add-inventory?categoryId=${category._id}&categoryName=${encodeURIComponent(category.name)}`);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-400 font-medium">Loading category assets...</div>;
    if (!category) return <div className="p-10 text-center">Category not found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <Link href="/dashboard/categories" className="inline-flex items-center text-slate-500 hover:text-orange-600 transition-colors font-medium">
                <ArrowLeft className="mr-2" size={20} /> Back to Vault
            </Link>

            {/* Main Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                {/* Updated Header: Moderate height with better aspect control */}
                <div className="h-64 md:h-80 w-full bg-slate-100 relative overflow-hidden">
                    {category.image ? (
                        <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <Package size={64} className="text-slate-300" />
                        </div>
                    )}

                    {/* Subtle gradient overlay to ensure text/tags pop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {category.isDefault && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                            System Default
                        </div>
                    )}
                </div>

                <div className="p-8 md:p-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">{category.name}</h1>
                    <p className="text-slate-600 text-lg leading-relaxed mb-10">{category.fullDescription}</p>

                    {/* New Data Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Package size={18} className="text-orange-500" /> Item Types
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.itemTypes?.map((type: string) => (
                                    <span key={type} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">{type}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Star size={18} className="text-orange-500" /> Popular Brands
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.popularBrands?.map((brand: string) => (
                                    <span key={brand} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-semibold">{brand}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl mb-8">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Lightbulb size={18} className="text-orange-500" /> Organization Tips
                        </h3>
                        <ul className="space-y-2">
                            {category.organizationTips?.map((tip: string, i: number) => (
                                <li key={i} className="flex items-start text-sm text-slate-600">
                                    <CheckCircle2 size={16} className="text-orange-500 mr-2 mt-0.5 shrink-0" /> {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                        <div className="flex items-center text-slate-500 bg-slate-50 p-4 rounded-xl">
                            <Calendar className="mr-3 text-orange-500" size={20} />
                            <span className="font-medium text-sm">Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-slate-500 bg-slate-50 p-4 rounded-xl">
                            <Tag className="mr-3 text-orange-500" size={20} />
                            <span className="font-medium text-sm">Status: {category.isApproved ? "Approved" : "Pending Review"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Card */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div>
                    <h3 className="text-2xl font-black text-white mb-2">Ready to add items?</h3>
                    <p className="text-slate-400">Expand your {category.name} collection by adding new inventory assets.</p>
                </div>
                <button
                    onClick={handleAddInventoryClick}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                >
                    <PlusCircle size={20} />
                    Add Your Inventory
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}