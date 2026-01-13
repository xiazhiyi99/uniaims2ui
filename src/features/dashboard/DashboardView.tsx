import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    FileImage,
    Clock,
    ArrowRight,
    Layers,
    Activity,
    Search,
    Cpu,
    Zap,
    Database,
    User,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Pagination Helper Component
const PaginationControls = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (perPage: number) => void;
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-border/40 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        onItemsPerPageChange(Number(e.target.value));
                        onPageChange(1); // Reset to first page on size change
                    }}
                    className="bg-background border border-border rounded px-2 py-1 focus:ring-2 focus:ring-primary/20 outline-none h-8"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span>items per page</span>
                <span className="mx-2 hidden sm:inline">|</span>
                <span className="hidden sm:inline">Showing {startItem}-{endItem} of {totalItems}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronsLeft size={16} />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1 font-medium text-foreground">
                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={cn(
                                        "w-8 h-8 rounded flex items-center justify-center transition-colors border",
                                        currentPage === page
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border hover:bg-muted"
                                    )}
                                >
                                    {page}
                                </button>
                            );
                        } else if (
                            (page === currentPage - 2 && page > 1) ||
                            (page === currentPage + 2 && page < totalPages)
                        ) {
                            return <span key={page} className="px-1 text-muted-foreground">...</span>;
                        }
                        return null;
                    })}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>

            <div className="sm:hidden text-xs">
                {startItem}-{endItem} of {totalItems}
            </div>
        </div>
    );
};

// Mock Data for Task History
const RECENT_TASKS = [
    { id: 'T-1029', name: 'Graphene Oxide Sample A', date: '2023-10-24', items: 120, status: 'completed', type: 'particle', model: 'v1.1', thumbnail: 'bg-blue-500/10' },
    { id: 'T-1028', name: 'Carbon Nanotubes Batch 4', date: '2023-10-23', items: 45, status: 'processing', type: 'fiber', model: 'v1.2-beta', thumbnail: 'bg-emerald-500/10' },
    { id: 'T-1025', name: 'Unknown Polymer Mix', date: '2023-10-20', items: 12, status: 'failed', type: 'particle', model: 'v1.1', thumbnail: 'bg-amber-500/10' },
    { id: 'T-1024', name: 'N95 Filter Layer', date: '2023-10-18', items: 850, status: 'completed', type: 'fiber', model: 'v0.9', thumbnail: 'bg-purple-500/10' },
];

const FINE_TUNING_TASKS = [
    { id: 'FT-002', name: 'Fiber Model Optimization', date: 'Running', items: 0, status: 'processing', type: 'training', model: 'Base: v1.1', thumbnail: 'bg-indigo-500/10' },
    { id: 'FT-001', name: 'Particle v2 Adaptation', date: '2023-10-15', items: 0, status: 'completed', type: 'training', model: 'Base: v1.0', thumbnail: 'bg-rose-500/10' },
];

const DATA_BATCHES = [
    { id: 'DB-2023-001', name: 'Graphene Oxide Sample Set A', date: '2023-10-24', uploader: 'Xia Zhiyi', imageCount: 124, linkedTasks: 2, status: 'Active' },
    { id: 'DB-2023-002', name: 'Carbon Nanotubes Batch 4', date: '2023-10-23', uploader: 'Li Wei', imageCount: 45, linkedTasks: 1, status: 'Active' },
    { id: 'DB-2023-003', name: 'Unknown Polymer Mix', date: '2023-10-20', uploader: 'Xia Zhiyi', imageCount: 12, linkedTasks: 1, status: 'Archived' },
];

const RESOURCE_STATUS = {
    cpu: { total: 128, available: 42, queued: 8, unit: 'Cores' },
    gpu: { total: 8, available: 3, queued: 14, unit: 'Units' }
};

const USER_QUEUE = [
    { rank: 1, id: 'T-2045', name: 'Carbon Fiber Stress Test', type: 'fiber', submitted: '5 mins ago', status: 'Queued', priority: 'High' },
    { rank: 12, id: 'T-2049', name: 'Nanoparticle Distribution', type: 'particle', submitted: '45 mins ago', status: 'Queued', priority: 'Normal' },
];

