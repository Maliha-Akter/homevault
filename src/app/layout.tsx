import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. CRITICAL: Add the standard stylesheet import here
import "react-toastify/dist/ReactToastify.css"; 
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HomeVault",
  description: "Secure digital management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="grow flex flex-col">{children}</main>
        {/* 2. Note: 'richColors' is a property used by 'sonner'. For react-toastify, it won't break anything but it doesn't do anything either. */}
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}