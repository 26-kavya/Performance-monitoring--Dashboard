import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, ArrowRight, BookOpen, Eye, EyeOff } from 'lucide-react';

const LandingPage = () => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('admin@123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/login`, { email, password });
            const { role, token, name, _id } = res.data;

            // Store minimal session info
            localStorage.setItem('userToken', token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', _id);

            // Redirect based on role
            if (role === 'admin' || role === 'instructor') {
                navigate('/admin/dashboard');
            } else if (role === 'student') {
                navigate('/student/dashboard');
            } else {
                setError('Unknown user role.');
            }
        } catch (err) {
            console.error('Login error:', err);

            if (!err.response) {
                // Network error when backend is unreachable
                setError('Network error: Unable to connect to backend server. Please ensure the backend is running.');
            } else {
                // Backend responded with an error (e.g., 401 Unauthorized)
                setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#121212] flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="max-w-4xl w-full bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side - Visual/Branding (Inspired by provided design) */}
                <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden bg-indigo-50 dark:bg-indigo-900/30">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 dark:bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] rounded-2xl shadow-sm flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                            <BookOpen size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-[#e0e0e0] mb-4">Welcome To<br />Edu<span className="text-indigo-600 dark:text-indigo-400">Track</span></h1>
                        <p className="text-slate-500 dark:text-[#a0aec0] text-sm leading-relaxed max-w-sm">
                            Access your performance analytics, grades, and upcoming assignments in one unified dashboard.
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 p-8 lg:p-12 bg-white dark:bg-[#1e1e1e] dark:border-[#333333] flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-[#e0e0e0] mb-2">Sign In</h2>
                        <p className="text-slate-500 dark:text-[#a0aec0] text-sm">Enter your email and password to access your account.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0]">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-[#333] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                                    placeholder="admin@gmail.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-[#e0e0e0]">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-[#333] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-[#a0aec0] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">Connecting...</span>
                                ) : (
                                    <span className="flex items-center gap-2">Get Started <ArrowRight size={18} /></span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#333] text-center">
                        <p className="text-xs text-slate-500 dark:text-[#a0aec0]">
                            Demo Credentials:<br />
                            Admin: <span className="font-semibold text-slate-700 dark:text-[#e0e0e0]">admin@gmail.com / admin@123</span><br />
                            Student: <span className="font-semibold text-slate-700 dark:text-[#e0e0e0]">student@123 (with known email)</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
