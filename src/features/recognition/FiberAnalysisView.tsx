import { ZoomIn, ZoomOut, Eye, Activity } from 'lucide-react';
// import { InteractiveCanvas } from './InteractiveCanvas'; // Reuse for now, can be specialized later

export const FiberAnalysisView = () => {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
                    {/* Toolbar - Specialized for Fibers */}
                    <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-muted/30 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider mr-2">Fiber Mode</span>
                            <div className="h-4 w-px bg-border mx-1" />
                            <button className="p-2 hover:bg-muted rounded-md" title="Zoom In"><ZoomIn size={18} /></button>
                            <button className="p-2 hover:bg-muted rounded-md" title="Zoom Out"><ZoomOut size={18} /></button>
                            <button className="p-2 hover:bg-muted rounded-md text-primary" title="Show Overlay"><Eye size={18} /></button>
                        </div>
                    </div>
                    <div className="flex-1 relative bg-neutral-900 overflow-hidden flex items-center justify-center text-neutral-500">
                        <p>Fiber Identification Canvas (Placeholder)</p>
                        {/* In real app, reuse InteractiveCanvas with 'fiber' prop */}
                    </div>
                </div>
                <div className="w-80 flex flex-col gap-4 overflow-hidden">
                    <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex-1 flex flex-col">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Activity size={18} className="text-primary" />
                            Fiber Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                <div className="text-xs text-muted-foreground mb-1">Total Length</div>
                                <div className="text-2xl font-mono font-bold">4.2 mm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
