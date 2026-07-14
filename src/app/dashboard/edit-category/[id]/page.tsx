"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, TextField, Label, InputGroup, Input, TextArea } from "@heroui/react";
import { FolderPlus, ShieldCheck, Image as ImageIcon, FileText, Tag, Star, ListChecks, Plus, Trash2, ArrowLeft } from "lucide-react";
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'react-toastify';

export default function EditCategoryPage() {
    const { id } = useParams();
    const router = useRouter();

    const [name, setName] = useState("");
    const [icon, setIcon] = useState("Laptop");
    const [image, setImage] = useState("");
    const [fileName, setFileName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");

    const [itemTypes, setItemTypes] = useState<string[]>([""]);
    const [popularBrands, setPopularBrands] = useState<string[]>([""]);
    const [organizationTips, setOrganizationTips] = useState<string[]>([""]);

    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
        } catch (err) { toast.error("Server error"); } finally { setIsLoading(false); }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;
            const res = await fetch(`${baseUrl}/api/categories/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Category deleted!");
                router.push('/dashboard/categories');
            }
        } catch (err) { toast.error("Delete failed"); }
    };

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <Button variant="flat" onPress={() => router.back()} className="text-slate-600">
                <ArrowLeft size={16} /> Back
            </Button>

            <Card className="w-full p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                    <TextField isRequired className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Category Name</Label>
                        <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-orange-500">
                            <FolderPlus className="text-slate-400" size={16} />
                            <Input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none" />
                        </InputGroup>
                    </TextField>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Image URL</Label>
                        <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50">
                            <ImageIcon className="text-slate-400" size={16} />
                            <Input value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none" />
                        </InputGroup>
                    </div>

                    <TextField className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Short Description</Label>
                        <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
                    </TextField>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Full Description</Label>
                        <InputGroup className="flex gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50">
                            <FileText className="text-slate-400 mt-1" size={16} />
                            <TextArea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="w-full bg-transparent text-sm min-h-[80px]" />
                        </InputGroup>
                    </div>

                    {[
                        { label: "Item Types", state: itemTypes, setter: setItemTypes, icon: Tag, placeholder: "e.g., Laptops" },
                        { label: "Popular Brands", state: popularBrands, setter: setPopularBrands, icon: Star, placeholder: "e.g., Apple" },
                        { label: "Organization Tips", state: organizationTips, setter: setOrganizationTips, icon: ListChecks, placeholder: "e.g., Use organizers" }
                    ].map((section) => (
                        <div key={section.label} className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-slate-700">{section.label}</Label>
                            {section.state.map((val, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 flex-1 bg-slate-50/50">
                                        <section.icon size={14} className="text-slate-400" />
                                        <Input value={val} onChange={(e) => updateField(section.setter, idx, e.target.value)} className="py-2 text-sm outline-none bg-transparent" />
                                    </InputGroup>
                                    <Button isIconOnly variant="flat" color="danger" onClick={() => removeField(section.setter, idx)} className="h-10 w-10">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                            <Button size="sm" variant="flat" onPress={() => addField(section.setter)} className="w-fit text-xs text-orange-600">
                                <Plus size={14} /> Add {section.label}
                            </Button>
                        </div>
                    ))}

                    <div className="flex gap-3 mt-2">
                        {/* Update Button */}
                        <Button
                            type="submit"
                            className="flex-1 h-11 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md hover:opacity-90"
                        >
                            Update Changes
                        </Button>

                        {/* Delete Button: Equal width + hover border effect */}
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={handleDelete}
                            className="flex-1 h-11 rounded-xl px-6 flex items-center justify-center gap-2 border-2 border-transparent hover:border-danger hover:bg-danger/10 transition-all"
                        >
                            <Trash2 size={18} />
                            <span>Delete</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}