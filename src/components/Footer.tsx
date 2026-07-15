"use client";

import React from 'react';
import Link from 'next/link';
import { authClient } from '../app/lib/auth-client'; // ✅ Added import for authentication

import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Heart
} from "lucide-react";
import { toast } from 'react-toastify';

interface FooterProps {
  callbackUrl?: string;
}

export default function Footer({ callbackUrl = "/dashboard" }: FooterProps) {
  const currentYear = 2026;

  const platformLinks = [
    { label: "Home", href: "/" },
    { label: "All Categories", href: "/categories" },
    { label: "About Us", href: "/about" },
  ];

  // ✅ Interactive Google OAuth Social Login Handler
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${callbackUrl}`,
      });
    } catch (err) {
      toast.error("Failed to authenticate with Google.");
    }
  };

  return (
    <footer className="relative bg-slate-950 text-slate-400 pt-20 pb-10 px-6 border-t border-slate-900 mt-32 overflow-hidden">
      
      {/* Premium Visual Layer: Subtle top border light bleed */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/3 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Dynamic 4-Column Layout Grid (Brand takes 2 columns, Links take 1 each) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-slate-900">

          {/* Column 1 & 2: Brand Profile Space */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white shadow-lg shadow-orange-500/15 transition-transform group-hover:scale-105 duration-300">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white select-none">
                Home<span className="text-orange-500 transition-colors group-hover:text-orange-400">Vault</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
              Secure digital inventory infrastructure built to manage, track, and protect household assets with granular structural records and real-time cloud data integrity.
            </p>

            {/* Premium Interactive Action Social Matrix */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleGoogleLogin}
                className="group p-3 bg-slate-900/60 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-orange-500/5 cursor-pointer outline-none"
                aria-label="Authenticate via Google Workspace"
              >
                <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.886H12.24z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Column 3: Platform Anchor Links */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest border-l-2 border-orange-500 pl-3 select-none">
              Platform Links
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {platformLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="inline-flex items-center hover:text-orange-400 transition-all duration-200 hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Operational Support Infrastructure */}
          <div className="space-y-5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest border-l-2 border-slate-800 pl-3 select-none">
              Contact Support
            </h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 bg-slate-900/80 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                </div>
                <a href="mailto:support@homevault.com" className="hover:text-white transition-colors break-all text-slate-400">
                  support@homevault.com
                </a>
              </li>
              
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 bg-slate-900/80 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors duration-200">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                </div>
                <a href="tel:+15550199" className="hover:text-white transition-colors text-slate-400">
                  +1 (555) 0199
                </a>
              </li>

              <li className="flex items-center gap-3 pt-1">
                <div className="p-1.5 bg-slate-900/40 text-slate-600 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                </div>
                <span className="text-slate-500 font-medium">Global Operations Inc.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Sub-Panel Footer Meta Information */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <p className="tracking-wide">
            © {currentYear} HomeVault System Technologies. All rights reserved.
          </p>
          
          <div className="flex items-center gap-1.5 bg-slate-900/40 px-3 py-1.5 rounded-full border border-slate-900/80 select-none">
            <span>Engineered with</span>
            <Heart className="w-3 h-3 text-orange-500 fill-orange-500 animate-pulse" />
            <span>for robust data management.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}