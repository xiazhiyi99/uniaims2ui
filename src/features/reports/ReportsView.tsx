import { useState } from 'react';
import { FileText, Download, Share2, GripVertical, Trash2, ChevronDown, ChevronRight, Settings, Image as ImageIcon, Save, FolderOpen } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    ScatterChart,
    Scatter
} from 'recharts';

// Types
type ReportModule = {
    id: string;
    type: 'attribute' | 'correlation' | 'comparison';
    title: string;
    description: string;
    data?: any;
    config: {
        attributes: string[];
        settings?: Record<string, string | number | boolean>;
        images: string[];
    };
};

// Mock Data representing items "added" from other views
const MOCK_MODULES: ReportModule[] = [
    {
        id: 'mod_1',
        type: 'attribute',
        title: 'Attribute Analysis: Area',
        description: 'Distribution of particle area showing predominant size range.',
        config: {
            attributes: ['Area'],
            settings: { 'Bin Size': 5, 'Range': '0-20', 'Y-Axis': 'Count' },
            images: ['Img_001.tif', 'Img_002.tif', 'Img_003.tif']
        },
        data: [
            { range: '0-5', count: 120 },
            { range: '5-10', count: 450 },
            { range: '10-15', count: 320 },
            { range: '15-20', count: 110 },
        ]
    },
    {
        id: 'mod_2',
        type: 'attribute',
        title: 'Attribute Analysis: Aspect Ratio',
        description: 'Shape consistency analysis.',
        config: {
            attributes: ['Aspect Ratio'],
            settings: { 'Bin Size': 0.2, 'Range': '1.0-2.0', 'Y-Axis': 'Percentage' },
            images: ['Img_001.tif', 'Img_004.tif']
        },
        data: [
            { range: '1.0-1.2', count: 300 },
            { range: '1.2-1.4', count: 400 },
            { range: '1.4-1.6', count: 200 },
            { range: '1.6+', count: 100 },
        ]
    },
    {
        id: 'mod_3',
        type: 'correlation',
        title: 'Correlation: Area vs. Aspect Ratio',
        description: 'Scatter plot indicating relationship between size and shape.',
        config: {
            attributes: ['Area', 'Aspect Ratio'],
            settings: { 'Regression': true, 'Log Scale X': false, 'Log Scale Y': false },
            images: ['Img_001.tif', 'Img_002.tif', 'Img_003.tif', 'Img_005.tif']
        },
        data: Array.from({ length: 50 }, () => ({ x: Math.random() * 20, y: 1 + Math.random() * 1 }))
    },
    {
        id: 'mod_4',
        type: 'comparison',
        title: 'Comparison: Area Distribution',
        description: 'Violin plot comparison across 3 selected images.',
        config: {
            attributes: ['Area'],
            settings: { 'Log Scale': true },
            images: ['Img_001.tif', 'Img_002.tif', 'Img_003.tif']
        },
        data: [
            // Simplified for preview
            { id: 'Img_1', val: 80 },
            { id: 'Img_2', val: 95 },
            { id: 'Img_3', val: 60 },
        ]
    }
];

