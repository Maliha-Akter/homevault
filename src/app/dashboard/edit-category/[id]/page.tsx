"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FolderPlus, Image as ImageIcon, FileText, Tag, Star, ListChecks, Plus, Trash2, ArrowLeft } from "lucide-react";
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'react-toastify';

export default function EditCategoryPage() {
    const { id } = useParams();
    const router = useRouter();

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("Laptop");
    const [image, setImage] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");

    const [itemTypes, setItemTypes] = useState<string[]>([""]);
    const [popularBrands, setPopularBrands] = useState<string[]>([""]);
    const [organizationTips, setOrganizationTips] = useState<string[]>([""]);

    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // 1. Fetch data for editing
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/categories/${id}`);
                const data = await res.json();
                if (data.success) {
                    const cat = data.data;
                    setName(cat.name);
                    setIcon(cat.icon || "Laptop");
                    setImage(cat.image);
                    setShortDescription(cat.shortDescription || "");
                    setFullDescription(cat.fullDescription || "");
                    setItemTypes(cat.itemTypes?.length ? cat.itemTypes : [""]);
                    setPopularBrands(cat.popularBrands?.length ? cat.popularBrands : [""]);
                    setOrganizationTips(cat.organizationTips?.length ? cat.organizationTips : [""]);
                }
            } catch (err) {
                toast.error("Failed to fetch category.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategory();
    }, [id, baseUrl]);

    // 2. Logic helpers
    const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(prev => [...prev, ""]);
    const removeField = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => setter(prev => prev.filter((_, i) => i !== index));
    const updateField = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => prev.map((item, i) => (i === index ? value : item)));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;
            if (!token) { toast.error("Unauthorized"); return; }

            const res = await fetch(`${baseUrl}/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    name, icon, image, shortDescription, fullDescription,
                    itemTypes: itemTypes.filter(i => i.trim() !== ""),
                    popularBrands: popularBrands.filter(b => b.trim() !== ""),
                    organizationTips: organizationTips.filter(t => t.trim() !== "")
                })
            });

            if (res.ok) {
                toast.success("Category updated!");
                router.push('/dashboard/categories');
            } else {
                toast.error("Failed to update.");
            }
        } catch (err) { 
            toast.error("Server error"); 
        } finally { 
            setIsLoading(false); 
        }
    };

    const handleDelete = async () => {
        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;
            const res = await fetch(`${baseUrl}/api/categories/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Category deleted!");
                setIsDeleteModalOpen(false);
                router.push('/dashboard/categories');
            } else {
                toast.error("Failed to delete category.");
            }
        } catch (err) { 
            toast.error("Delete failed"); 
        }
    };

    if (isLoading) {
        return <div className="text-center mt-10 text-slate-600 font-medium">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10 px-4">
            {/* Back Button */}
            <button 
                type="button"
                onClick={() => router.back()} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors w-fit"
            >
                <ArrowLeft size={16} /> Back
            </button>

            {/* Form Card Container */}
            <div className="w-full p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                    
                    {/* Category Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Category Name</label>
                        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-500/20 transition-all">
                            <FolderPlus className="text-slate-400 shrink-0" size={16} />
                            <input 
                                type="text"
                                required
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="w-full bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Image URL</label>
                        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-500/20 transition-all">
                            <ImageIcon className="text-slate-400 shrink-0" size={16} />
                            <input 
                                type="text"
                                value={image} 
                                onChange={(e) => setImage(e.target.value)} 
                                className="w-full bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Short Description</label>
                        <input 
                            type="text"
                            value={shortDescription} 
                            onChange={(e) => setShortDescription(e.target.value)} 
                            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all" 
                        />
                    </div>

                    {/* Full Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Full Description</label>
                        <div className="flex gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-500/20 transition-all">
                            <FileText className="text-slate-400 mt-1 shrink-0" size={16} />
                            <textarea 
                                value={fullDescription} 
                                onChange={(e) => setFullDescription(e.target.value)} 
                                className="w-full bg-transparent text-sm min-h-[80px] outline-none py-1 placeholder-slate-400" 
                            />
                        </div>
                    </div>

                    {/* Dynamic Fields Section */}
                    {[
                        { label: "Item Types", state: itemTypes, setter: setItemTypes, icon: Tag, placeholder: "e.g., Laptops" },
                        { label: "Popular Brands", state: popularBrands, setter: setPopularBrands, icon: Star, placeholder: "e.g., Apple" },
                        { label: "Organization Tips", state: organizationTips, setter: setOrganizationTips, icon: ListChecks, placeholder: "e.g., Use organizers" }
                    ].map((section) => (
                        <div key={section.label} className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-700">{section.label}</label>
                            {section.state.map((val, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 flex-1 bg-slate-50/50 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-orange-500/20 transition-all">
                                        <section.icon size={14} className="text-slate-400 shrink-0" />
                                        <input 
                                            type="text"
                                            placeholder={section.placeholder}
                                            value={val} 
                                            onChange={(e) => updateField(section.setter, idx, e.target.value)} 
                                            className="py-2.5 text-sm outline-none bg-transparent w-full" 
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeField(section.setter, idx)} 
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors shrink-0"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={() => addField(section.setter)} 
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors w-fit"
                            >
                                <Plus size={14} /> Add {section.label}
                            </button>
                        </div>
                    ))}

                    {/* Submit & Delete Panel */}
                    <div className="flex gap-3 mt-2">
                        {/* Update Button */}
                        <button
                            type="submit"
                            className="flex-1 h-11 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md hover:opacity-95 transition-all"
                        >
                            Update Changes
                        </button>

                        {/* Trigger Delete Modal Button */}
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex-1 h-11 rounded-xl px-6 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 transition-all font-semibold"
                        >
                            <Trash2 size={18} />
                            <span>Delete</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Custom Tailwind Overlay Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    {/* Modal Content */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Deletion</h3>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            Are you sure you want to delete the <span className="font-semibold text-slate-900">"{name}"</span> category? This action is permanent and cannot be undone.
                        </p>
                        
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}