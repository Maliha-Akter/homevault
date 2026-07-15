"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, User, Box, LayoutDashboard, Compass, PlusCircle } from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';
import { toast } from 'react-toastify';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Live session polling from better-auth
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const isLoggedIn = !!user;
    const isAdmin = user?.role === "admin";

    // Handle clicking outside to close menus cleanly
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsProfileDropdownOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(target) && !target.closest('.hamburger-btn')) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loggedOutLinks = [
        { label: 'Home', href: '/' },
        { label: 'Explore Categories', href: '/categories' },
        { label: 'About Us', href: '/about' },
        // { label: 'Blog', href: '/blog' },
        // { label: 'Contact', href: '/contact' },
    ];

    const loggedInLinks = [
        { label: 'Home', href: '/' },
        { label: 'Explore Categories', href: '/categories' },
        { 
            label: 'Dashboard', 
            href: isAdmin ? '/dashboard/admin' : '/dashboard/user', 
            icon: <LayoutDashboard className="w-4 h-4 mr-1.5" /> 
        },
        { label: 'Profile', href: '/profile', icon: <User className="w-4 h-4 mr-1.5" /> },
    ];

    const activeLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setIsProfileDropdownOpen(false);
        setIsOpen(false);
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

    if (isPending) {
        return <div className="w-full h-16 bg-white border-b border-slate-100 sticky top-0 z-50 animate-pulse" />;
    }

    return (
        <nav className="w-full bg-gradient-to-l from-orange-50/60 via-slate-50 to-white border-b border-slate-200/60 sticky top-0 z-50 shadow-sm backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Brand Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-black tracking-wider flex items-center gap-2 group">
                            <span className="bg-gradient-to-r from-orange-500 via-zinc-400 to-zinc-500 text-white font-bold px-2 py-1 rounded-lg text-xs shadow-sm">
                                HV
                            </span>
                            <span className="bg-gradient-to-r from-orange-500 to-zinc-500 bg-clip-text text-transparent">
                                HomeVault
                            </span>
                        </Link>
                    </div>

                    {/* DESKTOP Links (Visible on lg layout screens) */}
                    <div className="hidden lg:flex space-x-8 items-center">
                        {activeLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${pathname === link.href ? "text-orange-600 font-semibold" : "text-slate-600 hover:text-orange-500"
                                    }`}
                            >
                                {'icon' in link && link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* RIGHT SECTION: Controls & Profile Toggle */}
                    <div className="flex items-center space-x-4">

                        {isLoggingOut ? (
                            <div className="flex items-center justify-center h-10 w-10">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></span>
                            </div>
                        ) : isLoggedIn ? (
                            /* Fixed Profile Icon Image/Fallback Dropdown Component (Visible on all viewports) */
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-slate-100 font-bold overflow-hidden focus:outline-none"
                                >
                                    {user?.image ? (
                                        <img src={user.image} alt="User profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-slate-500" />
                                    )}
                                </button>

                                {/* Dropdown Menu Context Window */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 top-12 mt-2 w-52 rounded-xl shadow-xl py-1 bg-white ring-1 ring-black/5 z-50 border border-slate-100 overflow-hidden">
                                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                                            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                                {user?.email} <span className="text-[10px] text-orange-500 font-bold uppercase ml-1">({user?.role})</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Unauthenticated Actions (Visible on lg layouts) */
                            <div className="hidden lg:flex items-center space-x-4">
                                <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors px-4 py-2">
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="text-sm font-bold text-white bg-gradient-to-r from-zinc-400 via-zinc-500 to-orange-500 px-4 py-2 rounded-xl shadow-md transition-all hover:opacity-95 active:scale-[0.98]"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Hamburger Trigger (Visible below lg break limit) */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="hamburger-btn text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-lg hover:bg-slate-200/50 transition-colors"
                                aria-label="Toggle Menu"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Drawer (Collapses completely on lg screen systems) */}
            {isOpen && (
                <div className="lg:hidden bg-white/95 border-t border-slate-200/60 px-4 pt-2 pb-4 space-y-1 shadow-inner backdrop-blur-lg" ref={menuRef}>
                    {activeLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-all ${pathname === link.href ? "text-orange-600 bg-orange-50/50 font-semibold" : "text-slate-600 hover:text-orange-500 hover:bg-slate-50"
                                }`}
                        >
                            {'icon' in link && link.icon}
                            {link.label}
                        </Link>
                    ))}

                    {!isLoggedIn && (
                        <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2 px-3">
                            <Link
                                href="/auth/login"
                                onClick={() => setIsOpen(false)}
                                className="text-center text-base font-semibold text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl border border-slate-200 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                onClick={() => setIsOpen(false)}
                                className="text-center text-base font-bold text-white bg-gradient-to-r from-zinc-400 via-zinc-500 to-orange-500 py-2.5 rounded-xl transition-colors shadow-sm"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}