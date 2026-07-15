"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex w-full min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {/* Sidebar receives the open state and closer function */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Top Header Bar (Hidden on desktop) */}
                <header className="md:hidden flex items-center justify-between h-16 px-4 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-sm tracking-wider">HomeVault</span>
                    <div className="w-6" /> {/* Invisible spacer to perfectly center the brand text */}
                </header>

                {/* Main window panel for dashboard views */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}