import React from "react";
import { Metadata } from "next";

// ✅ This works perfectly because layouts are Server Components by default!
export const metadata: Metadata = {
    title: "My Profile | HomeVault",
    description: "View and edit your personal profile details, account security, and avatar.",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}