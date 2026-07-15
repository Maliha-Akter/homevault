"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Button } from "@heroui/react";
import {
    PackagePlus, Info, DollarSign, Calendar, Shield,
    Tag, Home, FileText, Upload, Package
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from '@/app/lib/auth-client';

export default function AddInventoryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryCategoryId = searchParams.get('categoryId') || '';
    const queryCategoryName = searchParams.get('categoryName') || '';

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        categoryId: queryCategoryId,
        categoryName: queryCategoryName,
        brand: '',
        room: '',
        purchaseDate: '',
        purchasePrice: '',
        estimatedValue: '',
        warrantyExpiry: '',
        condition: 'New',
        image: '',
        notes: ''
    });

    // Fetch categories for the dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const tokenResponse = await authClient.token();
                const token = tokenResponse?.data?.token;

                const res = await fetch(`${baseUrl}/api/categories`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            console.log("File selected:", file);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            if (!token) {
                toast.error("Authentication expired. Please login again.");
                return;
            }

            const res = await fetch(`${baseUrl}/api/inventory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Asset logged into HomeVault successfully!");
                router.push('/dashboard/categories');
            } else {
                toast.error(data.message || "Failed to process asset registration.");
            }
        } catch (err) {
            console.error("Critical Failure:", err);
            toast.error("Network interface connection failure.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-md shadow-orange-500/20">
                    <PackagePlus size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Register New Vault Asset</h1>
                    <p className="text-sm text-slate-500">Log valuable household items to track ownership data, warranties, and assets.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Card className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
                            <Info size={16} className="text-orange-500" /> Basic Information
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Asset Title *</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., MacBook Pro M2"
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Target Category *</label>
                                <select
                                    required
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={(e) => {
                                        const selected = categories.find(c => c._id === e.target.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            categoryId: selected?._id || "",
                                            categoryName: selected?.name || "",
                                        }));
                                    }}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors cursor-pointer"
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* SECTION 2: Location & Logistics */}
                    <Card className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
                            <Tag size={16} className="text-orange-500" /> Logistics & Location
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Brand Manufacturer *</label>
                                <input
                                    required
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Apple, Sony"
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Room / Location *</label>
                                <div className="relative flex items-center">
                                    <Home size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                                    <input
                                        required
                                        type="text"
                                        name="room"
                                        value={formData.room}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Living Room"
                                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Current Condition *</label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors cursor-pointer"
                                >
                                    <option value="New">New</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Poor">Poor</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5 md:col-span-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-slate-600">Item Image Cover URL</label>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="text-[10px] font-bold text-orange-500 hover:underline flex items-center gap-1"
                                    >
                                        {isUploading ? "Uploading..." : <><Upload size={12} /> Upload File</>}
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                <div className="flex gap-3">
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        pattern="^https?://.*"
                                        title="Image URL must start with http:// or https://"
                                        placeholder="https://example.com/item-preview.jpg"
                                        className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                    />

                                    <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                                        {formData.image && /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i.test(formData.image) ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={16} className="text-slate-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
                            <DollarSign size={16} className="text-orange-500" /> Financials & Warranty
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Purchase Date *</label>
                                <input
                                    required
                                    type="date"
                                    name="purchaseDate"
                                    value={formData.purchaseDate}
                                    onChange={handleInputChange}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Warranty Expiration Date</label>
                                <input
                                    type="date"
                                    name="warrantyExpiry"
                                    value={formData.warrantyExpiry}
                                    onChange={handleInputChange}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Purchase Price *</label>
                                <input
                                    required
                                    type="number"
                                    name="purchasePrice"
                                    value={formData.purchasePrice}
                                    onChange={handleInputChange}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600">Estimated Current Value *</label>
                                <input
                                    required
                                    type="number"
                                    name="estimatedValue"
                                    value={formData.estimatedValue}
                                    onChange={handleInputChange}
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm border-b border-slate-100 pb-2">
                            <FileText size={16} className="text-orange-500" /> Additional Notes
                        </div>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="w-full min-h-[80px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-orange-500 transition-colors resize-none"
                        />
                    </Card>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="light" onClick={() => router.back()} className="rounded-xl font-semibold text-sm border border-slate-200 bg-white">Cancel</Button>
                        <Button type="submit" isLoading={isLoading} className="rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6">
                            Save Asset to Vault
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}