"use client";

import { useState } from "react";
import { Card, Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { Eye, EyeOff, AtSign, Lock } from "lucide-react";
import { signIn, authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: callbackUrl,
            });

            if (error) {
                toast.error(error.message || "Login failed.");
            } else {
                toast.success("Welcome back!");

                // 1. Fetch the active session instance that was just generated
                const sessionResult = await authClient.getSession();
                const userRole = sessionResult?.data?.user?.role;

                // 2. Clear routing destination logic
                let targetDestination = callbackUrl;

                // If they logged in without a deep link and they are an admin, skip "/" entirely
                if (callbackUrl === "/" && userRole === "admin") {
                    targetDestination = "/dashboard/admin";
                } else if (callbackUrl === "/" && userRole === "user") {
                    targetDestination = "/dashboard/user";
                }

                // 3. Perform a clean hard navigation to completely wipe routing cache
                window.location.href = targetDestination;
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: window.location.origin + callbackUrl,
            });
        } catch (err) {
            toast.error("Failed to authenticate with Google.");
        }
    };

    return (
        <Card className="w-full p-8 shadow-2xl bg-zinc-950/40 backdrop-blur-xl rounded-[24px] border border-white/10">
            <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-800/60 mb-6 text-center">
                <h1 className="text-2xl font-black tracking-tight text-white">Log In</h1>
                <p className="text-xs text-zinc-400">Secure entry point into your HomeVault</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <TextField isRequired name="email" className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-zinc-300">Email Address</Label>
                    <InputGroup className="flex items-center gap-2 border border-white/10 rounded-xl px-3 bg-white/5 focus-within:border-amber-500 transition-colors">
                        <AtSign className="text-zinc-500" size={16} />
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent py-2 text-sm text-white outline-none" />
                    </InputGroup>
                </TextField>

                <TextField isRequired name="password" className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-medium text-zinc-300">Password</Label>
                        <Link href="/auth/ForgotPassword" size="sm" className="text-[11px] text-amber-500 hover:underline">Forgot password?</Link>
                    </div>
                    <InputGroup className="flex items-center gap-2 border border-white/10 rounded-xl px-3 bg-white/5 focus-within:border-amber-500 transition-colors">
                        <Lock className="text-zinc-500" size={16} />
                        <Input type={isVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent py-2 text-sm text-white outline-none" />
                        <button type="button" onClick={toggleVisibility} className="text-zinc-500">{isVisible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </InputGroup>
                </TextField>

                <Button type="submit" className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-orange-950/20 hover:opacity-95 active:scale-[0.99] transition-all" isLoading={isLoading}>
                    Log In
                </Button>
            </form>

            <div className="mt-5 flex flex-col gap-3">
                <Button onClick={handleGoogleLogin} className="w-full h-11 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                    <FcGoogle size={18} className="mr-2" /> Continue with Google
                </Button>
                <p className="text-center text-xs text-zinc-400 mt-2">
                    Don't have an account? <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-amber-500 hover:underline ml-1 font-medium">Register here</Link>
                </p>
            </div>
        </Card>
    );
}