"use client";

import React, { useState, useEffect } from 'react';
import { getCleanUserList } from "@/app/actions/user";

export default function ManageUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCleanUserList().then(setUsers).finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div className="text-center p-20 font-bold text-slate-500">Syncing directory...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    User <span className="text-orange-500">Directory</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Manage system participants and verify statuses.</p>
            </div>

            {/* Main Content Card - Silver Gradient border effect */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-slate-300 via-orange-500 to-slate-300" />
                
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Name</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Email</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Role</th>
                            <th className="p-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-orange-50/30 transition-colors">
                                <td className="p-4 font-bold text-slate-800">{user.name}</td>
                                <td className="p-4 text-slate-600 font-mono text-sm">{user.email}</td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                        user.emailVerified 
                                        ? 'bg-orange-100 text-orange-700' 
                                        : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        {user.emailVerified ? "Verified" : "Pending"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}