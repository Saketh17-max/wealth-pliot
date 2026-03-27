"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { TrendingUp, Shield, Target, BarChart3, Zap } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleGoogleSignIn() {
        try {
            setLoading(true);
            setError("");
            await signInWithPopup(auth, googleProvider);
            router.replace("/dashboard");
        } catch (err: unknown) {
            setError("Sign-in failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const features = [
        { icon: Target, text: "Set & track financial goals" },
        { icon: TrendingUp, text: "AI-powered market insights" },
        { icon: BarChart3, text: "Portfolio rebalancing engine" },
        { icon: Shield, text: "Risk analysis & FIRE planning" },
        { icon: Zap, text: "Smart SIP & lumpsum calculator" },
    ];

    return (
        <div className="min-h-screen hero-bg flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center z-10">
                {/* Left: Branding */}
                <div className="space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                ₹
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">WealthPilot AI</h1>
                                <p className="text-xs text-slate-400">Intelligent Financial Co-Pilot</p>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Your money,{" "}
                            <span className="gradient-text">smarter.</span>
                        </h2>
                        <p className="mt-3 text-slate-400 text-lg">
                            AI-powered financial planning for Indians. Plan goals, track portfolio, and get personalized insights.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {features.map((f) => (
                            <div key={f.text} className="flex items-center gap-3 text-slate-300">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                    <f.icon className="w-4 h-4 text-indigo-400" />
                                </div>
                                <span className="text-sm">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Sign-in Card */}
                <div className="glass p-8 space-y-6">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white">Get Started</h3>
                        <p className="text-slate-400 text-sm mt-1">Sign in to access your financial dashboard</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-3 text-rose-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin" />
                        ) : (
                            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        {loading ? "Signing in..." : "Continue with Google"}
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-500">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                            <br />
                            <span className="text-amber-400/80">⚠️ Demo mode — Firebase not configured</span>
                        </p>
                    </div>

                    {/* Demo bypass */}
                    <div className="border-t border-white/10 pt-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            → Continue as demo user (no auth)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
