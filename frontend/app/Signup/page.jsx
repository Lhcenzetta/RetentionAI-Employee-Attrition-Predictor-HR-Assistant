"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrePage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' }); // Gère succès ET erreur
    const router = useRouter();

    const registrehundl = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        
        try {
            const response = await fetch("http://127.0.0.1:8000/registre", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "accept": "application/json" 
                },
                body: JSON.stringify({ "username": username, "passwordhash": password }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: 'Account created! Redirecting to login...' });
                setTimeout(() => router.push("/login"), 2000);
            } else {
                setStatus({ type: 'error', message: data.detail || 'This username is already taken.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Registration failed. Server is unreachable.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 mt-2 text-sm font-medium">Join the HR Analytics Platform</p>
                </div>

                {/* Message d'état dynamisé (Erreur ou Succès) */}
                {status.message && (
                    <div className={`mb-6 p-4 rounded-xl border-l-4 text-sm animate-in fade-in slide-in-from-top-2 ${
                        status.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'bg-red-50 border-red-500 text-red-700'
                    }`}>
                        <p className="font-semibold">{status.type === 'success' ? '✅ Success' : '⚠️ Error'}</p>
                        <p>{status.message}</p>
                    </div>
                )}

                <form onSubmit={registrehundl} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            placeholder="Choose a username"
                            className="modern-input"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Create a password"
                            className="modern-input"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg disabled:opacity-70 mt-4 flex items-center justify-center"
                    >
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Register Now"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-50 pt-6 text-sm text-slate-500">
                    Already have an account?{" "}
                    <button onClick={() => router.push('/login')} className="text-emerald-600 font-bold hover:underline">Log in</button>
                </div>
            </div>

            <style jsx>{`
                .modern-input {
                    width: 100%;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 0.85rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                    outline: none;
                }
                .modern-input:focus {
                    background-color: white;
                    border-color: #10b981;
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
                }
            `}</style>
        </div>
    );
}