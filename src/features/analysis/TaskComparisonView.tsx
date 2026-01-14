import { useState, useMemo } from 'react';
import { CheckSquare, Square, Layers, Settings, Plus, X, Activity, FilePlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const ATTRIBUTES = [
    'Area',
    'Perimeter',
    'Diameter',
    'Major Axis',
    'Minor Axis',
    'Aspect Ratio',
    'Roundness',
    'Solidity'
];

// Mock Tasks Data
const MOCK_ALL_TASKS = [
    { id: 'Task-2023-001', name: 'Baseline Analysis', date: '2023-10-01', count: 120 },
    { id: 'Task-2023-002', name: 'High Temp Batch', date: '2023-10-05', count: 156 },
    { id: 'Task-2023-003', name: 'Low Pressure Test', date: '2023-10-12', count: 89 },
    { id: 'Task-2023-004', name: 'Fiber Orientation B', date: '2023-10-15', count: 210 },
];

const IMAGES_BY_TASK: Record<string, any[]> = {
    'default': [
        { id: 'Img_001.tif', status: 'Completed', count: 245 },
        { id: 'Img_002.tif', status: 'Completed', count: 312 },
        { id: 'Img_003.tif', status: 'Completed', count: 156 },
    ],
    'Task-2023-001': [
        { id: 'Base_01.tif', status: 'Completed', count: 100 },
        { id: 'Base_02.tif', status: 'Completed', count: 20 },
    ],
    'Task-2023-002': [
        { id: 'Heat_01.tif', status: 'Completed', count: 50 },
        { id: 'Heat_02.tif', status: 'Completed', count: 60 },
        { id: 'Heat_03.tif', status: 'Completed', count: 46 },
    ],
    'Task-2023-003': [
        { id: 'LowP_01.tif', status: 'Completed', count: 89 },
    ],
    'Task-2023-004': [
        { id: 'FibB_01.tif', status: 'Completed', count: 110 },
        { id: 'FibB_02.tif', status: 'Completed', count: 100 },
    ]
};

// Helper to generate mock density data
const generateViolinData = (id: string, name: string) => {
    // Randomize distribution characteristics based on ID hash or something simple
    const seed = id.length + name.length;
    const mean = 5 + (seed % 5);
    const spread = 2 + (seed % 3);

    return {
        id,
        name,
        mean,
        min: Math.max(0, mean - spread),
        max: mean + spread,
        density: Array.from({ length: 20 }, (_, i) => {
            const x = i / 19;
            return Math.exp(-Math.pow((x - 0.5) * 4, 2));
        })
    };
};

const CustomViolinShape = (props: any) => {
    const { x, y, width, height, payload, fill } = props;

    if (!payload || !payload.density) return null;

    const { density } = payload;
    const centerX = x + width / 2;
    const maxHalfWidth = (width * 0.8) / 2;

    let leftPath = `M ${centerX} ${y + height}`;
    let rightPath = `M ${centerX} ${y + height}`;

    const stepY = height / (density.length - 1);

    density.forEach((d: number, i: number) => {
        const currY = y + height - (i * stepY);
        const w = d * maxHalfWidth;
        leftPath += ` L ${centerX - w} ${currY}`;
        rightPath += ` L ${centerX + w} ${currY}`;
    });

    leftPath += ` L ${centerX} ${y}`;
    rightPath += ` L ${centerX} ${y}`;

    return (
        <g>
            <path d={`${leftPath} ${rightPath.replace('M', 'L').substring(1)} Z`} fill={fill} stroke={fill} fillOpacity={0.6} />
            <line x1={centerX - 10} y1={y + height / 2} x2={centerX + 10} y2={y + height / 2} stroke="white" strokeWidth={2} />
        </g>
    );
};

export const TaskComparisonView = () => {
    const { taskId } = useParams();
    const { isCollapsed } = useSidebar();
    const currentTaskName = taskId || 'Current Task';

    // State
    const [selectedAttribute, setSelectedAttribute] = useState<string>('Diameter');
    const [taskSearchQuery, setTaskSearchQuery] = useState('');
    const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);

    // List of tasks to compare. Start with current task.
    // We treat the current task ID from params as 'current', but let's give it an ID structure.
    const [compareTasks, setCompareTasks] = useState<any[]>([
        { id: taskId || 'current', name: currentTaskName, isCurrent: true }
    ]);

    // Active task for Image Viewer (bottom panel)
    const [activeTaskForImages, setActiveTaskForImages] = useState<string>(taskId || 'current');

    const [logScale, setLogScale] = useState<boolean>(false);

    // Mock images selection state (per task)
    // Map { taskId: [imageId1, imageId2] }
    const [taskImageSelection, setTaskImageSelection] = useState<Record<string, string[]>>({});

    const handleToggleImage = (taskId: string, imgId: string) => {
        setTaskImageSelection(prev => {
            const current = prev[taskId] || [];
            if (current.includes(imgId)) {
                return { ...prev, [taskId]: current.filter(id => id !== imgId) };
            } else {
                return { ...prev, [taskId]: [...current, imgId] };
            }
        });
    };

    const handleAddTask = (task: any) => {
        if (!compareTasks.find(t => t.id === task.id)) {
            setCompareTasks([...compareTasks, task]);
        }
        setIsTaskDropdownOpen(false);
    };

    const handleRemoveTask = (taskId: string) => {
        setCompareTasks(compareTasks.filter(t => t.id !== taskId));
        if (activeTaskForImages === taskId) {
            setActiveTaskForImages(compareTasks[0]?.id || '');
        }
    };

    // Chart Data
    const chartData = useMemo(() => {
        return compareTasks.map(task => generateViolinData(task.id, task.name));
    }, [compareTasks]);

    // Get images for currently active task
    const activeDisplayImages = useMemo(() => {
        if (activeTaskForImages === (taskId || 'current')) {
            // Return images for current task (default mock)
            return IMAGES_BY_TASK['default'];
        }
        return IMAGES_BY_TASK[activeTaskForImages] || [];
    }, [activeTaskForImages, taskId]);

    // Shared Image List Component
    const ImageList = ({ vertical = false }: { vertical?: boolean }) => (
        <div className={`flex ${vertical ? 'flex-col min-w-0' : 'flex-row'} gap-3 h-full`}>
            {activeDisplayImages.length > 0 ? (
                activeDisplayImages.map((img) => {
                    const isSelected = (taskImageSelection[activeTaskForImages] || []).includes(img.id);
                    return (
                        <div
                            key={img.id}
                            className={`${vertical ? 'w-full h-32' : 'w-32 h-full'} rounded-lg border-2 shrink-0 relative group cursor-pointer overflow-hidden transition-all ${isSelected ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100 hover:border-border'
                                }`}
                            onClick={() => handleToggleImage(activeTaskForImages, img.id)}
                        >
                            <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                <Layers className="text-muted-foreground/20" size={32} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex flex-col justify-end">
                                <div className="text-xs font-bold text-white truncate">{img.id}</div>
                                <div className="text-[10px] text-white/70">{img.count} particles</div>
                            </div>
                            <div className={`absolute top-2 right-2 w-5 h-5 rounded bg-background flex items-center justify-center transition-transform ${isSelected ? 'scale-100' : 'scale-0 group-hover:scale-100'}`}>
                                {isSelected ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} className="text-muted-foreground" />}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="w-full flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg p-4">
                    No images available for this task.
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full p-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="mb-6 px-1 pt-1 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Comparing Task <span className="text-primary">{currentTaskName}</span> with other tasks
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Analyze and compare performance metrics between the current task and historical data to identify trends.
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium">
                        <FilePlus size={18} />
                        <span>Add current to report</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area with Adaptive Sidebar */}
            <div className="flex-1 flex min-h-0">

                {/* Collapsed Sidebar Mode: Left Panel for Images */}
                <motion.div
                    initial={false}
                    animate={{
                        width: isCollapsed ? 176 : 0,
                        marginRight: isCollapsed ? 16 : 0,
                        opacity: isCollapsed ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-card rounded-xl border border-border shadow-sm flex flex-col shrink-0 overflow-hidden"
                >
                    <div className="p-4 border-b border-border flex flex-col gap-1 bg-muted/20 min-w-[176px]">
                        <h3 className="font-semibold flex items-center gap-2 text-sm">
                            <Layers size={16} />
                            Images in Calculation
                        </h3>
                        <div className="text-xs text-primary font-medium truncate">
                            {compareTasks.find(t => t.id === activeTaskForImages)?.name}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 min-w-[176px]">
                        <ImageList vertical={true} />
                    </div>
                </motion.div>

                {/* Main Scrollable Content */}
                <div className="flex-1 flex flex-col min-w-0 h-full">

                    {/* Expanded Sidebar Mode: Top Panel for Images */}
                    <motion.div
                        initial={false}
                        animate={{
                            height: isCollapsed ? 0 : 200, // Reduced height for top panel
                            opacity: isCollapsed ? 0 : 1,
                            marginBottom: isCollapsed ? 0 : 24
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden shrink-0"
                    >
                        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                            <div className="flex items-center gap-4">
                                <h3 className="font-semibold flex items-center gap-2 text-sm">
                                    <Layers size={16} />
                                    Images in Calculation
                                </h3>
                                <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    {compareTasks.find(t => t.id === activeTaskForImages)?.name}
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Selected: {(taskImageSelection[activeTaskForImages] || []).length} / {activeDisplayImages.length}
                            </div>
                        </div>
                        <div className="flex-1 overflow-x-auto p-4">
                            <ImageList vertical={false} />
                        </div>
                    </motion.div>

                    {/* Chart & Settings Grid */}
                    <div className="flex-1 min-h-[400px] grid grid-cols-1 lg:grid-cols-3 gap-6 mb-1">

                        {/* Left: Violin Plot */}
                        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 flex flex-col shadow-sm h-full">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <Activity className="text-primary" size={20} />
                                        Task Comparison: {selectedAttribute}
                                    </h3>
                                    <div className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                                        {compareTasks.length} Tasks
                                    </div>
                                </div>
                                <div className="flex bg-muted/50 p-0.5 rounded-lg border border-border/50">
                                    <button
                                        onClick={() => setLogScale(false)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!logScale ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        Linear
                                    </button>
                                    <button
                                        onClick={() => setLogScale(true)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${logScale ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        Log
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#888', fontSize: 11 }}
                                            label={{ value: selectedAttribute + (logScale ? ' (Log)' : ''), angle: -90, position: 'insideLeft', fill: '#666', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-popover border border-border rounded-lg shadow-xl p-3 text-xs">
                                                            <div className="font-bold mb-1">{data.name}</div>
                                                            <div className="text-muted-foreground">Mean: {data.mean.toFixed(2)}</div>
                                                            <div className="text-muted-foreground">Range: {data.min.toFixed(2)} - {data.max.toFixed(2)}</div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="mean" shape={<CustomViolinShape />}>
                                            {chartData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={`hsl(${210 + (index * 40)}, 80%, 60%)`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Right: Settings & Task List */}
                        <div className="bg-card border border-border rounded-xl p-4 flex flex-col shadow-sm h-full">
                            <div className="flex items-center gap-2 font-bold mb-4 pb-2 border-b border-border">
                                <Settings size={18} />
                                <span>Comparison Settings</span>
                            </div>

                            <div className="space-y-6 overflow-y-auto pr-2 flex-1 min-h-0">
                                {/* Attribute Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metric</label>
                                    <div className="relative">
                                        <select
                                            value={selectedAttribute}
                                            onChange={(e) => setSelectedAttribute(e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer hover:border-border/80 transition-colors"
                                        >
                                            {ATTRIBUTES.map(attr => (
                                                <option key={attr} value={attr}>
                                                    {attr}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Task List Management */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tasks</label>
                                        {/* Add Task Dropdown with Search */}
                                        <div className="relative group">
                                            <button
                                                className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-colors ${isTaskDropdownOpen ? 'bg-primary/20 text-primary' : 'text-primary bg-primary/10 hover:bg-primary/20'}`}
                                                onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
                                            >
                                                <Plus size={14} />
                                                <span>Add Task</span>
                                            </button>

                                            {/* Backdrop for clicking outside */}
                                            {isTaskDropdownOpen && (
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsTaskDropdownOpen(false)}
                                                />
                                            )}

                                            <div className={`absolute right-0 top-full mt-2 w-72 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isTaskDropdownOpen ? 'block' : 'hidden'}`}>
                                                <div className="p-3 border-b border-border bg-muted/30">
                                                    <div className="relative">
                                                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="11" cy="11" r="8"></circle>
                                                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                            </svg>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Search tasks..."
                                                            className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary/50 transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) => {
                                                                const val = e.target.value.toLowerCase();
                                                                setTaskSearchQuery(val);
                                                            }}
                                                            value={taskSearchQuery}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="max-h-64 overflow-y-auto p-1">
                                                    {MOCK_ALL_TASKS
                                                        .filter(mt => !compareTasks.find(ct => ct.id === mt.id))
                                                        .filter(mt => mt.name.toLowerCase().includes(taskSearchQuery) || mt.id.toLowerCase().includes(taskSearchQuery))
                                                        .map(task => (
                                                            <button
                                                                key={task.id}
                                                                className="w-full text-left px-3 py-2 text-xs hover:bg-muted rounded-lg flex flex-col gap-0.5 transition-colors group/item"
                                                                onClick={() => handleAddTask(task)}
                                                            >
                                                                <span className="font-medium text-foreground group-hover/item:text-primary transition-colors">{task.name}</span>
                                                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                                                    <span>{task.id}</span>
                                                                    <span>{task.date}</span>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    {MOCK_ALL_TASKS.filter(mt => !compareTasks.find(ct => ct.id === mt.id)).filter(mt => mt.name.toLowerCase().includes(taskSearchQuery) || mt.id.toLowerCase().includes(taskSearchQuery)).length === 0 && (
                                                        <div className="py-8 text-center text-xs text-muted-foreground">
                                                            No matching tasks found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {compareTasks.map(task => (
                                            <div
                                                key={task.id}
                                                onClick={() => setActiveTaskForImages(task.id)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all relative group ${activeTaskForImages === task.id
                                                    ? 'bg-accent/50 border-primary/50 ring-1 ring-primary/20'
                                                    : 'bg-background border-border hover:border-border/80'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-medium text-sm text-foreground">{task.name}</div>
                                                        <div className="text-[10px] text-muted-foreground mt-0.5">{task.isCurrent ? 'Current Session' : task.date || task.id}</div>
                                                    </div>
                                                    {!task.isCurrent && (
                                                        <button
                                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveTask(task.id);
                                                            }}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
