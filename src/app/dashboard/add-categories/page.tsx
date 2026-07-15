"use client";

import React, { useState } from 'react';
import { Card, Button, TextField, Label, InputGroup, Input, TextArea } from "@heroui/react";
import { FolderPlus, ShieldCheck, Image as ImageIcon, FileText, Tag, Star, ListChecks, Plus, Trash2 } from "lucide-react";
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'react-toastify';

export default function AddCategoryPage() {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("Laptop");
    const [image, setImage] = useState("");
    const [fileName, setFileName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [fullDescription, setFullDescription] = useState("");

    const [itemTypes, setItemTypes] = useState<string[]>([""]);
    const [popularBrands, setPopularBrands] = useState<string[]>([""]);
    const [organizationTips, setOrganizationTips] = useState<string[]>([""]);

    const [isLoading, setIsLoading] = useState(false);

    const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter(prev => [...prev, ""]);
    const removeField = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => setter(prev => prev.filter((_, i) => i !== index));
    const updateField = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => prev.map((item, i) => (i === index ? value : item)));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await response.json();
            if (data.success) {
                setImage(data.data.url);
                toast.success("Cover image asset updated cleanly!");
            } else {
                toast.error("Upload failed");
                setFileName("");
            }
        } catch (err: any) {
            toast.error("Network error while uploading image.");
            setFileName("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) { toast.error("Category name field is required!"); return; }

        setIsLoading(true);
        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            console.log("TOKEN:", token);
            console.log("TOKEN LENGTH:", token?.length);
            if (!token) { toast.error("Authentication expired."); setIsLoading(false); return; }

            const payload = {
                name, icon, image, shortDescription, fullDescription,
                itemTypes: itemTypes.filter(i => i.trim() !== ""),
                popularBrands: popularBrands.filter(b => b.trim() !== ""),
                organizationTips: organizationTips.filter(t => t.trim() !== "")
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/api/categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.status === 201 || data.success) {
                toast.success("Category created successfully!");
                setName(""); setImage(""); setFileName(""); setShortDescription(""); setFullDescription("");
                setItemTypes([""]); setPopularBrands([""]); setOrganizationTips([""]);
            } else {
                toast.error(data.message || "Failed to register category.");
            }
        } catch (err: any) {
            toast.error("Unable to reach the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Desired Category</h1>
                <p className="text-slate-500 text-sm mt-0.5">Propose custom grouping schemes to extend structural layout configurations.</p>
            </div>

            <Card className="w-full p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <TextField isRequired className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Category Name</Label>
                        <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-orange-500 transition-colors">
                            <FolderPlus className="text-slate-400" size={16} />
                            <Input value={name} placeholder="e.g., Electronics" onChange={(e) => setName(e.target.value)} className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none" />
                        </InputGroup>
                    </TextField>

                    {/* Image Upload */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Display Asset Image</Label>
                        <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-orange-500 transition-colors">
                            <ImageIcon className="text-slate-400" size={16} />
                            <Input
                                type="url"
                                pattern="https?://.+"
                                title="Please enter a valid URL starting with http:// or https://"
                                placeholder="https://example.com/avatar.png"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                    if (fileName) setFileName("");
                                }}
                                disabled={isLoading}
                                className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="category-file"
                                disabled={isLoading}
                            />
                            <label
                                htmlFor={isLoading ? undefined : "category-file"}
                                className={`cursor-pointer text-xs font-bold whitespace-nowrap ${isLoading ? 'text-slate-400 cursor-not-allowed' : 'text-orange-600 hover:text-orange-500'}`}
                            >
                                {isLoading ? "Uploading..." : "Browse"}
                            </label>
                        </InputGroup>
                    </div>

                    <TextField className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Short Description</Label>
                        <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="A brief summary..." className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" />
                    </TextField>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Full Description</Label>
                        <InputGroup className="flex gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus-within:border-orange-500 transition-colors">
                            <FileText className="text-slate-400 mt-1" size={16} />
                            <TextArea value={fullDescription} placeholder="Describe the category..." onChange={(e) => setFullDescription(e.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none min-h-[80px] resize-none" />
                        </InputGroup>
                    </div>

                    {/* Dynamic Lists Section with Placeholders */}
                    {[
                        { label: "Item Types", state: itemTypes, setter: setItemTypes, icon: Tag, placeholder: "e.g., Laptops, Tablets" },
                        { label: "Popular Brands", state: popularBrands, setter: setPopularBrands, icon: Star, placeholder: "e.g., Apple, Samsung" },
                        { label: "Organization Tips", state: organizationTips, setter: setOrganizationTips, icon: ListChecks, placeholder: "e.g., Use cable organizers" }
                    ].map((section) => (
                        <div key={section.label} className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold text-slate-700">{section.label}</Label>
                            {section.state.map((val, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 flex-1 bg-slate-50/50">
                                        <section.icon size={14} className="text-slate-400" />
                                        <Input value={val} placeholder={section.placeholder} onChange={(e) => updateField(section.setter, idx, e.target.value)} className="py-2 text-sm outline-none bg-transparent" />
                                    </InputGroup>
                                    {section.state.length > 1 && (
                                        <Button isIconOnly variant="flat" color="danger" onClick={() => removeField(section.setter, idx)} className="h-10 w-10">
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button size="sm" variant="flat" onPress={() => addField(section.setter)} className="w-fit text-xs text-orange-600">
                                <Plus size={14} className="mr-1" /> Add {section.label}
                            </Button>
                        </div>
                    ))}

                    <Button type="submit" disabled={isLoading} className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                        <ShieldCheck size={18} />
                        {isLoading ? "Processing..." : "Submit Proposal"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}