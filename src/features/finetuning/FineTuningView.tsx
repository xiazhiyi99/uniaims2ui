import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Save, Database, Box, Activity, Terminal, PenTool, Plus, FileText, Tag, ChevronRight, UploadCloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for Training Chart
const TRAINING_DATA = Array.from({ length: 20 }, (_, i) => ({
    epoch: i + 1,
    loss: Math.max(0.1, 2.5 * Math.exp(-0.2 * i) + Math.random() * 0.2),
    accuracy: Math.min(0.98, 0.6 + 0.4 * (1 - Math.exp(-0.2 * i)) + Math.random() * 0.05)
}));

const EXISTING_DATASETS = [
    { id: 'DS-001', name: 'Textile Defect 2023', size: '2.4 GB', items: 1200, lastModified: '2 days ago' },
    { id: 'DS-002', name: 'Carbon Nano V1', size: '1.1 GB', items: 850, lastModified: '1 week ago' },
    { id: 'DS-003', name: 'Graphene Oxide - Public', size: '4.5 GB', items: 3200, lastModified: '2 weeks ago' },
];

const CURRENT_SESSION_DATA = [
    { id: 'TMP-104', name: 'Batch 44 - Active Upload', size: '128 MB', items: 45, status: 'Unlabeled' },
];

const ConfigurationView = () => {
    const [name, setName] = useState('New_FineTune_Job_01');
    const [task, setTask] = useState('');
    const [model, setModel] = useState('v1.1');

    return (
        <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-300">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Training Configuration</h2>
                    <p className="text-muted-foreground">Setup parameters for a new fine-tuning session.</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 space-y-6 shadow-sm">
                    <div>
                        <label className="text-sm font-semibold mb-2 block">Job Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-2 block">Source Task (Training Data)</label>
                        <div className="relative">
                            <select
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
                            >
                                <option value="" disabled>Select a completed task...</option>
                                <option value="T-1024">T-1024: N95 Filter Analysis (15 labeled)</option>
                                <option value="T-1025">T-1025: Carbon Nano Batch A (42 labeled)</option>
                                <option value="T-1029">T-1029: Graphene Oxide (120 labeled)</option>
                            </select>
                            <Database size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold mb-2 block">Base Model Architecture</label>
                        <div className="relative">
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
                            >
                                <option value="v1.1">UniAIMS ResNet-50 v1.1 (Standard)</option>
                                <option value="v1.2-beta">UniAIMS ViT-B v1.2 (Beta)</option>
                                <option value="v0.9">Legacy v0.9 (Stability)</option>
                            </select>
                            <Box size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            <Save size={18} />
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TrainingDashboard = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Training Dashboard</h2>
                    <p className="text-muted-foreground">Real-time monitoring of model convergence.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted transition-colors font-medium text-sm">
                        <Terminal size={16} />
                        View Logs
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm shadow-lg shadow-primary/20">
                        <Play size={16} fill="currentColor" />
                        Start Training
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Epoch</div>
                    <div className="text-3xl font-bold font-mono">12 <span className="text-lg text-muted-foreground">/ 50</span></div>
                    <div className="text-xs text-green-600 mt-2 font-medium">Running • 2m 45s remaining</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Training Loss</div>
                    <div className="text-3xl font-bold font-mono text-red-500">0.245</div>
                    <div className="text-xs text-muted-foreground mt-2">-12% from previous epoch</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Validation Accuracy</div>
                    <div className="text-3xl font-bold font-mono text-blue-500">94.8%</div>
                    <div className="text-xs text-muted-foreground mt-2">New high score!</div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-[400px]">
                <h3 className="font-bold text-sm mb-6 flex items-center gap-2">
                    <Activity size={18} className="text-primary" />
                    Learning Curve
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={TRAINING_DATA}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                        <XAxis dataKey="epoch" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgb(23, 23, 23)', border: '1px solid rgb(64, 64, 64)', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const PlaceholderView = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mb-6 text-muted-foreground">
            <Icon size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground max-w-sm">This module is correctly linked but requires backend data integration to function.</p>
    </div>
);

const DataManagerView = () => {
    const [_, setSearchParams] = useSearchParams();

    const goToAnnotation = (datasetName: string) => {
        setSearchParams({ tab: 'annotation', dataset: datasetName });
    };

    return (
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row p-6 gap-6 animate-in fade-in duration-300 h-full">

            {/* Left Panel: Data Repository */}
            <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Database size={18} className="text-primary" />
                            Data Repository
                        </h2>
                        <p className="text-xs text-muted-foreground">Manage existing labeled datasets.</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg text-xs font-bold">
                        <UploadCloud size={14} />
                        Upload New
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {EXISTING_DATASETS.map((ds) => (
                        <div key={ds.id} className="bg-background border border-border/60 hover:border-primary/40 rounded-xl p-4 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                                        <Database size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-foreground">{ds.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                            <span>{ds.items} items</span>
                                            <span>•</span>
                                            <span>{ds.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{ds.lastModified}</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => goToAnnotation(ds.name)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border hover:bg-muted text-xs font-medium transition-colors group-hover:border-primary/30"
                                >
                                    <Tag size={14} />
                                    Modify Labels
                                </button>
                                <button className="px-3 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Upload Placeholder Area */}
                    <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 hover:border-primary/30 transition-all cursor-pointer">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                            <Plus size={24} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold">Drop Dataset Archive</h3>
                        <p className="text-xs text-muted-foreground mt-1">Supports .zip containing images & XML/JSON</p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Current Task Context */}
            <div className="flex-1 flex flex-col">
                <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Activity size={120} />
                    </div>

                    <div className="p-5 border-b border-border bg-gradient-to-r from-muted/20 to-transparent">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Activity size={18} className="text-orange-500" />
                            Current Session Data
                        </h2>
                        <p className="text-xs text-muted-foreground">Data from active analysis tasks available for training.</p>
                    </div>

                    <div className="flex-1 p-4 space-y-4">
                        {CURRENT_SESSION_DATA.map((item) => (
                            <div key={item.id} className="bg-background border-l-4 border-l-orange-500 border-y border-r border-border rounded-r-xl p-5 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full">
                                                Active
                                            </span>
                                            <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                                        </div>
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold">{item.items} img</div>
                                        <div className="text-xs text-muted-foreground">{item.size}</div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground mb-4">
                                    This data was uploaded during the current session but has not been fully verified for training.
                                </p>

                                <button
                                    onClick={() => goToAnnotation(item.name)}
                                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                                >
                                    <PenTool size={16} />
                                    Enter Annotation Studio
                                </button>
                            </div>
                        ))}

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
                            <div className="flex gap-2">
                                <FileText size={18} className="shrink-0" />
                                <p>
                                    <strong>Tip:</strong> Labeling data from your current session is the most effective way to improve model performance on your specific samples.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FineTuningView = () => {
    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab') || 'settings';

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
            {tab === 'training' && <TrainingDashboard />}
            {tab === 'settings' && <ConfigurationView />}
            {tab === 'data' && <DataManagerView />}
            {tab === 'annotation' && <PlaceholderView title="Annotation Studio" icon={PenTool} />}
        </div>
    );
};
