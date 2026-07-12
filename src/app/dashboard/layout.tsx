// src/app/dashboard/layout.tsx
import Sidebar from '@/components/Sidebar';
import React from 'react';

// ✅ Add the metadata export here at the top of your dashboard layout file
export const metadata = {
    title: {
        default: "Dashboard | HomeVault",
        template: "%s | HomeVault",
    },
    description: "Manage your inventory items, categories, and track home asset statistics cleanly.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full min-h-screen bg-slate-50 text-slate-900">
            {/* Static left-docked Navigation menu */}
            <Sidebar />

            {/* Main window panel for dashboard views */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}