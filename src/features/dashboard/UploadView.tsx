import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Upload, Plus, ArrowRight, ArrowLeft, Cpu, Zap, Database, FolderOpen, ChevronDown, Trash2 } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const ANALYSIS_TYPE_INFO = {
    particle: {
        title: "Particle Analysis",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop",
        subTasks: {
            default: {
                id: "default",
                title: "Default Mode",
                description: "Standard segmentation and characterization of individual particles. Calculates size distribution, sphericity, and morphological classifications automatically.",
                features: ["Size Distribution (D10, D50, D90)", "Shape Factors (Circularity)", "Automated Counting"],
                image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800&auto=format&fit=crop"
            },
            crack: {
                id: "crack",
                title: "Crack Analysis",
                description: "Specialized detection of surface cracks and structural defects within particles. Identifies fracture patterns and integrity issues.",
                features: ["Crack Length & Width", "Defect Density Heatmap", "Integrity Scoring"],
                image: "https://images.unsplash.com/photo-1518335359781-872f2e519c24?q=80&w=800&auto=format&fit=crop"
            },
            void: {
                id: "void",
                title: "Void Analysis",
                description: "Analysis of internal voids and pores on particle cross-sections. Crucial for porosity and material density studies.",
                features: ["Porosity Calculation", "Void Size Distribution", "Cross-section Mapping"],
                image: "https://images.unsplash.com/photo-1507641217030-222a7f058043?q=80&w=800&auto=format&fit=crop"
            },
            tem: {
                id: "tem",
                title: "TEM Overlapping",
                description: "Advanced separation algorithms to distinguish individual particles in dense, overlapping Transmission Electron Microscopy images.",
                features: ["Overlap Deconvolution", "Individual Boundary Detection", "Cluster Analysis"],
                image: "https://images.unsplash.com/photo-1629806496195-2dfbf44db8f3?q=80&w=800&auto=format&fit=crop"
            }
        }
    },
    fiber: {
        title: "Fiber Analysis",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
        subTasks: {
            coarse: {
                id: "coarse",
                title: "Coarse Fiber",
                description: "Optimized for larger diameter fibers, ensuring accurate width measurement even with surface roughness and variations.",
                features: ["Mean Diameter", "Roughness Tolerance", "Orientation Histogram"],
                image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop"
            },
            fine: {
                id: "fine",
                title: "Fine Fiber",
                description: "High-sensitivity detection for nanofibers and complex micro-fiber networks. Resolves fine structures and entanglements.",
                features: ["Nanofiber Detection", "Pore Size Analysis", "Entanglement Index"],
                image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800&auto=format&fit=crop"
            }
        }
    },
    stem: {
        title: "STEM Analysis",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
        subTasks: {
            haadf: {
                id: "haadf",
                title: "HAADF Atom Detection",
                description: "High-Angle Annular Dark-Field imaging analysis for direct atom column detection and quantification.",
                features: ["Atom Counting", "Intensity Analysis", "Lattice Mapping"],
                image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"
            }
        }
    }
};

