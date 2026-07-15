"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Box, 
    Compass, 
    PlusCircle, 
    LayoutDashboard, 
    User as UserIcon,
    LogOut, 
    Loader2, 
    Users, 
    X 
} from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';
import { type User } from '@/app/lib/auth';
import { toast } from 'react-toastify';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { data: session } = authClient.useSession();
    const user = session?.user as User | undefined;
    const isAdmin = user?.role === "admin";

    // 1. Base links visible to all authenticated users
    const sidebarLinks = [
        {
            label: 'Dashboard',
            href: isAdmin ? '/dashboard/admin' : '/dashboard/user',
            icon: <LayoutDashboard className="w-5 h-5" />
        },
        { 
            label: 'My Inventory', 
            href: isAdmin ? '/dashboard/admin/view-inventory' : '/dashboard/user/view-inventory', 
            icon: <Box className="w-5 h-5" /> 
        },
        { 
            label: 'Categories', 
            href: '/dashboard/categories', 
            icon: <Compass className="w-5 h-5" /> 
        },
    ];

    // 2. Conditionally insert "Add Categories" and "Manage Users" ONLY if user is verified as an admin
    if (isAdmin) {
        sidebarLinks.push({
            label: 'Add Categories',
            href: '/dashboard/add-categories',
            icon: <PlusCircle className="w-5 h-5" />
        });
        sidebarLinks.push({
            label: 'Users Details',
            href: '/dashboard/admin/manage-users',
            icon: <Users className="w-5 h-5" />
        });
    }

    // 3. Add regular trailing layout items
    sidebarLinks.push({ label: 'Profile', href: '/dashboard/profile', icon: <UserIcon className="w-5 h-5" /> });
    sidebarLinks.push({ label: 'Add Inventory', href: '/dashboard/add-inventory', icon: <UserIcon className="w-5 h-5" /> });

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully!");
                        window.location.href = "/";
                    },
                },
            });
        } catch (error) {
            toast.error("Failed to log out cleanly.");
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
                    isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                }`}
            >
                {/* Top Brand Section */}
                <div>
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                        <Link 
                            href="/" 
                            className="text-lg font-black tracking-wider flex items-center gap-2 group"
                            onClick={() => onClose()} // Auto-close on mobile when clicking brand
                        >
                            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-2 py-0.5 rounded-md text-xs">
                                HV
                            </span>
                            <span className="text-white font-bold">HomeVault</span>
                        </Link>

                        {/* Mobile Close Button */}
                        <button 
                            onClick={onClose} 
                            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => onClose()} // Auto-close drawer on mobile upon link click
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/10"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                    }`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Profile / Logout Action Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/40 shrink-0">
                    {user && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden border border-slate-600 shrink-0">
                                {user.image ? (
                                    <img src={user.image} alt="User Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="truncate min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            <>
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}