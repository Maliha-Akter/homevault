"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from "@heroui/react";
import { Edit3, Trash2, Package, AlertTriangle, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from '@/app/lib/auth-client';

interface InventoryItem {
    _id: string;
    userId: string;
    categoryId: string;
    categoryName?: string;
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
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
        } catch (err: any) {
            console.error("Failed downloading asset collections:", err);
            toast.error(err.message || "Network connectivity issue.");
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
        setEditForm({
            ...item,
            title: item.title || '',
            brand: item.brand || '',
            room: item.room || '',
            categoryId: item.categoryId || '',
            notes: item.notes || '',
            image: item.image || '',
            purchasePrice: item.purchasePrice ?? '',
            estimatedValue: item.estimatedValue ?? '',
            purchaseDate: item.purchaseDate || '',
            warrantyExpiry: item.warrantyExpiry || '',
            condition: item.condition || 'New'
        });
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
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
                toast.error(data.message || "Could not apply modifications.");
            }
        } catch (err: any) {
            toast.error("Network synchronization exception.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAsset = async () => {
        if (!selectedItem) return;
        setActionLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
        } catch (err: any) {
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm shrink-0">
                        <Package size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Personal Asset Logs</h1>
                        <p className="text-xs sm:text-sm text-slate-500">Manage your verified tracking metrics, conditions, and household values.</p>
                    </div>
                </div>
                <Button
                    onClick={fetchInventory}
                    variant="ghost"
                    className="w-full sm:w-auto bg-slate-100 font-semibold text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    Refresh Records
                </Button>
            </div>

            {/* Content Section */}
            <Card className="p-3 sm:p-4 border border-slate-200/80 shadow-sm bg-white rounded-2xl overflow-hidden">
                {items.length === 0 && !isLoading ? (
                    <div className="text-center py-12 text-slate-400 font-medium flex flex-col items-center justify-center gap-2">
                        <Package size={32} className="text-slate-300 stroke-1" />
                        <span className="text-sm px-4 text-center">No inventory added yet. Click refresh or register items to get started.</span>
                    </div>
                ) : (
                    <>
                        {/* --- MOBILE CARD VIEW (< lg) --- */}
                        <div className="grid grid-cols-1 gap-3 lg:hidden">
                            {items.map((item) => (
                                <div key={item._id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title || "Asset"}
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = 'none';
                                                        (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200/60 shrink-0"
                                                />
                                            ) : null}
                                            <div className={`w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0 ${item.image ? 'hidden' : ''}`}>
                                                <ImageIcon size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 text-sm truncate">{item.title || "Untitled Asset"}</div>
                                                <div className="text-xs text-slate-500 font-medium truncate">{item.brand || "—"} &bull; {item.room || "Unassigned"}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 px-2 py-0.5 bg-slate-200/60 rounded-md shrink-0">
                                            {item.condition || "N/A"}
                                        </span>
                                    </div>

                                    <div className="text-xs text-slate-400 line-clamp-2 pl-1 border-l-2 border-slate-200">
                                        {item.notes || "No notes available"}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-1">
                                        <div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 mb-1">
                                                {item.categoryName || "Uncategorized"}
                                            </span>
                                            <div className="text-xs font-black text-slate-900">{Number(item.purchasePrice || 0).toLocaleString()} BDT</div>
                                            <div className="text-[10px] text-slate-400">Est: {Number(item.estimatedValue || 0).toLocaleString()} BDT</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {/* Edit Button */}
                                            <Button size="sm" isIconOnly variant="ghost" onClick={() => openEditMode(item)} className="bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors shrink-0">
                                                <Edit3 size={15} />
                                            </Button>

                                            {/* Delete Button */}
                                            <Button size="sm" isIconOnly variant="ghost" onClick={() => openDeleteConfirmation(item)} className="bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors shrink-0">
                                                <Trash2 size={15} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* --- DESKTOP TABLE VIEW (>= lg) --- */}
                        <div className="hidden lg:block w-full overflow-x-auto">
                            {/* Changed to table-fixed and applied strict percentage widths */}
                            <table className="w-full table-fixed border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3 rounded-l-xl w-[35%]">ASSET ITEM</th>
                                        <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3 w-[15%]">CATEGORY</th>
                                        <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3 w-[20%]">MANUFACTURER / ROOM</th>
                                        <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3 w-[15%]">VALUATION</th>
                                        <th className="bg-slate-50/50 text-slate-600 font-bold px-4 py-3 text-center rounded-r-xl w-[15%]">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                                            <td className="px-4 py-3.5 overflow-hidden">
                                                <div className="flex items-center gap-3">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.title || "Asset"}
                                                            onError={(e) => {
                                                                (e.target as HTMLElement).style.display = 'none';
                                                                (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200/60 shrink-0"
                                                        />
                                                    ) : null}
                                                    <div className={`w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0 ${item.image ? 'hidden' : ''}`}>
                                                        <ImageIcon size={18} />
                                                    </div>
                                                    {/* min-w-0 is critical here to allow truncation inside flex */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-bold text-slate-900 text-sm truncate">{item.title || "Untitled Asset"}</div>
                                                        <div className="text-xs text-slate-400 truncate">{item.notes || "No notes available"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 overflow-hidden">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 truncate max-w-full">
                                                    {item.categoryName || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 overflow-hidden">
                                                <div className="text-sm font-medium text-slate-700 truncate">{item.brand || "—"}</div>
                                                <div className="text-xs text-slate-400 truncate">{item.room || "Unassigned Room"}</div>
                                            </td>
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="text-sm font-black text-slate-900">{Number(item.purchasePrice || 0).toLocaleString()} BDT</div>
                                                <div className="text-[11px] text-slate-400">Est: {Number(item.estimatedValue || 0).toLocaleString()} BDT</div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        isIconOnly
                                                        variant="ghost"
                                                        onClick={() => openEditMode(item)}
                                                        className="bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors shrink-0"
                                                    >
                                                        <Edit3 size={15} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        isIconOnly
                                                        variant="ghost"
                                                        onClick={() => openDeleteConfirmation(item)}
                                                        className="bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors shrink-0"
                                                    >
                                                        <Trash2 size={15} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {isLoading && (
                    <div className="py-8 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                        <RefreshCw size={16} className="animate-spin text-orange-500" /> Fetching real-time updates...
                    </div>
                )}
            </Card>

            {/* MODAL 1: EDIT ASSET DIALOG */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <form onSubmit={handleUpdateAsset} className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-slate-900 font-black text-lg sm:text-xl">Modify Asset Context</h2>
                            <button type="button" onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1">Close</button>
                        </div>

                        <div className="px-4 sm:px-6 py-4 overflow-y-auto space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Category Fields */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-400">Category Name</label>
                                    <input
                                        disabled
                                        type="text"
                                        value={editForm.categoryName || "Uncategorized"}
                                        className="w-full h-10 bg-slate-100 border border-slate-200 rounded-xl px-3 text-sm text-slate-500 cursor-not-allowed font-medium"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-400">Category Unique ID</label>
                                    <input
                                        disabled
                                        type="text"
                                        value={editForm.categoryId}
                                        className="w-full h-10 bg-slate-100 border border-slate-200 rounded-xl px-3 text-sm text-slate-400 cursor-not-allowed font-mono"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Item Model/Title</label>
                                    <input required type="text" name="title" value={editForm.title} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Manufacturer Brand</label>
                                    <input required type="text" name="brand" value={editForm.brand} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Room Location</label>
                                    <input required type="text" name="room" value={editForm.room} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-600">Registry Notes / Descriptive Specs</label>
                                    <textarea required name="notes" value={editForm.notes} onChange={handleEditInputChange} className="w-full min-h-[70px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors resize-none" />
                                </div>
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-600">Image Cover URL</label>
                                    <input
                                        required
                                        type="url"
                                        name="image"
                                        value={editForm.image}
                                        onChange={handleEditInputChange}
                                        pattern="^https?://.*"
                                        title="Image URL must start with http:// or https://"
                                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Purchase Value (BDT)</label>
                                    <input required type="number" name="purchasePrice" value={editForm.purchasePrice} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Estimated Current Value (BDT)</label>
                                    <input required type="number" name="estimatedValue" value={editForm.estimatedValue} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Purchase Date</label>
                                    <input required type="date" name="purchaseDate" value={editForm.purchaseDate ? editForm.purchaseDate.substring(0, 10) : ""} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-slate-600">Warranty Expiration Date</label>
                                    <input required type="date" name="warrantyExpiry" value={editForm.warrantyExpiry ? editForm.warrantyExpiry.substring(0, 10) : ""} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-600">Current Quality Matrix</label>
                                    <select name="condition" value={editForm.condition} onChange={handleEditInputChange} className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-colors cursor-pointer">
                                        <option value="New">New</option>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 bg-slate-50/50">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsEditOpen(false)}
                                className="rounded-xl font-semibold text-slate-600 w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl font-bold bg-orange-500 text-white shadow-sm px-5 hover:bg-orange-600 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                                {actionLoading ? "Saving Changes..." : "Save Document Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL 2: CONFIRM DELETION DIALOG */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6">
                        <div className="flex items-center gap-2 text-rose-600 font-black text-base sm:text-lg mb-2">
                            <AlertTriangle size={20} className="shrink-0" /> Destructive Operation Warning
                        </div>
                        <div className="py-2 text-sm text-slate-500 leading-relaxed">
                            Are you absolutely certain you intend to wipe <strong className="text-slate-900 font-bold">&ldquo;{selectedItem?.title}&rdquo;</strong> permanently? This process cannot be reversed.
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDeleteOpen(false)}
                                className="rounded-xl font-semibold text-slate-600 w-full sm:w-auto"
                            >
                                Keep Asset
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDeleteAsset}
                                className="rounded-xl font-bold bg-rose-600 text-white shadow-sm px-5 hover:bg-rose-700 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                                {actionLoading ? "Deleting..." : "Delete Document"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
