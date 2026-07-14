"use client";

import React, { useState } from 'react';
import { Card, Button, TextField, Label, InputGroup, Input, TextArea } from "@heroui/react";
import { FolderPlus, ShieldCheck, Image as ImageIcon, FileText } from "lucide-react";
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'react-toastify';

export default function AddCategoryPage() {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("Box");
    const [image, setImage] = useState("");
    const [fileName, setFileName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("📂 [File Upload] Selected File:", file.name, "Size:", file.size, "Type:", file.type);
        setFileName(file.name);
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            console.log("📡 [File Upload] Sending POST request to /api/upload...");
            const response = await fetch("/api/upload", { method: "POST", body: formData });

            console.log("📥 [File Upload] Response status:", response.status);
            const data = await response.json();
            console.log("📦 [File Upload] Response Data:", data);

            if (data.success) {
                setImage(data.data.url);
                toast.success("Cover image asset updated cleanly!");
            } else {
                console.warn("⚠️ [File Upload] Server rejected file upload:", data.message);
                toast.error("Upload failed");
                setFileName("");
            }
        } catch (err: any) {
            console.error("❌ [File Upload] Critical catch error during upload pipeline:", err);
            toast.error("Network error while uploading image.");
            setFileName("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("🚀 [Form Submission] Initiated with values:", { name, icon, image, description });

        if (!name) {
            console.warn("⚠️ [Form Submission] Validation Failed: Name field is missing");
            toast.error("Category name field is required!");
            return;
        }

        setIsLoading(true);

        try {
            console.log("🔑 [Form Submission] Retrieving signed asymmetric JWT from client plugin...");
            
            // ✅ Fix: Pull token via the registered client plugin method
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            console.log("🎫 [Form Submission] Final Token Extracted:", token ? "Token Found ✅" : "MISSING/NULL ❌");

            if (!token) {
                console.error("❌ Authentication token couldn't be fetched locally. Are you logged in?");
                toast.error("Authentication expired. Please log in again.");
                setIsLoading(false);
                return;
            }

            const targetUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories`;
            console.log(`📡 [Form Submission] Dispatching fetch request to URL Target: ${targetUrl}`);

            const res = await fetch(targetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Sends full asymmetric token verified by JWKS
                },
                body: JSON.stringify({ name, icon, image, description })
            });

            console.log("📥 [Form Submission] Server Response Status Code:", res.status);
            const data = await res.json();
            console.log("📦 [Form Submission] Server Response Data Payload:", data);

            if (res.status === 201 || data.success) {
                toast.success("Category created successfully! Awaiting validation.");
                setName("");
                setImage("");
                setFileName("");
                setDescription("");
            } else {
                console.warn("⚠️ [Form Submission] Backend returned failure message:", data.message);
                toast.error(data.message || "Failed to finalize category registration.");
            }
        } catch (err: any) {
            console.error("❌ [Form Submission] Critical Pipeline Crash caught in Frontend:", err);
            toast.error("Unable to securely reach the cluster database network runtime.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Desired Category</h1>
                <p className="text-slate-500 text-sm mt-0.5">Propose custom grouping schemes to extend structural layout configurations.</p>
            </div>

            <Card className="w-full p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <TextField isRequired name="name" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Category Name</Label>
                        <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-orange-500 transition-colors">
                            <FolderPlus className="text-slate-400" size={16} />
                            <Input
                                value={name}
                                placeholder="e.g., Photography, Smart Home Items"
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none"
                            />
                        </InputGroup>
                    </TextField>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-semibold text-slate-700">Display Asset Image</Label>
                            {fileName && <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{fileName}</span>}
                        </div>
                        <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-orange-500 transition-colors">
                            <ImageIcon className="text-slate-400" size={16} />
                            <Input
                                placeholder="Paste image absolute URL link path"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                    if (fileName) setFileName("");
                                }}
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
                                htmlFor="category-file"
                                className="cursor-pointer text-orange-600 text-xs font-bold whitespace-nowrap hover:text-orange-500 transition-colors"
                            >
                                {isLoading && fileName ? "Uploading..." : "Browse"}
                            </label>
                        </InputGroup>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-slate-700">Description</Label>
                        <InputGroup className="flex gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 focus-within:border-orange-500 transition-colors">
                            <FileText className="text-slate-400 mt-1" size={16} />
                            <TextArea
                                value={description}
                                placeholder="Detail what kind of equipment belongs in this segment..."
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-transparent text-sm text-slate-900 outline-none min-h-[80px] resize-none"
                            />
                        </InputGroup>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={18} />
                        {isLoading ? "Processing..." : "Submit Proposal"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}