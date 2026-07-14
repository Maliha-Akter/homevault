"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from "@heroui/react";
import { Edit3, Trash2, Package, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from '@/app/lib/auth-client';

interface InventoryItem {
    _id: string;
    userId: string;
    categoryId: string;
    categoryName?: string; // Kept for frontend rendering fallback
    title: string;
    brand: string;
    room: string;
    purchaseDate: string;
    purchasePrice: number | string;
    estimatedValue: number | string;
    warrantyExpiry: string;
    condition: string;
    image: string;
    notes: string;
    createdAt?: string;
}

export default function ViewInventoryPage() {
    const [hasMounted, setHasMounted] = useState(false);
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [editForm, setEditForm] = useState<InventoryItem>({
        _id: '',
        userId: '',
        categoryId: '',
        title: '',
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

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const fetchInventory = useCallback(async () => {
        setIsLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            if (!token) {
                toast.error("Session expired. Please log in again.");
                return;
            }

            const res = await fetch(`${baseUrl}/api/inventory`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const resData = await res.json();

            if (resData.success) {
                setItems(resData.data || []);
            } else {
                toast.error(resData.message || "Failed to load inventory logs.");
            }
        } catch (err) {
            console.error("Failed downloading asset collections:", err);
            toast.error("Network connectivity issue.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasMounted) {
            fetchInventory();
        }
    }, [fetchInventory, hasMounted]);

    const openEditMode = (item: InventoryItem) => {
        setSelectedItem(item);
        setEditForm({ ...item });
        setIsEditOpen(true);
    };

    const openDeleteConfirmation = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateAsset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        setActionLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            const res = await fetch(`${baseUrl}/api/inventory/${selectedItem._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Asset configuration saved successfully!");
                setIsEditOpen(false);
                fetchInventory();
            } else {
                toast.error(data.message || "Could not patch modifications.");
            }
        } catch (err) {
            toast.error("Network synchronization exception.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAsset = async () => {
        if (!selectedItem) return;
        setActionLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const tokenResponse = await authClient.token();
            const token = tokenResponse?.data?.token;

            const res = await fetch(`${baseUrl}/api/inventory/${selectedItem._id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Asset removed permanently.");
                setIsDeleteOpen(false);
                fetchInventory();
            } else {
                toast.error(data.message || "Deletion sequence failed.");
            }
        } catch (err) {
            toast.error("Network exception during asset cleaning.");
        } finally {
            setActionLoading(false);
        }
    };

    if (!hasMounted) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 font-medium">
                Initializing layout records...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm">
                        <Package size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personal Asset Logs</h1>
                        <p className="text-sm text-slate-500">Manage your verified tracking metrics, conditions, and household values.</p>
                    </div>
                </div>
                <Button 
                    onClick={fetchInventory} 
                    variant="flat" 
                    className="bg-slate-100 font-semibold text-slate-700 rounded-xl"
                    startContent={<RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />}
                >
                    Refresh Records
                </Button>
            </div>

            <Card className="p-4 border border-slate-200/80 shadow-sm bg-white rounded-2xl overflow-x-auto">
                <table className="min-w-full table-auto border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3 rounded-l-xl">ASSET ITEM</th>
                            <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3">MANUFACTURER / ROOM</th>
                            <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3">VALUATION</th>
                            <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3">QUALITY</th>
                            <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3 text-center rounded-r-xl">MANAGEMENT ACTIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-slate-400 font-medium">
                                    No inventory added yet. Click refresh or register items to get started.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                                    {/* Asset Item */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img src={item.image || "/placeholder.png"} alt={item.title} className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200/60" />
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                                                <div className="text-xs text-slate-400 max-w-[200px] truncate">{item.notes || "No notes available"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Brand & Room */}
                                    <td className="px-4 py-3.5">
                                        <div className="text-sm font-medium text-slate-700">{item.brand || "—"}</div>
                                        <div className="text-xs text-slate-400">{item.room || "Unassigned Room"}</div>
                                    </td>
                                    {/* Valuation Columns Unified */}
                                    <td className="px-4 py-3.5">
                                        <div className="text-sm font-black text-slate-900">{Number(item.purchasePrice).toLocaleString()} BDT</div>
                                        <div className="text-xs text-slate-400">Est: {Number(item.estimatedValue || 0).toLocaleString()} BDT</div>
                                    </td>
                                    {/* Quality Matrix */}
                                    <td className="px-4 py-3.5">
                                        <span className="text-xs font-bold text-slate-600 px-2.5 py-1 bg-slate-100 rounded-lg">{item.condition}</span>
                                    </td>
                                    {/* Management Actions */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button size="sm" isIconOnly variant="flat" onClick={() => openEditMode(item)} className="bg-orange-50 text-orange-600 rounded-lg">
                                                <Edit3 size={15} />
                                            </Button>
                                            <Button size="sm" isIconOnly variant="flat" onClick={() => openDeleteConfirmation(item)} className="bg-rose-50 text-rose-600 rounded-lg">
                                                <Trash2 size={15} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                
                {isLoading && (
                    <div className="py-6 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                        <RefreshCw size={14} className="animate-spin" /> Fetching real-time updates...
                    </div>
                )}
            </Card>

            {/* MODAL 1: EDIT ASSET DIALOG */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <form onSubmit={handleUpdateAsset} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-slate-900 font-black text-xl">Modify Asset Context</h2>
                        </div>
                        <div className="px-6 py-4 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Item Model/Title</label>
                                    <input required type="text" name="title" value={editForm.title} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Manufacturer Brand</label>
                                    <input required type="text" name="brand" value={editForm.brand} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Room Location</label>
                                    <input required type="text" name="room" value={editForm.room} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Category Unique ID</label>
                                    <input required type="text" name="categoryId" value={editForm.categoryId} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-600">Registry Notes / Descriptive Specs</label>
                                    <textarea required name="notes" value={editForm.notes} onChange={handleEditInputChange} className="w-full min-h-[70px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-orange-500 resize-none" />
                                </div>
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-600">Image Cover URL</label>
                                    <input required type="url" name="image" value={editForm.image} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Purchase Value (BDT)</label>
                                    <input required type="number" name="purchasePrice" value={editForm.purchasePrice} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Estimated Current Value (BDT)</label>
                                    <input required type="number" name="estimatedValue" value={editForm.estimatedValue} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Purchase Date</label>
                                    <input required type="date" name="purchaseDate" value={editForm.purchaseDate ? editForm.purchaseDate.substring(0, 10) : ""} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Warranty Expiration Date</label>
                                    <input required type="date" name="warrantyExpiry" value={editForm.warrantyExpiry ? editForm.warrantyExpiry.substring(0, 10) : ""} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500" />
                                </div>
                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-600">Current Quality Matrix</label>
                                    <select name="condition" value={editForm.condition} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 cursor-pointer">
                                        <option value="New">New</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
                            <Button variant="light" onClick={() => setIsEditOpen(false)} className="rounded-xl font-semibold">Cancel</Button>
                            <Button type="submit" isLoading={actionLoading} className="rounded-xl font-bold bg-orange-500 text-white shadow-sm px-5">Save Document changes</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL 2: CONFIRM DELETION DIALOG */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-2 text-rose-600 font-black text-lg mb-2">
                            <AlertTriangle size={20} /> Destructive Operation Warning
                        </div>
                        <div className="py-2 text-sm text-slate-500 leading-relaxed">
                            Are you absolutely certain you intend to wipe <strong className="text-slate-900 font-bold">"{selectedItem?.title}"</strong> permanently? This process cannot be reversed.
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-6">
                            <Button variant="light" onClick={() => setIsDeleteOpen(false)} className="rounded-xl font-semibold">Keep Asset</Button>
                            <Button isLoading={actionLoading} onClick={handleDeleteAsset} className="rounded-xl font-bold bg-rose-600 text-white shadow-sm px-5">Delete Document</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}