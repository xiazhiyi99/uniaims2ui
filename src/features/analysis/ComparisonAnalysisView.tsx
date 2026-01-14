import { useState, useMemo } from 'react';
import { CheckSquare, Square, Layers, Settings, FilePlus } from 'lucide-react';
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

const IMAGES = [
    { id: 'Img_001.tif', status: 'Completed', count: 245 },
    { id: 'Img_002.tif', status: 'Completed', count: 312 },
    { id: 'Img_003.tif', status: 'Completed', count: 156 },
    { id: 'Img_004.tif', status: 'Pending', count: 0 },
    { id: 'Img_005.tif', status: 'Pending', count: 0 },
];

// Helper to generate mock density data
const generateViolinData = (id: string) => {
    // Randomize distribution characteristics
    const mean = 5 + Math.random() * 4; // 5-9
    const spread = 2 + Math.random() * 2; // 2-4

    // Create points for the "shape"
    // In a real app, this would be computed from actual data points using KDE
    return {
        id,
        mean,
        min: Math.max(0, mean - spread),
        max: mean + spread,
        // Mock density profile (0 to 1 values for width at each step)
        density: Array.from({ length: 20 }, (_, i) => {
            const x = i / 19; // 0 to 1
            // Bell curve approximation
            return Math.exp(-Math.pow((x - 0.5) * 4, 2));
        })
    };
};

const CustomViolinShape = (props: any) => {
    const { x, y, width, height, payload, fill } = props;

    if (!payload || !payload.density) return null;

    const { density } = payload;
    const centerX = x + width / 2;
    const maxHalfWidth = (width * 0.8) / 2; // Use 80% of slot width

    // Construct path
    // We map the 'density' index (0-19) to Y coordinates (bottom to top or top to bottom)
    // Recharts Y is 0 at top. height is downwards.
    // Let's assume the bar covers the full range of the violin.

    let leftPath = `M ${centerX} ${y + height}`;
    let rightPath = `M ${centerX} ${y + height}`;

    const stepY = height / (density.length - 1);

    density.forEach((d: number, i: number) => {
        const currY = y + height - (i * stepY); // mapping 0 index to bottom
        const w = d * maxHalfWidth;
        leftPath += ` L ${centerX - w} ${currY}`;
        rightPath += ` L ${centerX + w} ${currY}`;
    });

    leftPath += ` L ${centerX} ${y}`;
    rightPath += ` L ${centerX} ${y}`;

    return (
        <g>
            <path d={`${leftPath} ${rightPath.replace('M', 'L').substring(1)} Z`} fill={fill} stroke={fill} fillOpacity={0.6} />
            {/* Median Line marker */}
            <line x1={centerX - 10} y1={y + height / 2} x2={centerX + 10} y2={y + height / 2} stroke="white" strokeWidth={2} />
        </g>
    );
};

export const ComparisonAnalysisView = () => {
    const { taskId } = useParams();
    const { isCollapsed } = useSidebar();

    // State
    const [selectedAttribute, setSelectedAttribute] = useState<string>('Diameter');
    const [selectedImages, setSelectedImages] = useState<string[]>(IMAGES.map(img => img.id).slice(0, 3)); // Default select first 3
    const [logScale, setLogScale] = useState<boolean>(false);

    // Derived State
    const isAllSelected = selectedImages.length === IMAGES.length;

    // Derived Data
    const violinData = useMemo(() => {
        // Only generate for selected images
        return selectedImages.map(id => {
            // In a real app, calculate density based on `selectedAttribute` for this image
            const data = generateViolinData(id);
            // We need a value for the Bar to render a height. 
            // For a violin plot, we usually want to span the Y axis range.
            // Here we'll use a trick: passed 'density' data is the shape, but we lay it out on a conceptual Y range.
            // For simplicity in this "Wow" UI, we'll let the bar fill the vertical space? 
            // No, we need it to represent values.
            // Let's normalize: The Bar's 'value' determines its top Y. 
            // But a violin has a min and max. 
            // Recharts Bar chart starts at 0.
            // We can use [min, max] if we use a composed chart with error bars, but simpler:
            // Just assume the 'Bar' represents the Max value, and we draw inside it.
            return {
                ...data,
                // Bar value is 'max' so the bar box creates the canvas for our shape
                value: data.max
            };
        });
    }, [selectedImages, selectedAttribute]);

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
            <div className="flex justify-between items-center shrink-0 p-1 mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Comparison Analysis: {taskId || 'Unknown Task'}</h2>
                    <p className="text-muted-foreground">Compare attribute distributions across multiple images.</p>
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
                                <span>{selectedAttribute} Distribution Comparison</span>
                                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                                    {selectedImages.length} Images Selected
                                </span>
                            </h3>
                            <div className="flex-1 w-full min-h-0">
                                {selectedImages.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={violinData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                            <XAxis dataKey="id" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis
                                                label={{ value: selectedAttribute, angle: -90, position: 'insideLeft', fill: '#666' }}
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                scale={logScale ? 'log' : 'auto'}
                                                domain={['auto', 'auto']}
                                                allowDataOverflow={true}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-card border border-border rounded-lg p-3 shadow-md">
                                                                <p className="font-semibold mb-1">{data.id}</p>
                                                                <p className="text-xs text-muted-foreground">Mean: {data.mean.toFixed(2)}</p>
                                                                <p className="text-xs text-muted-foreground">Range: {data.min.toFixed(2)} - {data.max.toFixed(2)}</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            {/* Ghost Bar to set the scale? No, actual data */}
                                            {/* We use 'value' (max) as the bar height, but the shape draws the distribution */}
                                            <Bar dataKey="value" shape={<CustomViolinShape />} >
                                                {/* Use distinct colors for each violin? or same? */}
                                                {violinData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={`hsl(${210 + index * 30}, 70%, 50%)`} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        Select images to view comparison
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Settings Panel (Right - 1/3) */}
                        <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-6 text-foreground">
                                <Settings size={18} />
                                <h3 className="font-semibold">Comparison Settings</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Attribute Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Attribute to Compare</label>
                                    <select
                                        value={selectedAttribute}
                                        onChange={(e) => setSelectedAttribute(e.target.value)}
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
                                        <span className="text-sm font-medium text-foreground">Log Scale (Y)</span>
                                        <div
                                            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${logScale ? 'bg-primary' : 'bg-muted'}`}
                                            onClick={() => setLogScale(!logScale)}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-background rounded-full shadow-sm transition-all ${logScale ? 'left-[18px]' : 'left-0.5'}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">About Violin Plots</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Violin plots show the probability density of the data at different values, usually smoothed by a kernel density estimator.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
