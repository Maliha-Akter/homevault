// src/app/dashboard/layout.tsx
import React from 'react';
import DashboardLayoutClient from './DashboardLayoutClient';

// ✅ Metadata stays here cleanly without throwing Client Component errors!
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
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    );
}