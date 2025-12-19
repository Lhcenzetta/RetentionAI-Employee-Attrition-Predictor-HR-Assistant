"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // État pour l'erreur
    const router = useRouter();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Réinitialiser l'erreur au début
        
        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ 
                    "username": username,
                    "passwordhash": password 
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.user_id);
                router.push('/dashboard');
            } else {
                // Message d'erreur personnalisé au lieu de l'alerte
                setError(data.message || 'Invalid username or password. Please try again.');
            }
        } catch (err) {
            setError('Unable to connect to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Login</h1>
                    <p className="text-slate-500 mt-2 text-sm uppercase tracking-wider font-semibold">
                        HR Analysis Portal
                    </p>
                </div>

                {/* Message d'erreur stylisé */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center">
                            <span className="mr-2">⚠️</span>
                            <p className="font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handlesubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Your username"
                            className="modern-input"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="Your password"
                            className="modern-input"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 disabled:opacity-70 mt-4 flex items-center justify-center"
                    >
                        {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Log In"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <button onClick={() => router.push('/Signup')} className="text-blue-600 font-bold hover:underline">Sign up now</button>
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
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
            `}</style>
        </div>
    );
}