export const DashboardView = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<'data' | 'analysis' | 'training' | 'resources'>('analysis');

    // Analysis Filters
    const [analysisSearch, setAnalysisSearch] = useState('');
    const [analysisTimeFilter, setAnalysisTimeFilter] = useState('all');
    const [analysisTaskFilter, setAnalysisTaskFilter] = useState('all');
    const [analysisStatusFilter, setAnalysisStatusFilter] = useState('all');
    const [analysisPage, setAnalysisPage] = useState(1);
    const [analysisPerPage, setAnalysisPerPage] = useState(10);

    // Finetune Filters
    const [finetuneSearch, setFinetuneSearch] = useState('');
    const [finetuneTimeFilter, setFinetuneTimeFilter] = useState('all');
    const [finetuneTaskFilter, setFinetuneTaskFilter] = useState('all');
    const [finetuneStatusFilter, setFinetuneStatusFilter] = useState('all');
    const [finetunePage, setFinetunePage] = useState(1);
    const [finetunePerPage, setFinetunePerPage] = useState(10);

    // Data Filters
    const [dataSearch, setDataSearch] = useState('');
    const [dataTimeFilter, setDataTimeFilter] = useState('all');
    const [dataPage, setDataPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);

    // Filter Logic
    const filterTasks = (tasks: any[], search: string, time: string, type: string, status: string) => {
        return tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase()) ||
                task.id.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = status === 'all' || task.status === status;

            // Note: Simplistic type check, refine if needed based on data structure
            const matchesType = type === 'all' || task.type === type;

            // Note: Time filtering is mocked here as dates are strings. 
            // In a real app, parse `task.date` and compare with current date.
            // For now, we'll just return true or implement simple string matching if valid dates were present.
            // 'Running' is a special case in mock data.
            let matchesTime = true;
            if (time === 'today') {
                // Mock logic: assuming 'Running' or today's date
                matchesTime = task.date === 'Running' || task.date === '2023-10-24';
            } else if (time === 'week') {
                // Mock logic: simplistic check for demo
                matchesTime = true;
            }

            return matchesSearch && matchesStatus && matchesType && matchesTime;
        });
    };

    const filteredAnalysisTasks = filterTasks(RECENT_TASKS, analysisSearch, analysisTimeFilter, analysisTaskFilter, analysisStatusFilter);
    const visibleAnalysisTasks = filteredAnalysisTasks.slice((analysisPage - 1) * analysisPerPage, analysisPage * analysisPerPage);

    const filteredFinetuningTasks = filterTasks(FINE_TUNING_TASKS, finetuneSearch, finetuneTimeFilter, finetuneTaskFilter, finetuneStatusFilter);
    const visibleFinetuningTasks = filteredFinetuningTasks.slice((finetunePage - 1) * finetunePerPage, finetunePage * finetunePerPage);

    const filteredDataBatches = filterTasks(DATA_BATCHES, dataSearch, dataTimeFilter, 'all', 'all');
    const visibleDataBatches = filteredDataBatches.slice((dataPage - 1) * dataPerPage, dataPage * dataPerPage);

    // View Mode from URL
    const viewMode = searchParams.get('view') || 'list';
    // Language mock (in real app, use Context)


    const handleCreateAnalysis = () => {
        navigate('/upload');
    };

    return (
        <motion.div
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            exit={{ x: '-100vw' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-8 pt-24 font-sans text-foreground absolute top-0 left-0 w-full z-10 pb-32"
        >
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 relative">

                {/* Header */}
                <div className="flex mb-2">
                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50">
                        <button
                            onClick={() => setActiveTab('analysis')}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm",
                                activeTab === 'analysis' ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            Analysis Tasks
                        </button>
                        <button
                            onClick={() => setActiveTab('training')}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm",
                                activeTab === 'training' ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            Fine-tuning Tasks
                        </button>
                        <button
                            onClick={() => setActiveTab('data')}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2",
                                activeTab === 'data' ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <Database size={14} />
                            Data Board
                        </button>
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2",
                                activeTab === 'resources' ? "bg-background text-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <Activity size={14} />
                            Resource Board
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'data' ? (
                        <motion.div
                            key="data"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Import New Data Card */}
                            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8 flex items-center justify-between cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10 transition-all group"
                                onClick={() => navigate('/data/new')}
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">Import New Data Batch</h2>
                                    <p className="text-muted-foreground max-w-lg">Upload new image datasets to the system for analysis or model training.</p>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Plus size={32} />
                                </div>
                            </div>

                            {/* Data Batches List */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <Database size={18} className="text-muted-foreground" />
                                        Your Data Batches
                                    </h2>

                                    <div className="flex flex-wrap gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search batches..."
                                                value={dataSearch}
                                                onChange={(e) => setDataSearch(e.target.value)}
                                                className="pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-48"
                                            />
                                        </div>
                                        <select
                                            value={dataTimeFilter}
                                            onChange={(e) => setDataTimeFilter(e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="week">This Week</option>
                                            <option value="month">This Month</option>
                                        </select>
                                    </div>
                                </div>

                                {viewMode === 'grid' ? (
                                    /* GRID VIEW */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {visibleDataBatches.length > 0 ? (
                                            visibleDataBatches.map((batch) => (
                                                <div key={batch.id} className="group bg-card border border-border/60 hover:border-emerald-500/50 transition-all rounded-xl p-5 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer" onClick={() => navigate(`/data/${batch.id}`)}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600">
                                                            <Database size={20} />
                                                        </div>
                                                        <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                            batch.status === 'Active' ? "bg-green-500/10 text-green-600" : "bg-neutral-500/10 text-neutral-600"
                                                        )}>
                                                            {batch.status}
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-foreground mb-1 group-hover:text-emerald-600 transition-colors">{batch.name}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                        <span>{batch.id}</span>
                                                        <span>•</span>
                                                        <span>{batch.date}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs pt-4 border-t border-border/40">
                                                        <div className="flex gap-4 text-muted-foreground">
                                                            <span className="flex items-center gap-1"><FileImage size={12} /> {batch.imageCount} images</span>
                                                            <span className="flex items-center gap-1"><User size={12} /> {batch.uploader}</span>
                                                        </div>
                                                        <div className="text-xs font-medium text-primary">
                                                            {batch.linkedTasks} linked tasks
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border/50 rounded-xl border-dashed">
                                                No data batches found matching your filters.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* LIST (ROW) VIEW */
                                    <div className="space-y-3">
                                        {visibleDataBatches.length > 0 ? (
                                            visibleDataBatches.map((batch) => (
                                                <div key={batch.id} className="bg-card border border-border/60 hover:border-emerald-500/50 transition-all rounded-lg p-2.5 flex items-center justify-between hover:shadow-sm cursor-pointer group" onClick={() => navigate(`/data/${batch.id}`)}>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600">
                                                            <Database size={18} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-foreground group-hover:text-emerald-600 transition-colors text-sm">{batch.name}</h3>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <span>{batch.id}</span>
                                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                                <span>{batch.uploader}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8 mr-4">
                                                        <div className="text-xs text-muted-foreground text-right hidden md:block">
                                                            <div className="font-medium">{batch.date}</div>
                                                            <div className="opacity-70">{batch.imageCount} images</div>
                                                        </div>
                                                        <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-24 text-center",
                                                            batch.status === 'Active' ? "bg-green-500/10 text-green-600" : "bg-neutral-500/10 text-neutral-600"
                                                        )}>
                                                            {batch.status}
                                                        </div>
                                                    </div>

                                                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-muted-foreground bg-card/50 border border-border/50 rounded-xl border-dashed">
                                                No data batches found matching your filters.
                                            </div>
                                        )}
                                    </div>

                                )}

                                <PaginationControls
                                    currentPage={dataPage}
                                    totalItems={filteredDataBatches.length}
                                    itemsPerPage={dataPerPage}
                                    onPageChange={setDataPage}
                                    onItemsPerPageChange={setDataPerPage}
                                />
                            </div>
                        </motion.div>
                    ) : activeTab === 'analysis' ? (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Start New Analysis Card */}
                            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-8 flex items-center justify-between cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all group"
                                onClick={handleCreateAnalysis}
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Start New Analysis</h2>
                                    <p className="text-muted-foreground max-w-lg">Create a new particle or fiber analysis task from uploaded images.</p>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Plus size={32} />
                                </div>
                            </div>


                            {/* Recent Analysis Tasks List */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <Clock size={18} className="text-muted-foreground" />
                                        Recent Activity
                                    </h2>

                                    <div className="flex flex-wrap gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search tasks..."
                                                value={analysisSearch}
                                                onChange={(e) => setAnalysisSearch(e.target.value)}
                                                className="pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-48"
                                            />
                                        </div>
                                        <select
                                            value={analysisTimeFilter}
                                            onChange={(e) => setAnalysisTimeFilter(e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="week">This Week</option>
                                            <option value="month">This Month</option>
                                        </select>
                                        <select
                                            value={analysisTaskFilter}
                                            onChange={(e) => setAnalysisTaskFilter(e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="particle">Particle</option>
                                            <option value="fiber">Fiber</option>
                                        </select>
                                        <select
                                            value={analysisStatusFilter}
                                            onChange={(e) => setAnalysisStatusFilter(e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="completed">Completed</option>
                                            <option value="processing">Processing</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                </div>

                                {viewMode === 'grid' ? (
                                    /* GRID VIEW */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {visibleAnalysisTasks.length > 0 ? (
                                            visibleAnalysisTasks.map((task) => (
                                                <div key={task.id} className="group bg-card border border-border/60 hover:border-primary/50 transition-all rounded-xl p-5 hover:shadow-lg hover:shadow-primary/5 cursor-pointer relative overflow-hidden" onClick={() => navigate(task.type === 'particle' ? `/${task.id}/particles` : `/${task.id}/fibers`)}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", task.thumbnail)}>
                                                            <FileImage className={cn("opacity-80", task.type === 'fiber' ? 'text-emerald-500' : 'text-blue-500')} size={20} />
                                                        </div>
                                                        <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                            task.status === 'completed' ? "bg-green-500/10 text-green-600" :
                                                                task.status === 'processing' ? "bg-blue-500/10 text-blue-600" :
                                                                    "bg-amber-500/10 text-amber-600"
                                                        )}>
                                                            {task.status}
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">{task.name}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                        <span>{task.id}</span>
                                                        <span>•</span>
                                                        <span>{task.date}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs pt-4 border-t border-border/40">
                                                        <div className="flex gap-3">
                                                            <span className="flex items-center gap-1"><Layers size={12} /> {task.items} imgs</span>
                                                            <span className="flex items-center gap-1 opacity-70"><Activity size={12} /> {task.model}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border/50 rounded-xl border-dashed">
                                                No analysis tasks found matching your filters.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* LIST (ROW) VIEW */
                                    <div className="space-y-3">
                                        {visibleAnalysisTasks.length > 0 ? (
                                            visibleAnalysisTasks.map((task) => (
                                                <div key={task.id} className="bg-card border border-border/60 hover:border-primary/50 transition-all rounded-lg p-2.5 flex items-center justify-between hover:shadow-sm cursor-pointer group" onClick={() => navigate(task.type === 'particle' ? `/${task.id}/particles` : `/${task.id}/fibers`)}>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", task.thumbnail)}>
                                                            {task.type === 'fiber' ? <Activity size={16} className="text-emerald-500" /> : <Layers size={16} className="text-blue-500" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm">{task.name}</h3>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <span>{task.id}</span>
                                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                                <span>{task.model}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8 mr-4">
                                                        <div className="text-xs text-muted-foreground text-right hidden md:block">
                                                            <div className="font-medium">{task.date}</div>
                                                            <div className="opacity-70">{task.items} items</div>
                                                        </div>
                                                        <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-24 text-center",
                                                            task.status === 'completed' ? "bg-green-500/10 text-green-600" :
                                                                task.status === 'processing' ? "bg-blue-500/10 text-blue-600" :
                                                                    "bg-amber-500/10 text-amber-600"
                                                        )}>
                                                            {task.status}
                                                        </div>
                                                    </div>

                                                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-muted-foreground bg-card/50 border border-border/50 rounded-xl border-dashed">
                                                No analysis tasks found matching your filters.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <PaginationControls
                                    currentPage={analysisPage}
                                    totalItems={filteredAnalysisTasks.length}
                                    itemsPerPage={analysisPerPage}
                                    onPageChange={setAnalysisPage}
                                    onItemsPerPageChange={setAnalysisPerPage}
                                />
                            </div>
                        </motion.div>
                    ) : activeTab === 'training' ? (
                        <motion.div
                            key="training"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Start New Fine-tuning Card */}
                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8 flex items-center justify-between cursor-pointer hover:shadow-lg hover:shadow-indigo-500/10 transition-all group"
                                onClick={() => navigate('/finetune?tab=settings')}
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Start New Fine-tuning</h2>
                                    <p className="text-muted-foreground max-w-lg">Optimize the base model with your own labeled datasets to improve recognition accuracy for specific materials.</p>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                    <Plus size={32} />
                                </div>
                            </div>

                            {/* Fine-tuning History */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <Activity size={18} className="text-muted-foreground" />
                                        Fine-tuning Jobs
                                    </h2>

                                    <div className="flex flex-wrap gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                            <input
                                                type="text"
                                                placeholder="Search jobs..."
                                                value={finetuneSearch}
                                                onChange={(e) => setFinetuneSearch(e.target.value)}
                                                className="pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-48"
                                            />
                                        </div>
                                        <select
                                            value={finetuneTimeFilter}
                                            onChange={(e) => setFinetuneTimeFilter(e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Time</option>
                                            <option value="today">Today</option>
                                            <option value="week">This Week</option>
                                            <option value="month">This Month</option>
                                        </select>
                                        <select
                                            value={finetuneTaskFilter}
                                            onChange={(e) => setFinetuneTaskFilter(e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="training">Training</option>
                                        </select>
                                        <select
                                            value={finetuneStatusFilter}
                                            onChange={(e) => setFinetuneStatusFilter(e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="completed">Completed</option>
                                            <option value="processing">Processing</option>
                                        </select>
                                    </div>
                                </div>

                                {viewMode === 'grid' ? (
                                    /* GRID VIEW */
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {visibleFinetuningTasks.length > 0 ? (
                                            visibleFinetuningTasks.map((task) => (
                                                <div key={task.id} className="group bg-card border border-border/60 hover:border-indigo-500/50 transition-all rounded-xl p-5 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer" onClick={() => navigate('/finetune')}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", task.thumbnail)}>
                                                            <Activity className="opacity-80 text-indigo-500" size={20} />
                                                        </div>
                                                        <div className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                            task.status === 'completed' ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                                                        )}>
                                                            {task.status}
                                                        </div>
                                                    </div>
                                                    <h3 className="font-bold text-foreground mb-1 group-hover:text-indigo-500 transition-colors">{task.name}</h3>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                        <span>{task.id}</span>
                                                        <span>•</span>
                                                        <span>{task.model}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 border border-border/50 rounded-xl border-dashed">
                                                No fine-tuning jobs found matching your filters.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* LIST (ROW) VIEW - FINE TUNING */
                                    <div className="space-y-3">
                                        {visibleFinetuningTasks.length > 0 ? (
                                            visibleFinetuningTasks.map((task) => (
                                                <div key={task.id} className="bg-card border border-border/60 hover:border-indigo-500/50 transition-all rounded-lg p-2.5 flex items-center justify-between hover:shadow-sm cursor-pointer group" onClick={() => navigate('/finetune')}>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", task.thumbnail)}>
                                                            <Activity size={16} className="text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-foreground group-hover:text-indigo-500 transition-colors text-sm">{task.name}</h3>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <span>{task.id}</span>
                                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                                <span>{task.model}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8 mr-4">
                                                        <div className="text-xs text-muted-foreground text-right hidden md:block">
                                                            <div className="font-medium">{task.date}</div>
                                                            <div className="opacity-70">Training Job</div>
                                                        </div>
                                                        <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-24 text-center",
                                                            task.status === 'completed' ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                                                        )}>
                                                            {task.status}
                                                        </div>
                                                    </div>

                                                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-muted-foreground bg-card/50 border border-border/50 rounded-xl border-dashed">
                                                No fine-tuning jobs found matching your filters.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <PaginationControls
                                    currentPage={finetunePage}
                                    totalItems={filteredFinetuningTasks.length}
                                    itemsPerPage={finetunePerPage}
                                    onPageChange={setFinetunePage}
                                    onItemsPerPageChange={setFinetunePerPage}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        /* RESOURCE BOARD CONTENT */
                        <motion.div
                            key="resources"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CPU Queue Card */}
                                <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex items-center justify-between relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                                <Cpu size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold">CPU Resource Queue</h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm">General processing & lightweight inference</p>
                                    </div>
                                    <div className="relative z-10 text-right space-y-1">
                                        <div className="text-3xl font-bold font-mono text-foreground">
                                            {RESOURCE_STATUS.cpu.available} <span className="text-sm text-muted-foreground font-sans font-normal">/ {RESOURCE_STATUS.cpu.total} {RESOURCE_STATUS.cpu.unit}</span>
                                        </div>
                                        <div className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full inline-block">
                                            {RESOURCE_STATUS.cpu.queued} Tasks Queued
                                        </div>
                                    </div>
                                </div>

                                {/* GPU Queue Card */}
                                <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex items-center justify-between relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                                                <Zap size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold">GPU Resource Queue</h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm">High-performance training & inference</p>
                                    </div>
                                    <div className="relative z-10 text-right space-y-1">
                                        <div className="text-3xl font-bold font-mono text-foreground">
                                            {RESOURCE_STATUS.gpu.available} <span className="text-sm text-muted-foreground font-sans font-normal">/ {RESOURCE_STATUS.gpu.total} {RESOURCE_STATUS.gpu.unit}</span>
                                        </div>
                                        <div className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full inline-block">
                                            {RESOURCE_STATUS.gpu.queued} Tasks Queued
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                                    <div className="flex items-center gap-3">
                                        {/* Mock User Avatar */}
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                            XZ
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold flex items-center gap-2">
                                                My Active Queue
                                            </h2>
                                            <p className="text-xs text-muted-foreground">Xia Zhiyi • Advanced Materials Lab</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-bold text-foreground">{USER_QUEUE.length}</span> active jobs
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                                            <tr>
                                                <th className="px-6 py-3 w-20 text-center">Rank</th>
                                                <th className="px-6 py-3">Job ID</th>
                                                <th className="px-6 py-3">Task Name</th>
                                                <th className="px-6 py-3">Type</th>
                                                <th className="px-6 py-3">Submitted</th>
                                                <th className="px-6 py-3">Priority</th>
                                                <th className="px-6 py-3 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {USER_QUEUE.map((job) => (
                                                <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-6 py-4 text-center font-mono text-muted-foreground text-xs">#{job.rank}</td>
                                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{job.id}</td>
                                                    <td className="px-6 py-4 font-medium text-foreground">{job.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                                                            job.type === 'particle' ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                                                        )}>
                                                            {job.type === 'particle' ? <Layers size={10} /> : <Activity size={10} />}
                                                            {job.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground text-xs">{job.submitted}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                                            job.priority === 'High' ? "border-red-200 text-red-600 bg-red-50" : "border-border text-muted-foreground"
                                                        )}>
                                                            {job.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="inline-flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                                            <span className="font-medium text-foreground">{job.status}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {USER_QUEUE.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                                                        No active tasks in your queue.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>

                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Right Floating Controls */}

        </motion.div >
    );
};
