import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../application/context/AuthContext';
import { getDashboardData, getTasks, createTask, updateTask, deleteTask, updateProfile } from '../../infrastructure/api/Client';
import {
    Activity,
    LogOut,
    LayoutDashboard,
    Bell,
    Search,
    ChevronUp,
    ChevronDown,
    Plus,
    Trash2,
    CheckCircle2,
    Circle,
    User as UserIcon,
    Settings,
    X,
    Filter,
    Edit2,
    ArrowUpRight,
    TrendingUp,
    Menu
} from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, logout, login: updateAuthUser } = useAuth();
    const container = useRef();
    const [data, setData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
    const [taskForm, setTaskForm] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState(null);

    useGSAP(() => {
        if (!loading) {
            const tl = gsap.timeline();
            tl.fromTo('.sidebar-item',
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out',
                    clearProps: 'all'
                })
                .fromTo('.stat-card',
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'back.out(1.7)',
                        clearProps: 'all'
                    },
                    '-=0.4')
                .fromTo('.header-animate',
                    { y: -20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out',
                        clearProps: 'all'
                    },
                    '-=0.8')
                .fromTo('.content-panel',
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        clearProps: 'all'
                    },
                    '-=0.4');
        }
    }, { scope: container, dependencies: [loading] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, tasksRes] = await Promise.all([
                    getDashboardData(),
                    getTasks()
                ]);
                setData(dashRes.data);
                setTasks(tasksRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const refreshStats = async () => {
        try {
            const dashRes = await getDashboardData();
            setData(dashRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                const res = await updateTask(editingTask._id, taskForm);
                setTasks(tasks.map(t => t._id === editingTask._id ? res.data : t));
            } else {
                const res = await createTask(taskForm);
                setTasks([res.data, ...tasks]);
            }
            setIsTaskModalOpen(false);
            setTaskForm({ title: '', description: '' });
            setEditingTask(null);
            refreshStats();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleTask = async (task) => {
        try {
            const res = await updateTask(task._id, { ...task, completed: !task.completed });
            setTasks(tasks.map(t => t._id === task._id ? res.data : t));
            refreshStats();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(t => t._id !== id));
            refreshStats();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile(profileForm);
            updateAuthUser(res.data.user, localStorage.getItem('token'));
            setIsProfileModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'completed' && task.completed) ||
            (filterStatus === 'pending' && !task.completed);
        return matchesSearch && matchesFilter;
    });

    const getIcon = (name) => {
        switch (name) {
            case 'Total Tasks': return <Activity className="w-6 h-6 text-primary-400" />;
            case 'Completed': return <CheckCircle2 className="w-6 h-6 text-green-400" />;
            case 'Active Tasks': return <Circle className="w-6 h-6 text-orange-400" />;
            case 'Productivity': return <TrendingUp className="w-6 h-6 text-indigo-400" />;
            default: return <Activity className="w-6 h-6 text-primary-400" />;
        }
    };

    return (
        <div ref={container} className="min-h-screen bg-slate-950 text-slate-50 flex overflow-hidden mesh-gradient relative">
            <div className="blob blob-1 top-[-20%] right-[-10%] bg-primary-600/10 w-[800px] h-[800px]"></div>
            <div className="blob blob-2 bottom-[-20%] left-[-10%] bg-indigo-600/10 w-[800px] h-[800px]"></div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-slate-950 lg:static lg:bg-slate-950/40 lg:backdrop-blur-3xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 sidebar-item">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/40 rotate-3">
                            <LayoutDashboard className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">Nexus</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <button className="sidebar-item w-full flex items-center gap-4 px-5 py-4 text-primary-400 bg-primary-500/10 rounded-2xl font-bold transition-all border border-primary-500/20 shadow-lg shadow-primary-500/5 text-left">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => { setIsProfileModalOpen(true); setIsMobileMenuOpen(false); }}
                        className="sidebar-item w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-semibold group text-left"
                    >
                        <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        My Profile
                    </button>
                    <button className="sidebar-item w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-semibold group text-left">
                        <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        Settings
                    </button>
                </nav>

                <div className="p-6 border-t border-white/5 sidebar-item">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:text-white hover:bg-red-500/20 rounded-2xl transition-all font-bold group border border-transparent hover:border-red-500/30"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-20 overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="h-24 px-6 md:px-10 flex items-center justify-between bg-slate-950/20 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="header-animate relative w-full max-w-lg hidden md:block group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Find tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all text-white placeholder-slate-500 font-medium"
                            />
                        </div>
                    </div>

                    <div className="header-animate flex items-center gap-4 md:gap-8">
                        <div className="relative group cursor-pointer hidden sm:block">
                            <Bell className="w-6 h-6 text-slate-400 group-hover:text-primary-400 transition-colors" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 border-2 border-slate-950 rounded-full shadow-lg shadow-primary-500/50"></span>
                        </div>

                        <button
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center gap-4 group p-1.5 pr-4 rounded-2xl hover:bg-white/5 transition-all text-left"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-xl shadow-primary-500/20 group-hover:scale-105 transition-transform">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{user?.name || user?.email.split('@')[0]}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Premium Plan</p>
                            </div>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full relative z-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 header-animate gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">{user?.name || 'Explorer'}!</span>
                            </h1>
                            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">Welcome back. Here's a quick overview of your workspace.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setTaskForm({ title: '', description: '' });
                                setIsTaskModalOpen(true);
                            }}
                            className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl shadow-primary-500/30 group active:scale-95"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-90 transition-transform">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span>Create New Task</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-44 bg-white/5 border border-white/5 rounded-3xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
                                {data?.stats.map((stat) => (
                                    <div key={stat.id} className="stat-card glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-white/4 shadow-2xl hover:bg-white/8 transition-all group relative overflow-hidden">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-600/5 rounded-full blur-2xl group-hover:bg-primary-600/10 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className="p-4 bg-primary-600/10 rounded-2xl backdrop-blur-md border border-white/5 group-hover:scale-110 transition-transform">
                                                {getIcon(stat.name)}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 uppercase tracking-widest">
                                                {stat.change}
                                            </div>
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{stat.name}</p>
                                            <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Task Section */}
                            <div className="content-panel glass-card rounded-[32px] md:rounded-[40px] border border-white/5 bg-white/3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-10">
                                <div className="p-6 md:p-8 border-b border-white/5 flex flex-col xl:flex-row justify-between items-center bg-white/2 gap-6">
                                    <div className="flex items-center gap-4 w-full xl:w-auto">
                                        <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
                                        <h2 className="text-2xl font-black tracking-tight">Recent Tasks</h2>
                                    </div>
                                    <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl w-full xl:w-auto overflow-x-auto">
                                        {['all', 'pending', 'completed'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`flex-1 xl:flex-none px-6 py-2.5 text-xs font-black rounded-xl transition-all capitalize tracking-widest whitespace-nowrap ${filterStatus === status ? 'bg-primary-600 text-white shadow-2xl shadow-primary-500/40 translate-y-[-1px]' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid gap-4">
                                        <AnimatePresence mode='popLayout'>
                                            {filteredTasks.length > 0 ? (
                                                filteredTasks.map((task) => (
                                                    <motion.div
                                                        layout
                                                        key={task._id}
                                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                                        className="p-6 md:p-8 flex items-center gap-4 md:gap-6 glass-card rounded-2xl md:rounded-3xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all group"
                                                    >
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleToggleTask(task); }}
                                                            className={`p-2 rounded-xl transition-all border flex-shrink-0 ${task.completed ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-slate-500 hover:text-primary-400 hover:border-primary-500/20'}`}
                                                        >
                                                            {task.completed ? <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" /> : <Circle className="w-6 h-6 md:w-7 md:h-7" />}
                                                        </button>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className={`text-lg md:text-xl font-black tracking-tight truncate ${task.completed ? 'text-slate-600 line-through opacity-50' : 'text-white'}`}>
                                                                {task.title}
                                                            </h3>
                                                            {task.description && (
                                                                <p className="text-slate-400 mt-1 font-medium leading-relaxed truncate md:whitespace-normal">{task.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 md:gap-3 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-all duration-300">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingTask(task);
                                                                    setTaskForm({ title: task.title, description: task.description || '' });
                                                                    setIsTaskModalOpen(true);
                                                                }}
                                                                className="p-3 md:p-4 bg-white/5 text-slate-400 hover:text-white hover:bg-primary-500 rounded-xl md:rounded-2xl transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteTask(task._id); }}
                                                                className="p-3 md:p-4 bg-white/5 text-slate-400 hover:text-white hover:bg-red-500 rounded-xl md:rounded-2xl transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="p-20 md:p-32 text-center text-slate-500"
                                                >
                                                    <div className="flex justify-center mb-8">
                                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary-500/5 rounded-full flex items-center justify-center animate-pulse">
                                                            <Activity className="w-10 h-10 md:w-12 md:h-12 opacity-20" />
                                                        </div>
                                                    </div>
                                                    <p className="text-xl md:text-2xl font-black text-slate-400 tracking-tight">No tasks yet</p>
                                                    <p className="text-slate-600 font-medium mt-2 max-w-xs mx-auto">Start by creating your first task using the button above.</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Task Modal */}
            <AnimatePresence>
                {isTaskModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-slate-900 border border-white/5 rounded-[32px] md:rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative"
                        >
                            <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-white/2">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white">{editingTask ? 'Edit Task' : 'Create Task'}</h3>
                                <button onClick={() => setIsTaskModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateTask} className="p-8 md:p-10 space-y-6 md:space-y-8">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.3em] ml-1">Task Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={taskForm.title}
                                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold placeholder:text-slate-700"
                                        placeholder="What needs to be done?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.3em] ml-1">Description</label>
                                    <textarea
                                        value={taskForm.description}
                                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all min-h-[120px] font-medium placeholder:text-slate-700"
                                        placeholder="Add more details..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-primary-500/30 active:scale-95"
                                >
                                    {editingTask ? 'Save Changes' : 'Create Task'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Modal */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="bg-slate-900 border border-white/5 rounded-[32px] md:rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative"
                        >
                            <div className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-white/2">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white">Edit Profile</h3>
                                <button onClick={() => setIsProfileModalOpen(false)} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="p-8 md:p-10 space-y-6 md:space-y-8">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.3em] ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold placeholder:text-slate-700"
                                        placeholder="Full name..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-[0.3em] ml-1">Your Bio</label>
                                    <textarea
                                        value={profileForm.bio}
                                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all min-h-[120px] font-medium placeholder:text-slate-700"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary-600 hover:bg-primary-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-primary-500/30 active:scale-95"
                                >
                                    Update Profile
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
