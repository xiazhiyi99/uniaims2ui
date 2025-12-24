import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Upload, Plus, ArrowRight, ArrowLeft, Cpu, Zap } from 'lucide-react';
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
    }
};

export const UploadView = () => {
    const navigate = useNavigate();
    const [taskName, setTaskName] = useState('');
    const [taskType, setTaskType] = useState<'particle' | 'fiber'>('particle');
    const [subTaskType, setSubTaskType] = useState('default');
    const [modelVersion, setModelVersion] = useState('v1.1');
    const [executionDevice, setExecutionDevice] = useState<'gpu' | 'cpu'>('gpu');
    const [description, setDescription] = useState('');

    const handleStart = () => {
        if (taskType === 'particle') {
            navigate('/particles');
        } else {
            navigate('/fibers');
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
                    <div className="border-2 border-dashed border-primary/20 hover:border-primary/50 rounded-2xl bg-card hover:bg-muted/30 transition-all cursor-pointer group p-10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Upload size={40} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">Upload SEM Images</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Drag & drop your files here, or click to select. Supports TIFF, JPG, PNG, and DM3 formats (Max 500MB).
                                    </p>
                                </div>
                                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                    <Plus size={20} />
                                    Select Files
                                </button>
                            </div>

                            <div className="w-full md:w-auto bg-background/50 backdrop-blur-sm rounded-xl p-5 border border-border/50">
                                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Example Data</h4>
                                <div className="grid grid-cols-4 gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-16 h-16 bg-card rounded-lg border border-border/50 flex items-center justify-center text-[10px] text-muted-foreground shadow-sm">
                                            Img_{i}.tif
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>



                        {/* Dynamic Info Content */}
                        <div className="flex flex-col md:flex-row gap-8 pt-4 border-t border-border/50">
                            <div className="flex-1 space-y-6">
                                {/* Sub-task Selector */}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Analysis Mode</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.values(ANALYSIS_TYPE_INFO[taskType].subTasks).map((subTask) => (
                                            <button
                                                key={subTask.id}
                                                onClick={() => setSubTaskType(subTask.id)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                                    subTaskType === subTask.id
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                                )}
                                            >
                                                {subTask.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Model Version Selector */}
                                <div className="flex items-center gap-3 mb-6 bg-muted/30 px-4 py-3 rounded-lg border border-border/50 w-fit">
                                    <label className="text-sm font-medium whitespace-nowrap text-muted-foreground">Model Version:</label>
                                    <select
                                        value={modelVersion}
                                        onChange={(e) => setModelVersion(e.target.value)}
                                        className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-primary transition-colors pr-2"
                                    >
                                        <option value="v1.1">v1.1 (Stable)</option>
                                        <option value="v1.2-beta">v1.2 (Beta)</option>
                                        <option value="v1.0">v1.0 (Legacy)</option>
                                    </select>
                                </div>


                                <div>
                                    <h3 className="font-bold text-lg mb-2">About this Algorithm</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {/* @ts-ignore */}
                                        {ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.description || "Select a mode"}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Capabilities</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* @ts-ignore */}
                                        {ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 shrink-0">
                                <div className="rounded-xl overflow-hidden bg-muted/50 border border-border/50 h-full min-h-[180px] relative group">
                                    <img
                                        /* @ts-ignore */
                                        src={ANALYSIS_TYPE_INFO[taskType].subTasks[subTaskType]?.image}
                                        alt="Analysis Preview"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 text-xs font-medium text-foreground/50">
                                        Preview
                                    </div>
                                </div>
                            </div>
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
