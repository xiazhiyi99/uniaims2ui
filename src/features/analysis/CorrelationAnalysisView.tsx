import { useState, useMemo } from 'react';
import { CheckSquare, Square, Layers, Settings, FilePlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { motion } from 'framer-motion';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const ATTRIBUTES = [
    'Area',
    'Perimeter',
    'Diameter',
    'Major Axis',
    'Minor Axis',
    'Aspect Ratio',
    'Sphericity',
    'Form Factor AR',
    'Smoothness'
];

const IMAGES = [
    { id: 'Img_001.tif', status: 'Completed', count: 245 },
    { id: 'Img_002.tif', status: 'Completed', count: 312 },
    { id: 'Img_003.tif', status: 'Completed', count: 156 },
    { id: 'Img_004.tif', status: 'Pending', count: 0 },
    { id: 'Img_005.tif', status: 'Pending', count: 0 },
];

const CORRELATION_DATA = Array.from({ length: 50 }, () => ({
    x: Math.random() * 10 + 2,
    y: Math.random() * 0.5 + 0.5,
}));

export const CorrelationAnalysisView = () => {
    const { taskId } = useParams();
    const { isCollapsed } = useSidebar();

    // State
    const [xAttribute, setXAttribute] = useState<string>('Diameter');
    const [yAttribute, setYAttribute] = useState<string>('Circularity');
    const [selectedImages, setSelectedImages] = useState<string[]>(IMAGES.map(img => img.id));
    const [showRegression, setShowRegression] = useState<boolean>(true);
    const [logScaleX, setLogScaleX] = useState<boolean>(false);
    const [logScaleY, setLogScaleY] = useState<boolean>(false);

    // Derived State
    const isAllSelected = selectedImages.length === IMAGES.length;

    // Derived Data: Regression Line
    const regressionData = useMemo(() => {
        if (!showRegression || CORRELATION_DATA.length < 2) return [];

        const n = CORRELATION_DATA.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        CORRELATION_DATA.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumXX += p.x * p.x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const minX = Math.min(...CORRELATION_DATA.map(p => p.x));
        const maxX = Math.max(...CORRELATION_DATA.map(p => p.x));

        // Generate multiple points for smoother curve on log scales
        const points = [];
        const steps = 20;
        const stepSize = (maxX - minX) / steps;

        for (let i = 0; i <= steps; i++) {
            const x = minX + i * stepSize;
            const y = slope * x + intercept;
            // Only add points with positive coordinates if using log scale might handle checks,
            // but our mock data is positive.
            points.push({ x, y });
        }

        return points;
    }, [showRegression]);

    // Handlers
    const toggleImage = (id: string) => {
        if (selectedImages.includes(id)) {
            setSelectedImages(selectedImages.filter(imgId => imgId !== id));
        } else {
            setSelectedImages([...selectedImages, id]);
        }
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedImages([]);
        } else {
            setSelectedImages(IMAGES.map(img => img.id));
        }
    };

    // Shared Image List Component
    const ImageList = ({ vertical = false }: { vertical?: boolean }) => (
        <div className={`grid gap-3 ${vertical ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'}`}>
            {IMAGES.map(img => {
                const isSelected = selectedImages.includes(img.id);
                return (
                    <div
                        key={img.id}
                        onClick={() => toggleImage(img.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected
                            ? 'bg-primary/5 border-primary/20'
                            : 'hover:bg-muted border-border'
                            }`}
                    >
                        <div className={`shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate text-foreground">{img.id}</div>
                            <div className="text-xs text-muted-foreground flex justify-between mt-1">
                                <span>{img.status}</span>
                                {img.count > 0 && <span>{img.count}</span>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header Area - Always visible */}
            <div className="flex justify-between items-center shrink-0 p-1 mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Correlation Analysis: {taskId || 'Unknown Task'}</h2>
                    <p className="text-muted-foreground">Analyze relationships between particle attributes.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-lg hover:bg-primary/90 font-medium text-sm">
                        <FilePlus size={16} />
                        Add Current to Report
                    </button>
                </div>
            </div>

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
                    <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 min-w-[176px]">
                        <h3 className="font-semibold flex items-center gap-2 text-sm">
                            <Layers size={16} />
                            Select Images
                        </h3>
                        <button
                            onClick={toggleSelectAll}
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            {isAllSelected ? 'None' : 'All'}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 min-w-[176px]">
                        <ImageList vertical={true} />
                    </div>
                </motion.div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto flex flex-col pr-1 pb-1">

                    {/* Expanded Sidebar Mode: Top Panel for Images */}
                    <motion.div
                        initial={false}
                        animate={{
                            height: isCollapsed ? 0 : 250,
                            opacity: isCollapsed ? 0 : 1,
                            marginBottom: isCollapsed ? 0 : 24
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden shrink-0"
                    >
                        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                            <h3 className="font-semibold flex items-center gap-2 text-sm">
                                <Layers size={16} />
                                Select Images
                            </h3>
                            <button
                                onClick={toggleSelectAll}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                {isAllSelected ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <ImageList />
                        </div>
                    </motion.div>

                    {/* Top Section: Visualization & Settings */}
                    <div className="flex-1 min-h-[450px] grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Visual Panel (Left - 2/3) */}
                        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col h-full min-h-[400px]">
                            <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
                                <span>{xAttribute} vs. {yAttribute}</span>
                                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                                    {selectedImages.length} Images Selected
                                </span>
                            </h3>
                            <div className="flex-1 w-full min-h-0">
                                {selectedImages.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                            <XAxis
                                                type="number"
                                                dataKey="x"
                                                name={xAttribute}
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                scale={logScaleX ? 'log' : 'auto'}
                                                domain={['auto', 'auto']}
                                                allowDataOverflow={true}
                                                label={{ value: xAttribute, position: 'insideBottom', offset: -10, fontSize: 12, fill: '#666' }}
                                            />
                                            <YAxis
                                                type="number"
                                                dataKey="y"
                                                name={yAttribute}
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                scale={logScaleY ? 'log' : 'auto'}
                                                domain={['auto', 'auto']}
                                                allowDataOverflow={true}
                                                label={{ value: yAttribute, angle: -90, position: 'insideLeft', fill: '#666' }}
                                            />
                                            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                            <Scatter name="Particles" data={CORRELATION_DATA} fill="hsl(var(--primary))" />
                                            {showRegression && (
                                                <Scatter
                                                    name="Regression Line"
                                                    data={regressionData}
                                                    line={{ stroke: '#ef4444', strokeWidth: 2 }}
                                                    shape={false}
                                                    legendType="line"
                                                />
                                            )}
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        Select images to view correlation
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Settings Panel (Right - 1/3) */}
                        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-6 text-foreground">
                                <Settings size={18} />
                                <h3 className="font-semibold">Correlation Settings</h3>
                            </div>

                            <div className="space-y-6">
                                {/* X-Axis Attribute Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">X-Axis Attribute</label>
                                    <select
                                        value={xAttribute}
                                        onChange={(e) => setXAttribute(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {ATTRIBUTES.map(attr => (
                                            <option key={attr} value={attr}>{attr}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Y-Axis Attribute Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Y-Axis Attribute</label>
                                    <select
                                        value={yAttribute}
                                        onChange={(e) => setYAttribute(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {ATTRIBUTES.map(attr => (
                                            <option key={attr} value={attr}>{attr}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Visual Options */}
                                <div className="space-y-3 pt-4 border-t border-border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground">Show Regression Line</span>
                                        <div
                                            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${showRegression ? 'bg-primary' : 'bg-muted'}`}
                                            onClick={() => setShowRegression(!showRegression)}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-background rounded-full shadow-sm transition-all ${showRegression ? 'left-[18px]' : 'left-0.5'}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground">Log Scale (X)</span>
                                        <div
                                            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${logScaleX ? 'bg-primary' : 'bg-muted'}`}
                                            onClick={() => setLogScaleX(!logScaleX)}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-background rounded-full shadow-sm transition-all ${logScaleX ? 'left-[18px]' : 'left-0.5'}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground">Log Scale (Y)</span>
                                        <div
                                            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${logScaleY ? 'bg-primary' : 'bg-muted'}`}
                                            onClick={() => setLogScaleY(!logScaleY)}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-background rounded-full shadow-sm transition-all ${logScaleY ? 'left-[18px]' : 'left-0.5'}`} />
                                        </div>
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
