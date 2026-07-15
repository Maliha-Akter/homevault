import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register | HomeVault",
    description: "Sign up in to your HomeVault account to securely access and manage your home inventory.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}