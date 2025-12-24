import { BarChart3, Download, List } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const AGGREGATED_STATS = [
    { range: '0-2µm', count: 450 },
    { range: '2-4µm', count: 1250 },
    { range: '4-6µm', count: 820 },
    { range: '6-8µm', count: 350 },
    { range: '8-10µm', count: 180 },
    { range: '>10µm', count: 90 },
];

const IMAGE_BREAKDOWN = [
    { id: 'Img_001.tif', count: 245, avgSize: 4.2, status: 'Completed' },
    { id: 'Img_002.tif', count: 312, avgSize: 3.8, status: 'Completed' },
    { id: 'Img_003.tif', count: 156, avgSize: 4.5, status: 'Completed' },
    { id: 'Img_004.tif', count: 0, avgSize: 0, status: 'Pending' },
    { id: 'Img_005.tif', count: 0, avgSize: 0, status: 'Pending' },
];

export const AnalysisHubView = () => {
    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Task Analysis: Batch #42</h2>
                    <p className="text-muted-foreground">Aggregated results across 5 images.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted font-medium text-sm">
                        <Download size={16} />
                        Export All
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90">
                        <BarChart3 size={16} />
                        Task Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                {/* Aggregated Chart */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
                        <span>Global Size Distribution</span>
                        <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">Avg of 3 Processed Images</span>
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={AGGREGATED_STATS}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                                <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Aggregated Stats */}
                <div className="space-y-4">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Particles</h4>
                        <div className="mt-2 text-4xl font-bold">3,140</div>
                        <div className="text-xs text-muted-foreground mt-2">Across 3/5 Images</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Global Avg Diameter</h4>
                        <div className="mt-2 text-3xl font-bold">4.10 µm</div>
                        <div className="text-xs text-green-500 font-medium mt-1">Within Tolerance</div>
                    </div>
                </div>
            </div>

            {/* Image Breakdown */}
            <div className="flex-1 bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <List size={20} />
                        Image Breakdown
                    </h3>
                    <div className="flex gap-2 text-sm">
                        <button className="px-3 py-1 bg-muted rounded-md text-foreground font-medium">Table</button>
                        <button className="px-3 py-1 text-muted-foreground hover:bg-muted/50 rounded-md">Grid</button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Image Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Particle Count</th>
                                <th className="px-6 py-3">Avg Size (µm)</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {IMAGE_BREAKDOWN.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-3 font-medium">{item.id}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.status === 'Completed'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">{item.count}</td>
                                    <td className="px-6 py-3">{item.avgSize || '-'}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button className="text-primary hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
