import React from 'react';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm mt-0.5">Welcome to your HomeVault control center.</p>
            </div>

            <div className="border border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white">
                <p className="text-slate-600 font-medium">Statistics view will placeholder text here.</p>
                <p className="text-xs text-slate-400 mt-1">Total Items • Active Categories • Storage Threshold Analytics</p>
            </div>
        </div>
    );
}