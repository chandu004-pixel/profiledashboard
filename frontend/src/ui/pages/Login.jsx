import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../application/context/AuthContext';
import { login as loginApi } from '../../infrastructure/api/Client';
import { LogIn, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const container = useRef();
    const cardRef = useRef();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.blob-1', { scale: 0, opacity: 0, duration: 1.5, ease: 'power2.out' })
            .from('.blob-2', { scale: 0, opacity: 0, duration: 1.5, ease: 'power2.out' }, '-=1.2')
            .from(cardRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            }, '-=1.2')
            .fromTo('.animate-item',
                { y: 15, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    clearProps: 'all'
                },
                '-=0.6');
    }, { scope: container });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const response = await loginApi(formData);

            // GSAP Success Animation before navigating
            gsap.to(cardRef.current, {
                scale: 0.9,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    login(response.data.user, response.data.token);
                    navigate('/dashboard');
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
            gsap.fromTo(cardRef.current,
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power1.inOut' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={container} className="min-h-screen flex items-center justify-center p-4 bg-slate-950 mesh-gradient relative overflow-hidden">
            {/* Animated Blobs */}
            <div className="blob blob-1 top-[-10%] left-[-10%] bg-primary-600/20"></div>
            <div className="blob blob-2 bottom-[-10%] right-[-10%] bg-indigo-600/20"></div>

            <div className="w-full max-w-md relative z-10">
                <div ref={cardRef} className="glass-card rounded-3xl p-10 shadow-2xl overflow-hidden relative border border-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>

                    <div className="flex flex-col items-center mb-10">
                        <div className="animate-item w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/40 rotate-3">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="animate-item text-4xl font-extrabold text-white mb-2 tracking-tight">NexusBoard</h1>
                        <p className="animate-item text-slate-400 font-medium">Elevate your productivity</p>
                    </div>

                    {error && (
                        <div className="animate-item mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="animate-item">
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/40 border border-slate-800 text-white text-sm rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 block w-full pl-12 p-4 transition-all outline-none"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="animate-item">
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1 uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/40 border border-slate-800 text-white text-sm rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 block w-full pl-12 pr-12 p-4 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-primary-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="animate-item w-full bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl p-4 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-primary-500/30 group mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="animate-item mt-10 text-center text-sm text-slate-400 font-medium">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>

                <div className="animate-item mt-8 p-6 bg-slate-900/30 rounded-3xl border border-slate-800/50 text-center backdrop-blur-md">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mb-3">Test Infrastructure Access</p>
                    <div className="flex justify-center flex-col gap-1">
                        <p className="text-sm text-slate-300 font-mono">admin@example.com</p>
                        <p className="text-sm text-slate-400 font-mono">password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
