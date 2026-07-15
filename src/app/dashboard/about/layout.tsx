import React from "react";
import { Metadata } from "next";

// ✅ This works perfectly because layouts are Server Components by default!
export const metadata: Metadata = {
    title: "About Us | HomeVault",
    description: "View and edit your personal profile details, account security, and avatar.",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}