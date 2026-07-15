"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Input, Spinner } from "@heroui/react";
import { User, Mail, Calendar, Shield, Edit3, Save, X, Upload, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    role: string;
    createdAt: string;
}

export default function UserProfilePage() {
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        image: ""
    });

    useEffect(() => {
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                image: session.user.image || ""
            });
        }
    }, [session]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Implemented File Upload Logic
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("image", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadData
            });
            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.data.url }));
                toast.success("Profile image uploaded!");
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const res = await authClient.updateUser({
                name: formData.name,
                image: formData.image,
            });

            if (res.error) {
                throw new Error(res.error.message || "Failed to update profile.");
            }

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err: any) {
            console.error("Profile Update Error:", err);
            toast.error(err.message || "Something went wrong.");
        } finally {
            setIsSaving(false);
        }
    };

    if (sessionLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Spinner color="warning" size="lg" label="Syncing authentication state..." />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="max-w-xl mx-auto text-center mt-12">
                <p className="text-slate-500 text-sm">No authorized session found. Please log in.</p>
            </div>
        );
    }

    const user = session.user as UserProfile;

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <Card className="p-8 border border-slate-200/80 shadow-xl bg-white rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-orange-500 to-amber-500" />

                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-500/20 ring-4 ring-orange-500/10 shadow-sm shrink-0 bg-slate-100 flex items-center justify-center relative">
                        {isUploading ? (
                            <Loader2 className="animate-spin text-orange-500" />
                        ) : (
                            <img
                                src={formData.image || user.image}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`;
                                }}
                            />
                        )}
                    </div>

                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                        <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-0.5 px-2.5 py-0.5 bg-orange-50 rounded-full inline-block">
                            {user.role || "user"} Account
                        </p>
                    </div>

                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            size="sm"
                            className="rounded-xl font-bold text-xs bg-slate-900 text-white shadow-md flex items-center gap-1.5 px-4"
                        >
                            <Edit3 size={14} /> Edit Profile
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                <User size={14} className="text-slate-400" /> Full Name
                            </label>
                            <Input
                                disabled={!isEditing}
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full text-sm outline-none"
                                variant="bordered"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                    <Shield size={14} className="text-slate-400" /> Profile Image URL
                                </label>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1"
                                    >
                                        {isUploading ? "Uploading..." : <><Upload size={12} /> Upload File</>}
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Input
                                disabled={!isEditing || isUploading}
                                type="url"
                                name="image"
                                // Regex: Matches start of string, http OR https, then ://, then at least one char
                                pattern="https?://.+"
                                title="Please enter a valid URL starting with http:// or https://"
                                value={formData.image}
                                onChange={handleInputChange}
                                className="w-full text-sm outline-none"
                                variant="bordered"
                                placeholder="https://example.com/avatar.jpg"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                    <Mail size={14} className="text-slate-400" /> Email Address
                                </label>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {user.emailVerified ? "Verified" : "Pending"}
                                </span>
                            </div>
                            <Input
                                disabled
                                readOnly
                                type="email"
                                defaultValue={user.email}
                                className="w-full text-sm opacity-70 cursor-not-allowed bg-slate-50"
                                variant="flat"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                            <Button
                                type="button"
                                variant="light"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({ name: user.name, image: user.image });
                                }}
                                className="rounded-xl font-semibold text-sm border border-slate-200 bg-white"
                            >
                                <X size={15} /> Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isSaving}
                                className="rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md px-6"
                            >
                                <Save size={15} /> Save Changes
                            </Button>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );
}