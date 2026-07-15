import React from 'react';
import { Metadata } from 'next';

// ✅ Metadata works perfectly here because layouts are Server Components by default
export const metadata: Metadata = {
  title: "Categories | HomeVault",
  description: "Browse, search, and manage inventory categories, organization tips, and popular brands.",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}