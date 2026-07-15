"use client";

import React, { useState, useEffect } from 'react';
import {
    Package, PieChart as PieIcon, DollarSign, Calendar,
    TrendingUp, Activity, Layers, Home, ArrowUpRight
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from '@/app/lib/auth-client';
import {
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// Color Palette for Pie Chart
const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#eab308'];

export default function UserDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL ;

                // 1. Fetch the token from your auth client
                const tokenResponse = await authClient.token();
                const token = tokenResponse?.data?.token;

                // 🔍 DEBUG LOGS: Open your browser console (F12) to see these!
                console.log("Auth Client Response:", tokenResponse);
                console.log("Extracted Token:", token);

                if (!token) {
                    toast.error("No active session found. Please log in again.");
                    setIsLoading(false);
                    return; // Stop execution if token is completely missing
                }

                const res = await fetch(`${baseUrl}/api/dashboard/stats`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Make sure 'Bearer ' has a space
                    }
                });

                console.log("Server Response Status:", res.status);

                const result = await res.json();
                if (result.success) {
                    setDashboardData(result.data);
                } else {
                    toast.error(result.message || "Could not load dashboard data.");
                }
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                toast.error("Network error while fetching dashboard.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // Pure Tailwind CSS Custom Spinner Loader
    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading your vault metrics...</p>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="p-8 text-center text-slate-500 font-medium">
                No dashboard data available. Start by adding an item!
            </div>
        );
    }

    const { cards, charts, recentActivity } = dashboardData;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vault Overview</h1>
                    <p className="text-sm text-slate-500">Real-time valuation and logistics tracking for your personal assets.</p>
                </div>
            </div>

            {/* SECTION 1: Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Items */}
                <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Items</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">{cards.totalItems}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                        <Package size={24} />
                    </div>
                </div>

                {/* Categories Used */}
                <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories Used</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">{cards.categoriesUsed}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                        <Layers size={24} />
                    </div>
                </div>

                {/* Estimated Value */}
                <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Est. Inventory Value</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">
                            ${cards.estimatedValue?.toLocaleString() || 0}
                        </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* Added This Month */}
                <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Added This Month</p>
                        <div className="flex items-center gap-1 mt-1">
                            <h3 className="text-2xl font-black text-slate-800">{cards.itemsThisMonth}</h3>
                            <span className="text-xs font-bold text-emerald-500 flex items-center">
                                <ArrowUpRight size={14} /> New
                            </span>
                        </div>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
                        <Calendar size={24} />
                    </div>
                </div>
            </div>

            {/* SECTION 2: Analytics Charts */}
            <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
                        <PieIcon size={16} className="text-orange-500" /> Items by Category
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={charts.itemsByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    labelLine={false}
                                >
                                    {charts.itemsByCategory.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Items by Category (Pie) */}
                

                {/* Chart 2: Items by Room (Bar) */}
                <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
                        <Home size={16} className="text-blue-500" /> Items by Room
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.itemsByRoom} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="room" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 3: Items Added Monthly (Line) */}
                <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
                        <TrendingUp size={16} className="text-emerald-500" /> Monthly Growth
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts.monthlyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="items" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* SECTION 3: Recent Activity */}
            <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3 mb-4">
                    <Activity size={16} className="text-orange-500" /> Recent Asset Activity
                </div>

                <div className="divide-y divide-slate-100">
                    {recentActivity && recentActivity.length > 0 ? (
                        recentActivity.map((item: any) => (
                            <div key={item._id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                                        {item.title?.substring(0, 2).toUpperCase() || "IT"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                        <p className="text-xs text-slate-400">
                                            {item.brand ? `${item.brand} • ` : ''}{item.room || 'No location specified'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-extrabold uppercase tracking-wide">
                                        {item.condition || 'Logged'}
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-400 py-4 text-center">No recent items found in your vault.</p>
                    )}
                </div>
            </div>
        </div>
    );
}