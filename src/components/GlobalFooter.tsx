import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Globe, Mail, Book } from 'lucide-react';

import { useSidebar } from '../context/SidebarContext';

export const GlobalFooter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isCollapsed } = useSidebar();
    const [searchParams, setSearchParams] = useSearchParams();
    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/' || location.pathname === '/upload' || location.pathname === '/data/new';

    // View Mode from URL
    const viewMode = searchParams.get('view') || 'list';

    // Local mock language state
    const [language, setLanguage] = useState<'en' | 'zh'>('en');

    // User Menu State
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showContact, setShowContact] = useState(false);

    const toggleView = (mode: 'grid' | 'list') => {
        setSearchParams(prev => {
            prev.set('view', mode);
            return prev;
        });
    };

    return (
        <>
            <motion.div
                animate={{
                    width: isDashboard ? '100%' : (isCollapsed ? '5rem' : '16rem'),
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed bottom-0 left-0 z-50 h-16 bg-card border-t border-border/40 flex items-center justify-between px-4"
            >
                {/* User Info (Left Side) */}
                <div className="relative z-20">
                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-0 mb-4 w-72 bg-card border border-border/60 rounded-xl shadow-2xl overflow-hidden glass-panel z-[100]"
                            >
                                {/* Header */}
                                <div className="bg-muted/30 p-4 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-background">
                                            XZ
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Xia Zhiyi</h3>
                                            <p className="text-xs text-muted-foreground">xia.zhiyi@lab.org</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 space-y-4">
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Organization</h4>
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Advanced Materials Lab
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Type</h4>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded textxs font-medium bg-primary/10 text-primary border border-primary/20 text-xs">
                                                Trial Plan
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trial End</h4>
                                            <p className="text-xs font-medium text-amber-500">12 Days Left</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-border/50">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Monthly Tokens</span>
                                            <span className="font-medium">8,420 / 10,000</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[84%] rounded-full" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground text-right pt-0.5">Resets in 5 days</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-background shrink-0">
                            XZ
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">Xia Zhiyi</span>
                                <span className="text-[10px] text-muted-foreground">Lead Researcher</span>
                            </div>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Dashboard Controls (Right Side) */}
            <AnimatePresence>
                {isDashboard && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="fixed bottom-0 right-0 h-16 flex items-center px-4 z-50"
                    >
                        <div className="flex items-center gap-4">
                            {/* View Switcher */}
                            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border/30">
                                <button
                                    onClick={() => toggleView('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
                                    title="Grid View"
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button
                                    onClick={() => toggleView('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
                                    title="List View"
                                >
                                    <List size={16} />
                                </button>
                            </div>

                            {/* Language Switcher */}
                            <button
                                onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                <Globe size={14} />
                                <span>{language === 'en' ? 'EN' : '中文'}</span>
                            </button>

                            <button
                                onClick={() => navigate('/docs')}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                <Book size={14} />
                                <span>Documentation</span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowContact(!showContact)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 transition-colors text-xs font-medium ${showContact ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Mail size={14} />
                                    <span>Contact Us</span>
                                </button>

                                <AnimatePresence>
                                    {showContact && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full right-0 mb-4 w-72 bg-card border border-border/60 rounded-xl shadow-2xl overflow-hidden glass-panel z-[100] p-6"
                                        >
                                            <div className="space-y-6">
                                                <div className="space-y-2 text-center">
                                                    <h3 className="font-bold text-foreground">Contact & Support</h3>
                                                    <p className="text-xs text-muted-foreground">Get in touch with the UniAIMS Team</p>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50 text-center space-y-1">
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Email Us</div>
                                                        <a href="mailto:uni-aims@dp.tech" className="text-sm font-medium text-primary hover:underline block">
                                                            uni-aims@dp.tech
                                                        </a>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider text-center">Join Community</div>
                                                        <div className="aspect-square bg-white rounded-lg border border-border flex items-center justify-center p-2">
                                                            {/* Placeholder for QR Code */}
                                                            <div className="w-full h-full bg-neutral-100 rounded flex flex-col items-center justify-center text-neutral-400 gap-2">
                                                                <LayoutGrid size={32} className="opacity-20" />
                                                                <span className="text-[10px]">Scan QR Code</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-center text-muted-foreground">
                                                            Scan to join our WeChat Exchange Group
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
