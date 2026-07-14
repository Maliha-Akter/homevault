import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth'; // Ensure this points to your server-side auth config

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    // 1. Grab server session cleanly using async context headers
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Clear redirect block: if not logged in OR role isn't admin, redirect cleanly
    if (!session || session.user.role !== 'admin') {
        redirect('/auth/login');
    }
    
    return <>{children}</>;
}