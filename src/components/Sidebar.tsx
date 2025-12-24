import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
    BarChart3,
    Settings2,
    Layers,
    FileText,
    ArrowLeft,
    Activity,
    Database,
    PenTool
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    collapsed?: boolean;
}

const SidebarItem = ({ icon, label, isActive, onClick, collapsed }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group w-full",
            isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "justify-center p-3"
        )}
    >
        <div className={cn("text-xl", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
            {icon}
        </div>
        {!collapsed && <span>{label}</span>}
    </button>
);

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportPath, setExportPath] = useState('/data/datasets/new_batch_01');

    // Persistent Mode State
    // Remembers if the user is in "Particle" or "Fiber" mode even when navigating to neutral pages (like Reports)
    const [mode, setMode] = useState<'particle' | 'fiber' | null>(() => {
        if (location.pathname.startsWith('/particles')) return 'particle';
        if (location.pathname.startsWith('/fibers')) return 'fiber';
        return localStorage.getItem('uniaims_mode') as 'particle' | 'fiber' | null;
    });

    useEffect(() => {
        if (location.pathname.startsWith('/particles')) {
            setMode('particle');
            localStorage.setItem('uniaims_mode', 'particle');
        } else if (location.pathname.startsWith('/fibers')) {
            setMode('fiber');
            localStorage.setItem('uniaims_mode', 'fiber');
        }
    }, [location.pathname]);

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/' || location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    // Determine Context based on persisted mode
    const isParticleMode = mode === 'particle';
    const isFiberMode = mode === 'fiber';
    const isFineTuning = location.pathname.startsWith('/finetune');
    // If we are in Dashboard, Report, Fine-tuning, maybe show all or standard set?
    // For now, let's hide the "Other" recognition tool if one is active.

    return (
        <>
            <aside className="h-screen w-64 border-r border-border bg-card p-4 pt-20 pb-20 flex flex-col shadow-sm">
                <div className="space-y-6 flex-1">
                    <div className="mb-2">
                        <SidebarItem
                            icon={<ArrowLeft size={20} />}
                            label="Back to Dashboard"
                            onClick={() => navigate('/dashboard')}
                        />
                    </div>

                    {isFineTuning ? (
                        /* Fine-tuning Context Menu */
                        <>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Training</p>
                                <div className="space-y-1">
                                    <SidebarItem
                                        icon={<Settings2 size={20} />}
                                        label="Configuration"
                                        isActive={searchParams.get('tab') === 'settings' || !searchParams.get('tab')}
                                        onClick={() => setSearchParams({ tab: 'settings' })}
                                    />
                                    <SidebarItem
                                        icon={<Activity size={20} />}
                                        label="Training Dashboard"
                                        isActive={searchParams.get('tab') === 'training'}
                                        onClick={() => setSearchParams({ tab: 'training' })}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Data</p>
                                <div className="space-y-1">
                                    <SidebarItem
                                        icon={<Database size={20} />}
                                        label="Data Management"
                                        isActive={searchParams.get('tab') === 'data'}
                                        onClick={() => setSearchParams({ tab: 'data' })}
                                    />
                                    <SidebarItem
                                        icon={<PenTool size={20} />}
                                        label="Annotation Studio"
                                        isActive={searchParams.get('tab') === 'annotation'}
                                        onClick={() => setSearchParams({ tab: 'annotation' })}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Standard Workstation Menu */
                        <>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Workstation</p>
                                <div className="space-y-1">

                                    {/* Conditional Rendering based on Context */}
                                    {(isParticleMode) && (
                                        <SidebarItem
                                            icon={<Layers size={20} />}
                                            label="Particle Analysis"
                                            isActive={isActive('/particles')}
                                            onClick={() => navigate('/particles')}
                                        />
                                    )}

                                    {(isFiberMode) && (
                                        <SidebarItem
                                            icon={<Activity size={20} />}
                                            label="Fiber Analysis"
                                            isActive={isActive('/fibers')}
                                            onClick={() => navigate('/fibers')}
                                        />
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Results</p>
                                <div className="space-y-1">
                                    <SidebarItem
                                        icon={<BarChart3 size={20} />}
                                        label="Analysis Hub"
                                        isActive={searchParams.get('analysis') === 'true'}
                                        onClick={() => {
                                            setSearchParams(prev => {
                                                const newParams = new URLSearchParams(prev);
                                                newParams.set('analysis', 'true');
                                                return newParams;
                                            });
                                        }}
                                    />
                                    <SidebarItem
                                        icon={<FileText size={20} />}
                                        label="Reports"
                                        isActive={isActive('/reports')}
                                        onClick={() => navigate('/reports')}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">System</p>
                                <div className="space-y-1">
                                    <div className="space-y-1">
                                        <SidebarItem
                                            icon={<Database size={20} />}
                                            label="Save to Dataset"
                                            onClick={() => setShowExportModal(true)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>


            </aside>

            {/* Data Export Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-border">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Database className="text-primary" size={24} />
                                    Save to Dataset
                                </h2>
                                <p className="text-muted-foreground text-sm mt-1">Export current analysis data for future fine-tuning.</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Target Dataset Path</label>
                                    <div className="flex bg-muted/50 border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                        <span className="px-3 py-2 text-muted-foreground bg-muted border-r border-border font-mono text-sm">/mnt/</span>
                                        <input
                                            type="text"
                                            value={exportPath}
                                            onChange={(e) => setExportPath(e.target.value)}
                                            className="flex-1 bg-transparent px-3 py-2 outline-none font-mono text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Files will be saved to the shared storage cluster.</p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 p-3 rounded-lg text-sm flex gap-2 items-start">
                                    <Activity size={16} className="mt-0.5 shrink-0" />
                                    <span>Includes 124 image patches and corresponding mask labels from the current session.</span>
                                </div>
                            </div>

                            <div className="p-6 bg-muted/30 border-t border-border flex justify-end gap-3">
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-md"
                                >
                                    Confirm Export
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