const ModuleItem = ({ module }: { module: ReportModule }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="group relative bg-background rounded-lg border border-border transition-all hover:border-primary/50 hover:shadow-md">
            <div className="p-3 flex gap-3">
                <div className="mt-1 text-muted-foreground cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer select-none">
                            <div className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">{module.type}</div>
                            <h4 className="font-medium text-sm text-foreground">{module.title}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            <button className="p-1 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    {!isExpanded && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{module.description}</p>
                    )}

                    {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-border/50 text-xs space-y-3 animation-fade-in">
                            {/* Attributes */}
                            <div>
                                <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                                    <FileText size={12} /> Attributes
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {module.config.attributes.map(attr => (
                                        <span key={attr} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium border border-primary/20">
                                            {attr}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Settings */}
                            {module.config.settings && Object.keys(module.config.settings).length > 0 && (
                                <div>
                                    <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                                        <Settings size={12} /> Settings
                                    </span>
                                    <div className="grid grid-cols-2 gap-1 gap-x-4">
                                        {Object.entries(module.config.settings).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center text-muted-foreground">
                                                <span>{key}:</span>
                                                <span className="text-foreground font-medium">{value.toString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Images */}
                            <div>
                                <span className="font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                                    <ImageIcon size={12} /> Images ({module.config.images.length})
                                </span>
                                <div className="max-h-20 overflow-y-auto bg-muted/30 rounded p-1.5 border border-border/50">
                                    <div className="grid grid-cols-1 gap-1">
                                        {module.config.images.map(img => (
                                            <div key={img} className="px-1.5 py-0.5 bg-background rounded border border-border/50 text-[10px] text-muted-foreground truncate">
                                                {img}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ReportsView = () => {
    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Report Generator</h2>
                    <p className="text-muted-foreground">Compile analysis modules into a final PDF report.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted font-medium text-sm">
                        <Share2 size={16} />
                        Share Link
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 shadow-lg shadow-primary/25">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Left Panel: Report Modules List */}
                <div className="w-[350px] flex flex-col gap-4 bg-card rounded-xl border border-border p-4 shadow-sm">
                    <div className="flex flex-col gap-3 pb-3 border-b border-border">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText size={20} className="text-primary" />
                                Report Modules
                            </h3>
                            <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">{MOCK_MODULES.length} Items</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md text-xs font-medium transition-colors">
                                <Save size={14} />
                                Save Template
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md text-xs font-medium transition-colors">
                                <FolderOpen size={14} />
                                Load Template
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {MOCK_MODULES.map((module) => (
                            <ModuleItem key={module.id} module={module} />
                        ))}
                    </div>

                    <div className="pt-2 border-t border-border text-center">
                        <p className="text-xs text-muted-foreground">Drag to reorder modules</p>
                    </div>
                </div>

                {/* Right Panel: PDF Preview */}
                <div className="flex-1 bg-neutral-200/50 dark:bg-neutral-900/50 rounded-xl border border-border flex flex-col items-center p-8 overflow-y-auto">
                    {/* A4 Page Container */}
                    <div className="w-[595px] min-h-[842px] bg-white text-black shadow-xl rounded-sm p-12 flex flex-col gap-8 shrink-0 relative">
                        {/* Header */}
                        <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-2">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">Analysis Report</h1>
                                <p className="text-slate-500 mt-1 font-medium">Project: #UNIAIMS-2025-X9</p>
                            </div>
                            <div className="text-right text-sm text-slate-600">
                                <p>Date: {new Date().toLocaleDateString()}</p>
                                <p>Generated by: UniAIMS 2.0</p>
                            </div>
                        </div>

                        {/* Modules Rendering */}
                        <div className="flex flex-col gap-10">
                            {MOCK_MODULES.map((module, index) => (
                                <div key={module.id} className="break-inside-avoid">
                                    <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800">{module.title}</h3>
                                    </div>

                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                        <div className="h-48 w-full">
                                            {/* Conditional Rendering based on type */}
                                            {module.type === 'attribute' && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={module.data}>
                                                        <XAxis dataKey="range" fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                                        <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            )}
                                            {module.type === 'correlation' && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <ScatterChart>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis type="number" dataKey="x" name="Area" unit="um" fontSize={10} />
                                                        <YAxis type="number" dataKey="y" name="Aspect" fontSize={10} />
                                                        <Scatter name="Particles" data={module.data} fill="#8884d8" />
                                                    </ScatterChart>
                                                </ResponsiveContainer>
                                            )}
                                            {module.type === 'comparison' && (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={module.data}>
                                                        <XAxis dataKey="id" fontSize={10} />
                                                        <YAxis fontSize={10} />
                                                        <Bar dataKey="val" fill="#a855f7" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 italic">{module.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-6 left-12 right-12 text-center border-t border-gray-100 pt-3">
                            <p className="text-xs text-slate-400">Page 1 of 1 • Generated by UniAIMS Analysis Suite</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
