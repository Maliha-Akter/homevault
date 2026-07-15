"use client";

import React, { useState, useEffect } from 'react';
import {
  Users, Folder, Package, Star, Activity,
  CircleDot, Layers, TrendingUp, PieChart as PieIcon
} from 'lucide-react';
import { toast } from "react-toastify";
import { authClient } from '@/app/lib/auth-client';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

// Matching Color Palette from User Dashboard
const COLORS = ['#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#eab308'];

// --- TS Interfaces ---
interface DashboardCards {
  totalUsers: number;
  totalCategories: number;
  totalInventoryItems: number;
  defaultCategories: number;
}

interface DistributionData {
  name: string;
  value: number;
}

interface GrowthData {
  month: string;
  count: number;
}

interface ActivityItem {
  id: string;
  type: 'user' | 'category' | 'inventory';
  message: string;
  createdAt: string;
}

interface DashboardData {
  cards: DashboardCards;
  charts: {
    inventoryDistribution: DistributionData[];
    userGrowth: GrowthData[];
    itemsAdded: GrowthData[];
  };
  recentActivity: ActivityItem[];
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        // 1. Fetch token securely from authClient
        const tokenResponse = await authClient.token();
        const token = tokenResponse?.data?.token;

        console.log("Admin Token Sync Verification:", token ? "Token Present" : "Missing");

        if (!token) {
          toast.error("No active session found. Please log in again.");
          setIsLoading(false);
          return;
        }

        // 2. Query target server stats endpoint
        const response = await fetch(`${baseUrl}/api/admin/dashboard/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const resJson = await response.json();
        if (resJson.success) {
          setDashboardData(resJson.data);
        } else {
          toast.error(resJson.message || 'Failed to fetch admin statistics.');
        }
      } catch (err) {
        console.error("Admin Dashboard Fetch Error:", err);
        toast.error('Network error: Could not connect to dashboard services.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  // Pure Tailwind CSS Custom Spinner Loader (Matching User Dashboard)
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading System Insights...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        No system administration data payload available.
      </div>
    );
  }

  const { cards, charts, recentActivity } = dashboardData;

  // Merge duplicate categories (like "Uncategorized") directly on the frontend
  const mergedInventoryDistribution = charts.inventoryDistribution.reduce<DistributionData[]>((acc, curr) => {
    const existing = acc.find(item => item.name === curr.name);
    if (existing) {
      existing.value += curr.value; // Sum up the values
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-sm text-slate-500">Global metrics, system activities, and deep item data distribution.</p>
        </div>
      </div>

      {/* SECTION 1: Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{cards.totalUsers}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        {/* Total Categories */}
        <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Categories</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{cards.totalCategories}</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <Layers size={24} />
          </div>
        </div>

        {/* Total Inventory Items */}
        <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Items</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{cards.totalInventoryItems}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <Package size={24} />
          </div>
        </div>

        {/* Default System Categories */}
        <div className="p-5 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-row items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Default presets</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{cards.defaultCategories}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
            <Star size={24} />
          </div>
        </div>
      </div>

      {/* SECTION 2: Analytics Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Inventory Distribution (Pie Chart) */}
        <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
            <PieIcon size={16} className="text-orange-500" /> Inventory Distribution
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mergedInventoryDistribution} // <-- Changed this line
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {/* Update the cells mapping to use the merged data too */}
                  {mergedInventoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} items`, name]} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: New Users Growth (Bar Chart) */}
        <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
            <Users size={16} className="text-blue-500" /> New Users Growth
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} stroke="transparent" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} stroke="transparent" />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Items Added Timeline (Line Chart) */}
        <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
            <TrendingUp size={16} className="text-emerald-500" /> Items Added Timeline
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.itemsAdded} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} stroke="transparent" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} stroke="transparent" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3: Recent Activities */}
      <div className="p-6 border border-slate-200/80 shadow-sm bg-white rounded-2xl">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-100 pb-3 mb-4">
          <Activity size={16} className="text-orange-500" /> Recent System Activity Feed
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activity.type === 'user' ? 'bg-blue-50 text-blue-500' :
                      activity.type === 'category' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                    <CircleDot size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{activity.message}</p>
                    <p className="text-[11px] font-medium text-slate-400 capitalize">
                      System Action Category: {activity.type}
                    </p>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap pl-4">
                  <span className="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-md text-[10px] font-bold">
                    Logged
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(activity.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">No system events logged recently.</p>
          )}
        </div>
      </div>
    </div>
  );
}