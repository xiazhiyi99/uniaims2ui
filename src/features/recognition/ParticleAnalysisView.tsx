import { Layers, ZoomIn, ZoomOut, Eye, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { InteractiveCanvas } from './InteractiveCanvas';

const MOCK_IMAGES = [
    { id: 1, name: 'Img_001.tif', status: 'processed' },
    { id: 2, name: 'Img_002.tif', status: 'processed' },
    { id: 3, name: 'Img_003.tif', status: 'processing' },
    { id: 4, name: 'Img_004.tif', status: 'pending' },
    { id: 5, name: 'Img_005.tif', status: 'pending' },
];

export const ParticleAnalysisView = () => {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
                    {/* Toolbar */}
                    <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-muted/30 shrink-0">
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-muted rounded-md" title="Zoom In"><ZoomIn size={18} /></button>
                            <button className="p-2 hover:bg-muted rounded-md" title="Zoom Out"><ZoomOut size={18} /></button>
                            <div className="h-4 w-px bg-border mx-1" />
                            <button className="p-2 hover:bg-muted rounded-md text-primary" title="Show Overlay"><Eye size={18} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-muted rounded"><ChevronLeft size={16} /></button>
                            <span className="text-xs font-mono text-muted-foreground">Image 1 / 5</span>
                            <button className="p-1 hover:bg-muted rounded"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 relative bg-neutral-900 overflow-hidden">
                        <InteractiveCanvas />
                    </div>
                </div>

                <div className="w-80 flex flex-col gap-4 overflow-hidden">
                    {/* Image Strip / Navigation */}
                    <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col shrink-0 max-h-[40%]">
                        <h3 className="font-semibold flex items-center gap-2 mb-3 text-sm">
                            <Grid size={16} className="text-primary" />
                            Task Images (5)
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {MOCK_IMAGES.map(img => (
                                <div key={img.id} className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer text-sm transition-colors ${img.id === 1 ? 'bg-primary/5 border-primary' : 'hover:bg-muted border-transparent'}`}>
                                    <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center shrink-0">
                                        <span className="text-[10px] text-neutral-500">THUMB</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{img.name}</div>
                                        <div className="text-xs text-muted-foreground capitalize">{img.status}</div>
                                    </div>
                                    {img.status === 'processed' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex-1 flex flex-col">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Layers size={18} className="text-primary" />
                            Detection Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className="text-xs text-muted-foreground mb-1">Current Image Count</div>
                                <div className="text-2xl font-mono font-bold">245</div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-border">
                                <label className="text-sm font-medium">Sensitivity</label>
                                <input type="range" className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
