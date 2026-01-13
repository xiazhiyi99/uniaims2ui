import { useState, useMemo } from 'react';
import { CheckSquare, Square, Layers, Settings, Sliders, FilePlus, Files } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
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

const MOCK_HISTOGRAM_DATA: Record<string, { range: string, count: number }[]> = {
    'default': [
        { range: '0-2', count: 450 },
        { range: '2-4', count: 1250 },
        { range: '4-6', count: 820 },
        { range: '6-8', count: 350 },
        { range: '8-10', count: 180 },
        { range: '>10', count: 90 },
    ]
};

export const AttributeAnalysisView = () => {
    const { taskId } = useParams();

    // State
    const [selectedAttribute, setSelectedAttribute] = useState<string>('Diameter');
    const [selectedImages, setSelectedImages] = useState<string[]>(IMAGES.map(img => img.id));

    // Chart Settings State
    const [yAxisMode, setYAxisMode] = useState<'count' | 'percentage'>('count');
    const [chartType, setChartType] = useState<'histogram' | 'violin'>('histogram');
    const [xSettings, setXSettings] = useState({ start: 0, end: 12, binSize: 2 });

    // Derived State
    const isAllSelected = selectedImages.length === IMAGES.length;

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

    // Memoized Chart Data with Cumulative Calculation
    const chartData = useMemo(() => {
        const baseData = MOCK_HISTOGRAM_DATA['default'].map(item => ({
            ...item,
            count: Math.floor(item.count * (0.8 + Math.random() * 0.4))
        }));

        const totalCount = baseData.reduce((sum, item) => sum + item.count, 0);
        let accumulated = 0;

        return baseData.map(item => {
            accumulated += item.count;
            return {
                ...item,
                percentage: (item.count / totalCount) * 100,
                cumulative: (accumulated / totalCount) * 100
            };
        });
    }, [selectedAttribute, selectedImages]); // Re-generate on change

    return (
        <div className="h-full flex flex-col gap-6 overflow-y-auto p-1">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Attribute Analysis: {taskId || 'Unknown Task'}</h2>
                    <p className="text-muted-foreground">Detailed breakdown of particle statistics.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted font-medium text-sm">
                        <FilePlus size={16} />
                        Add Current to Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-lg hover:bg-primary/90 font-medium text-sm">
                        <Files size={16} />
                        Add All to Report
                    </button>
                </div>
            </div>

            {/* Top Section: Histogram & Settings (Grid Layout for alignment) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0 min-h-[350px]">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col min-h-[300px]">
                    <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
                        <span>{selectedAttribute} Distribution</span>
                        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                            {selectedImages.length} Images Selected
                        </span>
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        {selectedImages.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                                    <XAxis
                                        dataKey="range"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: selectedAttribute, position: 'insideBottom', offset: -5, fontSize: 12, fill: '#666' }}
                                    />
                                    {/* Left Y Axis: Count or Percentage */}
                                    <YAxis
                                        yAxisId="left"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: yAxisMode === 'count' ? 'Count' : 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#666' }}
                                    />
                                    {/* Right Y Axis: Cumulative Percentage */}
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                        label={{ value: 'Cumulative (%)', angle: 90, position: 'insideRight', fill: '#8884d8' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />

                                    <Bar
                                        yAxisId="left"
                                        dataKey={yAxisMode === 'count' ? 'count' : 'percentage'}
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                        name={yAxisMode === 'count' ? 'Count' : 'Percentage'}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="cumulative"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        name="Cumulative %"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                Select images to view data
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Panel */}
                <div className="flex-1 bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-foreground">
                        <Settings size={18} />
                        <h3 className="font-semibold">Chart Settings</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Y-Axis Mode */}
                        <div className="space-y-3">

                            <div className="flex bg-muted p-1 rounded-lg">
                                <button
                                    onClick={() => setYAxisMode('count')}
                                    className={`flex-1 text-xs py-2 rounded-md transition-all font-medium ${yAxisMode === 'count' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Count
                                </button>
                                <button
                                    onClick={() => setYAxisMode('percentage')}
                                    className={`flex-1 text-xs py-2 rounded-md transition-all font-medium ${yAxisMode === 'percentage' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Percentage
                                </button>
                            </div>
                        </div>

                        {/* Chart Type */}
                        <div className="space-y-3">

                            <div className="flex bg-muted p-1 rounded-lg">
                                <button
                                    onClick={() => setChartType('histogram')}
                                    className={`flex-1 text-xs py-2 rounded-md transition-all font-medium ${chartType === 'histogram' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Histogram
                                </button>
                                <button
                                    onClick={() => setChartType('violin')}
                                    className={`flex-1 text-xs py-2 rounded-md transition-all font-medium ${chartType === 'violin' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Violin
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4"></div>

                        {/* X-Axis Settings */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                <Sliders size={16} />
                                <span>X-Axis Range</span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground">Start</label>
                                    <input
                                        type="number"
                                        value={xSettings.start}
                                        onChange={(e) => setXSettings({ ...xSettings, start: Number(e.target.value) })}
                                        className="w-full px-2 py-1.5 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground">End</label>
                                    <input
                                        type="number"
                                        value={xSettings.end}
                                        onChange={(e) => setXSettings({ ...xSettings, end: Number(e.target.value) })}
                                        className="w-full px-2 py-1.5 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs text-muted-foreground">Bin</label>
                                    <input
                                        type="number"
                                        value={xSettings.binSize}
                                        step="0.1"
                                        onChange={(e) => setXSettings({ ...xSettings, binSize: Number(e.target.value) })}
                                        className="w-full px-2 py-1.5 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Stats & Attributes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[250px] shrink-0">
                {/* Left Column: Statistics Panel */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm overflow-hidden">
                    <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Statistics</h3>
                    <div className="space-y-4 h-full overflow-y-auto">
                        <div className="grid grid-cols-5 gap-4">
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Particle Count</div>
                                <div className="text-xl font-bold">3,140</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Mean</div>
                                <div className="text-xl font-bold">4.10</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Std Dev</div>
                                <div className="text-xl font-bold">1.25</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Maximum</div>
                                <div className="text-xl font-bold">12.5</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Minimum</div>
                                <div className="text-xl font-bold">0.8</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">P0</div>
                                <div className="text-lg font-medium">0.80</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">P10</div>
                                <div className="text-lg font-medium">2.10</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">P50</div>
                                <div className="text-lg font-medium">3.95</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">P90</div>
                                <div className="text-lg font-medium">6.80</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">P100</div>
                                <div className="text-lg font-medium">12.50</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Attribute Selection */}
                <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden h-full">
                    <div className="p-4 border-b border-border bg-muted/20">
                        <h3 className="font-semibold text-sm">Select Attribute</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {ATTRIBUTES.map(attr => (
                            <button
                                key={attr}
                                onClick={() => setSelectedAttribute(attr)}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${selectedAttribute === attr
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'hover:bg-muted text-foreground'
                                    }`}
                            >
                                <div className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${selectedAttribute === attr ? 'border-primary-foreground/50' : 'border-muted-foreground'
                                    }`}>
                                    {selectedAttribute === attr && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <span className="text-sm font-medium">{attr}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Image Selection */}
            <div className="flex-1 min-h-[250px] bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden shrink-0">
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                </div>
            </div>
        </div>
    );
};
