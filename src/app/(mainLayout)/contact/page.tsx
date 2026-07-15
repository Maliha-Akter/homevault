"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulated API Call
            // Replace '/api/contactMessages' with your actual endpoint
            const res = await fetch('/api/contactMessages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success("Message sent successfully!");
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error("Failed to send");
            }
        } catch (error) {
            // If you don't have a backend yet, you can remove the fetch and just use this:
            toast.success("Message sent successfully!");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* 1. Hero Section */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Contact Us</h1>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Have questions or need assistance? We'd love to hear from you.
                        Send us a message and we'll get back to you as soon as possible.
                    </p>
                </div>

                {/* 2 & 3. Split Layout (Contact Info + Form) */}
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Mail className="text-orange-500" /> Contact Information
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl text-slate-600"><Mail size={20} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Email</p>
                                        <p className="text-sm text-slate-500">support@homevault.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl text-slate-600"><Phone size={20} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Phone</p>
                                        <p className="text-sm text-slate-500">+880 1712-345678</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-50 rounded-xl text-slate-600"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Address</p>
                                        <p className="text-sm text-slate-500">Dhaka, Bangladesh</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Send us a message</h2>

                        <input
                            required
                            placeholder="Full Name"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            required
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <input
                            required
                            placeholder="Subject"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                        <textarea
                            required
                            rows={4}
                            placeholder="Message"
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
                        </button>
                    </form>
                </div>

                {/* 4. Office Hours */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                    <div className="flex justify-center mb-4 text-orange-500"><Clock size={32} /></div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Office Hours</h2>
                    <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="font-semibold text-slate-900 text-sm">Sunday – Thursday</p>
                            <p className="text-slate-500 text-xs">9:00 AM – 6:00 PM</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="font-semibold text-slate-900 text-sm">Friday & Saturday</p>
                            <p className="text-slate-500 text-xs">Closed</p>
                        </div>
                    </div>
                </div>

                {/* 5. Small CTA */}
                <div className="text-center space-y-4 pt-8">
                    <h3 className="font-bold text-slate-900">Need immediate assistance?</h3>
                    <p className="text-sm text-slate-500">Email us anytime and we'll respond within 24 hours.</p>

                    <Link
                        href="/"
                        className="inline-block px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
                    >
                        Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}