import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, Bell } from 'lucide-react';

export const GlobalHeader = () => {
    const location = useLocation();

    // Logic to determine if we are in Dashboard mode
    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/' || location.pathname === '/upload';

    return (
        <motion.div
            initial={false}
            animate={{
                width: isDashboard ? '100%' : '16rem', // 16rem = w-64 (Sidebar width)
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed top-0 left-0 z-50 h-16 bg-card border-b border-border/40 flex items-center overflow-hidden"
        >
            {/* Logo Section - Always Fixed on Left */}
            <div className="w-64 flex-shrink-0 px-6 flex items-center gap-3 h-full bg-card z-20 relative">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <Microscope className="text-primary-foreground h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                    UniAIMS
                </h1>
            </div>

            {/* Dashboard Content - Scrolling Ticker */}
            <AnimatePresence>
                {isDashboard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 flex items-center px-6 overflow-hidden relative h-full border-l border-border/40"
                    >
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground whitespace-nowrap mr-4 shrink-0">
                            <Bell size={14} className="text-secondary-foreground" />
                            <span className="uppercase tracking-wider text-[10px]">System Announcement</span>
                            <span className="w-px h-3 bg-border mx-1" />
                        </div>

                        {/* Scrolling Ticker */}
                        <div className="flex-1 overflow-hidden relative h-full flex items-center mask-image-linear-gradient">
                            <motion.div
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                className="flex items-center gap-12 whitespace-nowrap text-xs text-muted-foreground/80 font-mono"
                            >
                                <span>🚀 Service maintenance scheduled for Dec 15th, 02:00 AM UTC.</span>
                                <span>✨ New Model v1.2-beta released! 5x faster inference speeds.</span>
                                <span>📢 Did you know? You can now export reports directly to PDF.</span>
                                {/* Duplicate for seamless loop */}
                                <span>🚀 Service maintenance scheduled for Dec 15th, 02:00 AM UTC.</span>
                                <span>✨ New Model v1.2-beta released! 5x faster inference speeds.</span>
                                <span>📢 Did you know? You can now export reports directly to PDF.</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
