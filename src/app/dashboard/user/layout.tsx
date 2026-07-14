import React from 'react';
import { requireRole } from '../../lib/security/session';

interface UserLayoutProps {
    children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
    // Blocks anyone who does not have the 'user' role
    await requireRole('user');
    
    return <>{children}</>;
}