export const UploadView = () => {
    const navigate = useNavigate();
    const [taskName, setTaskName] = useState('');
    const [datasetName, setDatasetName] = useState(`Dataset_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`);
    const [taskType, setTaskType] = useState<'particle' | 'fiber' | 'stem'>('particle');
    const [subTaskType, setSubTaskType] = useState('default');
    const [modelVersion, setModelVersion] = useState('v1.1');
    const [executionDevice, setExecutionDevice] = useState<'gpu' | 'cpu'>('gpu');
    const [description, setDescription] = useState('');

    const [selectedTasks, setSelectedTasks] = useState<Array<{
        id: string;
        taskType: string;
        subTaskType: string;
        modelVersion: string;
        title: string;
        subTaskTitle: string;
    }>>([]);

    const handleAddTask = () => {
        // @ts-ignore
        const subTaskTitle = ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.title || subTaskType;
        const newTask = {
            id: Math.random().toString(36).substr(2, 9),
            taskType,
            subTaskType,
            modelVersion,
            title: ANALYSIS_TYPE_INFO[taskType].title,
            subTaskTitle
        };
        setSelectedTasks([...selectedTasks, newTask]);
    };

    const handleRemoveTask = (id: string) => {
        setSelectedTasks(selectedTasks.filter(t => t.id !== id));
    };

    const handleStart = () => {
        if (taskType === 'particle') {
            navigate('/particles');
        } else if (taskType === 'fiber') {
            navigate('/fibers');
        } else {
            // TODO: Add route for STEM analysis
            console.log('Navigating to STEM Analysis');
            navigate('/stem');
        }
    };

    return (
        <div className="min-h-screen pb-20 flex flex-col max-w-5xl mx-auto py-8 pt-24 animate-in fade-in duration-500">

            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </button>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create Analysis Task</h1>
                <p className="text-muted-foreground text-lg">Upload images and configure recognition parameters to start a new analysis.</p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-8">

                {/* Row 1: Upload Area */}
                <div className="w-full">
                    <div className="border-2 border-dashed border-primary/20 hover:border-primary/50 rounded-2xl bg-card hover:bg-muted/30 transition-all cursor-pointer group p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-8">

                            {/* Left Side: Upload & Dataset Creation */}
                            <div className="flex-1 flex flex-col space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <Upload size={24} className="text-primary" />
                                        Upload SEM Images
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Create a new dataset from uploaded images.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 items-end">
                                    <div className="flex-1 w-full space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">New Dataset Name</label>
                                        <div className="relative">
                                            <Database size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={datasetName}
                                                onChange={(e) => setDatasetName(e.target.value)}
                                                className="w-full pl-9 pr-4 py-3 bg-background border border-border rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                                placeholder="Enter dataset name..."
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                    <button className="h-[46px] inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 whitespace-nowrap">
                                        <Plus size={18} />
                                        Select Files
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-dashed border-border"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground font-semibold">Or use existing data</span>
                                    </div>
                                </div>

                                {/* Existing Dataset Selection */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1">Select Existing Dataset</label>
                                    <div className="relative group/select">
                                        <FolderOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover/select:text-primary transition-colors" />
                                        <select
                                            className="w-full pl-9 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer hover:bg-muted hover:border-primary/30 appearance-none"
                                            onClick={(e) => e.stopPropagation()}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Choose a previously uploaded dataset...</option>
                                            <option value="ds1">Dataset_20241022_BatchA (12 images)</option>
                                            <option value="ds2">Dataset_20241020_Titanium (45 images)</option>
                                            <option value="ds3">Dataset_20241015_ControlGroup (8 images)</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Example Data (Keep as is, but adjust width/layout if needed) */}
                            <div className="w-full md:w-64 shrink-0 bg-background/50 backdrop-blur-sm rounded-xl p-5 border border-border/50 flex flex-col justify-center">
                                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider text-center md:text-left">Example Inputs</h4>
                                <div className="grid grid-cols-4 md:grid-cols-2 gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="aspect-square bg-card rounded-lg border border-border/50 flex items-center justify-center text-[10px] text-muted-foreground shadow-sm group-hover:border-primary/30 transition-colors">
                                            Img_{i}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Row 2: Analysis Type Selection & Info */}
                <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm space-y-8">
                    {/* Header with Model Version Selector */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/50 pb-6">
                        <div>
                            <h2 className="text-xl font-bold">Analysis Method</h2>
                            <p className="text-muted-foreground text-sm mt-1">Select the algorithm.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Visual Type Selector */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button
                                onClick={() => { setTaskType('particle'); setSubTaskType('default'); }}
                                className={cn(
                                    "relative rounded-xl border-2 text-left transition-all hover:border-primary/50 group overflow-hidden h-32",
                                    taskType === 'particle'
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border bg-card hover:bg-muted/30"
                                )}
                            >
                                <div className="absolute inset-0 w-full h-full">
                                    <img
                                        src={ANALYSIS_TYPE_INFO.particle.image}
                                        className="absolute right-0 top-0 h-full w-2/3 object-cover [mask-image:linear-gradient(to_left,black,transparent)] opacity-60 group-hover:opacity-80 transition-opacity"
                                        alt=""
                                    />
                                </div>
                                <div className="relative z-10 p-6 flex flex-col justify-center h-full">
                                    <h3 className={cn("font-bold text-xl", taskType === 'particle' ? "text-primary" : "text-foreground")}>Particle Analysis</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-[50%]">Detect and classify nanoparticles</p>
                                </div>
                                {taskType === 'particle' && (
                                    <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse z-20" />
                                )}
                            </button>

                            <button
                                onClick={() => { setTaskType('fiber'); setSubTaskType('coarse'); }}
                                className={cn(
                                    "relative rounded-xl border-2 text-left transition-all hover:border-primary/50 group overflow-hidden h-32",
                                    taskType === 'fiber'
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border bg-card hover:bg-muted/30"
                                )}
                            >
                                <div className="absolute inset-0 w-full h-full">
                                    <img
                                        src={ANALYSIS_TYPE_INFO.fiber.image}
                                        className="absolute right-0 top-0 h-full w-2/3 object-cover [mask-image:linear-gradient(to_left,black,transparent)] opacity-60 group-hover:opacity-80 transition-opacity"
                                        alt=""
                                    />
                                </div>
                                <div className="relative z-10 p-6 flex flex-col justify-center h-full">
                                    <h3 className={cn("font-bold text-xl", taskType === 'fiber' ? "text-primary" : "text-foreground")}>Fiber Analysis</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-[50%]">Analyze fiber networks & align</p>
                                </div>
                                {taskType === 'fiber' && (
                                    <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse z-20" />
                                )}
                            </button>

                            <button
                                onClick={() => { setTaskType('stem'); setSubTaskType('haadf'); }}
                                className={cn(
                                    "relative rounded-xl border-2 text-left transition-all hover:border-primary/50 group overflow-hidden h-32",
                                    taskType === 'stem'
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border bg-card hover:bg-muted/30"
                                )}
                            >
                                <div className="absolute inset-0 w-full h-full">
                                    <img
                                        src={ANALYSIS_TYPE_INFO.stem.image}
                                        className="absolute right-0 top-0 h-full w-2/3 object-cover [mask-image:linear-gradient(to_left,black,transparent)] opacity-60 group-hover:opacity-80 transition-opacity"
                                        alt=""
                                    />
                                </div>
                                <div className="relative z-10 p-6 flex flex-col justify-center h-full">
                                    <h3 className={cn("font-bold text-xl", taskType === 'stem' ? "text-primary" : "text-foreground")}>STEM Analysis</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-[50%]">Atomic resolution imaging</p>
                                </div>
                                {taskType === 'stem' && (
                                    <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse z-20" />
                                )}
                            </button>
                        </div>



                        {/* Dynamic Info Content */}
                        <div className="pt-6 border-t border-border/50 space-y-8">

                            {/* Top Row: Selectors & Add Button */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                {/* Sub-task Selector */}
                                <div className="space-y-3 flex-1">
                                    <label className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Analysis Mode</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.values(ANALYSIS_TYPE_INFO[taskType].subTasks).map((subTask) => (
                                            <button
                                                key={subTask.id}
                                                onClick={() => setSubTaskType(subTask.id)}
                                                className={cn(
                                                    "px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all",
                                                    subTaskType === subTask.id
                                                        ? "bg-primary/10 border-primary text-primary"
                                                        : "bg-transparent border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {subTask.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-end gap-3">
                                    {/* Model Version Selector */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Model Version</label>
                                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50">
                                            <select
                                                value={modelVersion}
                                                onChange={(e) => setModelVersion(e.target.value)}
                                                className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-primary transition-colors pr-8 py-1"
                                            >
                                                <option value="v1.1">v1.1 (Stable)</option>
                                                <option value="v1.2-beta">v1.2 (Beta)</option>
                                                <option value="v1.0">v1.0 (Legacy)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Add Task Button */}
                                    <button
                                        onClick={handleAddTask}
                                        className="h-[46px] px-6 rounded-xl font-bold text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Add Task
                                    </button>
                                </div>
                            </div>

                            {/* Bottom Row: Description & Image */}
                            <div className="flex flex-col md:flex-row gap-8 items-stretch">
                                <div className="flex-1 space-y-6 bg-muted/10 p-6 rounded-xl border border-border/50">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-primary rounded-full"></span>
                                            About this Algorithm
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed pl-3 border-l-2 border-border/50 ml-0.5">
                                            {/* @ts-ignore */}
                                            {ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.description || "Select a mode"}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Capabilities</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {/* @ts-ignore */}
                                            {ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-[400px] shrink-0">
                                    <div className="rounded-xl overflow-hidden bg-muted/50 border border-border/50 h-full min-h-[220px] relative group shadow-sm">
                                        <img
                                            /* @ts-ignore */
                                            src={ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.image}
                                            alt="Analysis Preview"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                            <div className="text-white">
                                                <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Preview</p>
                                                {/* @ts-ignore */}
                                                <p className="font-semibold">{ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.title} Result</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Task Queue List */}
                            {selectedTasks.length > 0 && (
                                <div className="mt-8 border-t border-border/50 pt-6">
                                    <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">Pipeline Tasks ({selectedTasks.length})</h4>
                                    <div className="space-y-3">
                                        {selectedTasks.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl hover:border-primary/30 transition-colors shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-4 ring-background">
                                                        {task.taskType.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground flex items-center gap-2">
                                                            {task.subTaskTitle}
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded border border-border text-muted-foreground">{task.modelVersion}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                            {task.title} • ID: {task.id}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveTask(task.id)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                    title="Remove Task"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Row 3: Task Configuration */}
                <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Task Configuration</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Inputs Column */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Task Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Batch 2023-10-25"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Execution Device</label>
                                <div className="grid grid-cols-2 gap-2 h-[38px]">
                                    <button
                                        onClick={() => setExecutionDevice('gpu')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 px-3 rounded-lg border transition-all text-sm font-medium h-full",
                                            executionDevice === 'gpu'
                                                ? "bg-primary/5 border-primary text-primary"
                                                : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <Zap size={14} />
                                        GPU
                                    </button>
                                    <button
                                        onClick={() => setExecutionDevice('cpu')}
                                        className={cn(
                                            "flex items-center justify-center gap-2 px-3 rounded-lg border transition-all text-sm font-medium h-full",
                                            executionDevice === 'cpu'
                                                ? "bg-primary/5 border-primary text-primary"
                                                : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <Cpu size={14} />
                                        CPU
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <textarea
                                    placeholder="Add notes about this analysis batch..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Button Column */}
                        <div className="w-full lg:w-48 flex-shrink-0 flex items-stretch">
                            <button
                                onClick={handleStart}
                                className="w-full h-full min-h-[60px] lg:min-h-auto bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex flex-col items-center justify-center gap-2 shadow-lg shadow-primary/25"
                            >
                                <span className="text-lg">Start Analysis</span>
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
