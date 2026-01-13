import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
    BarChart3,
    Settings2,
    Layers,
    FileText,
    ArrowLeft,
    Activity,
    Database,
    PenTool,
    ChevronLeft,
    ChevronRight,
    Settings
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';
import { SIDEBAR_CONFIG, type MenuItem } from '../config/sidebarMenus';

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const ICON_MAP: Record<string, ReactNode> = {
    BarChart3: <BarChart3 size={20} />,
    Settings2: <Settings2 size={20} />,
    Settings: <Settings size={20} />,
    Layers: <Layers size={20} />,
    FileText: <FileText size={20} />,
    Activity: <Activity size={20} />,
    Database: <Database size={20} />,
    PenTool: <PenTool size={20} />
};

interface SidebarItemProps {
    icon: ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    collapsed?: boolean;
}

const SidebarItem = ({ icon, label, isActive, onClick, collapsed }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group w-full overflow-hidden",
            isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "p-3"
        )}
    >
        <div className={cn("text-xl shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>
            {icon}
        </div>
        <motion.span
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap"
        >
            {collapsed ? '\u00A0' : label}
        </motion.span>
    </button>
);

import { useSidebar } from '../context/SidebarContext';

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Collapsed State from Context
    const { isCollapsed, toggleSidebar: toggleCollapsed } = useSidebar();

    const [taskId, setTaskId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const parts = location.pathname.split('/');
        if (parts.length >= 3 && parts[1] !== 'dashboard' && parts[1] !== 'finetune') {
            setTaskId(parts[1]);
        }
    }, [location.pathname]);


    const [searchParams, setSearchParams] = useSearchParams();
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportPath, setExportPath] = useState('/data/datasets/new_batch_01');

    const [mode, setMode] = useState<'particle' | 'fiber' | null>(() => {
        if (location.pathname.includes('/particles')) return 'particle';
        if (location.pathname.includes('/fibers')) return 'fiber';
        return localStorage.getItem('uniaims_mode') as 'particle' | 'fiber' | null;
    });

    useEffect(() => {
        if (location.pathname.includes('/particles')) {
            setMode('particle');
            localStorage.setItem('uniaims_mode', 'particle');
        } else if (location.pathname.includes('/fibers')) {
            setMode('fiber');
            localStorage.setItem('uniaims_mode', 'fiber');
        }
    }, [location.pathname]);

    const currentConfigKey = location.pathname.startsWith('/finetune')
        ? 'finetune'
        : location.pathname.startsWith('/data/')
            ? 'data'
            : (mode || 'particle');

    const effectiveKey = currentConfigKey || 'particle';
    const currentSections = SIDEBAR_CONFIG[effectiveKey] || [];

    const resolvePath = (path: string | undefined) => {
        if (!path) return undefined;
        return path.replace(':taskId', taskId || 'unknown');
    };

    const checkActive = (item: MenuItem) => {
        if (item.params) {
            return Object.entries(item.params).every(([k, v]) => searchParams.get(k) === v);
        }
        if (item.path) {
            const resolved = resolvePath(item.path);
            return resolved ? location.pathname.startsWith(resolved) : false;
        }
        return false;
    };

    const handleItemClick = (item: MenuItem) => {
        if (item.action === 'open_export_modal') {
            setShowExportModal(true);
            return;
        }

        if (item.path) {
            const resolved = resolvePath(item.path);
            if (resolved) navigate(resolved);
        }

        if (item.params) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                Object.entries(item.params || {}).forEach(([k, v]) => {
                    newParams.set(k, String(v));
                });
                return newParams;
            });
        }
    };

    return (
        <>
            <motion.aside
                initial={{ width: 256 }}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-screen border-r border-border bg-card p-4 pt-20 pb-4 flex flex-col shadow-sm relative z-20"
            >
                <button
                    onClick={() => toggleCollapsed()}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full p-1.5 shadow-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all z-50 flex items-center justify-center cursor-pointer"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className="space-y-6 flex-1 overflow-x-hidden">
                    <div className="mb-2">
                        <SidebarItem
                            icon={<ArrowLeft size={20} />}
                            label="Back to Dashboard"
                            onClick={() => navigate('/dashboard')}
                            collapsed={isCollapsed}
                        />
                    </div>

                    {currentSections.map((section, idx) => (
                        <div key={section.title + idx}>
                            <div className="h-4 mb-3 px-2">
                                {!isCollapsed ? (
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                                        {section.title}
                                    </p>
                                ) : (
                                    <div className="flex items-center justify-center h-full" title={section.title}>
                                        <div className="w-4 h-[2px] bg-muted-foreground/20 rounded-full" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item, itemIdx) => (
                                    <SidebarItem
                                        key={item.label + itemIdx}
                                        icon={ICON_MAP[item.icon] || <Activity size={20} />}
                                        label={item.label}
                                        isActive={checkActive(item)}
                                        onClick={() => handleItemClick(item)}
                                        collapsed={isCollapsed}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.aside>

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
