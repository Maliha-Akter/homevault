import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth'; 

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    // 1. Grab server session cleanly using async context headers
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Clear redirect block with a local type assertion for the role property
    if (!session || (session.user as { role?: string }).role !== 'admin') {
        redirect('/auth/login');
    }
    
    return <>{children}</>;
}