// src/app/auth/layout.tsx
"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Tracks if we are on /auth/login or /auth/register

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-black p-6">
      <motion.div
        key={pathname} // Tells Framer Motion to re-animate when the URL changes
        initial={{ opacity: 0, y: 30 }} // Starts lower down (y: 30) and invisible
        animate={{ opacity: 1, y: 0 }}   // Glides up to original position and fades in
        transition={{ duration: 0.35, ease: "easeOut" }} // Smooth easing transition
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
    </main>
  );
}