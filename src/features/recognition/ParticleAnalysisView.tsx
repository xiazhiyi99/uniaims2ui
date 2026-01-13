import { useState } from 'react';
import { ZoomIn, ZoomOut, Eye, ChevronLeft, ChevronRight, Grid, Info, Ruler, Sliders, Palette, Circle, SquarePlus, Trash2 } from 'lucide-react';
import { InteractiveCanvas } from './InteractiveCanvas';
import { SidePanelSection } from '../../components/SidePanel';

const MOCK_IMAGES = [
    { id: 1, name: 'Img_001.tif', status: 'processed' },
    { id: 2, name: 'Img_002.tif', status: 'processed' },
    { id: 3, name: 'Img_003.tif', status: 'processing' },
    { id: 4, name: 'Img_004.tif', status: 'pending' },
    { id: 5, name: 'Img_005.tif', status: 'pending' },
];

export const ParticleAnalysisView = () => {
    const [activePanel, setActivePanel] = useState<string | null>('image-info');

    // Mock State for Scale Bar Panel
    const [scaleValue, setScaleValue] = useState(500);
    const [scaleUnit, setScaleUnit] = useState('μm');
    const [scalePixels, setScalePixels] = useState(200);

    // Mock State for Visual Settings
    const [scaleColor, setScaleColor] = useState('#ffffff');
    const [particleColor, setParticleColor] = useState('#22c55e');

    const togglePanel = (panel: string) => {
        setActivePanel(activePanel === panel ? null : panel);
    };

    const isScaleBarMode = activePanel === 'scale-bar';

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                <div className="flex-1 flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden relative">
                    {/* Toolbar */}
                    <div className="h-12 border-b border-border flex items-center px-4 justify-between bg-muted/30 shrink-0">
                        {isScaleBarMode ? (
                            <div className="flex items-center gap-2 animate-in fade-in duration-300">
                                <span className="text-xs font-bold bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded border border-yellow-500/20 mr-2 flex items-center gap-1">
                                    <Ruler size={12} /> Scale Bar Mode
                                </span>
                                <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors shadow-sm">
                                    Auto Detect
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-border text-xs font-medium rounded hover:bg-muted transition-colors">
                                    Manual Select
                                </button>
                                <div className="h-4 w-px bg-border mx-1" />
                                <button className="p-2 hover:bg-muted rounded-md text-muted-foreground" title="Reset">
                                    <ZoomOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 animate-in fade-in duration-300">
                                <button className="p-2 hover:bg-muted rounded-md" title="Zoom In"><ZoomIn size={18} /></button>
                                <button className="p-2 hover:bg-muted rounded-md" title="Zoom Out"><ZoomOut size={18} /></button>
                                <div className="h-4 w-px bg-border mx-1" />
                                <button className="p-2 hover:bg-muted rounded-md" title="Add Polygon"><SquarePlus size={18} /></button>
                                <button className="p-2 hover:bg-muted rounded-md text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete Polygon"><Trash2 size={18} /></button>
                                <div className="h-4 w-px bg-border mx-1" />
                                <button className="p-2 hover:bg-muted rounded-md text-primary" title="Show Overlay"><Eye size={18} /></button>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-muted rounded"><ChevronLeft size={16} /></button>
                            <span className="text-xs font-mono text-muted-foreground">Image 1 / 5</span>
                            <button className="p-1 hover:bg-muted rounded"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 relative bg-neutral-900 overflow-hidden">
                        <InteractiveCanvas overlayMode={isScaleBarMode ? 'scalebar' : 'default'} />
                    </div>
                </div>

                <div className="w-80 flex flex-col gap-4 overflow-hidden">
                    {/* Image Strip / Navigation (Keep this separate or integrate? Assuming keep separate at top for navigation) */}
                    <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col shrink-0 max-h-[25%] min-h-[150px]">
                        <h3 className="font-semibold flex items-center gap-2 mb-3 text-sm">
                            <Grid size={16} className="text-primary" />
                            Task Images (5)
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
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

                    {/* Accordion Panels Component */}
                    <div className="bg-card rounded-xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">

                        {/* 1. Image Info */}
                        <SidePanelSection
                            title="Image Info"
                            icon={<Info size={16} />}
                            isOpen={activePanel === 'image-info'}
                            onToggle={() => togglePanel('image-info')}
                        >
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-medium text-right truncate" title="Img_001.tif">Img_001.tif</span>

                                <span className="text-muted-foreground">Dimensions:</span>
                                <span className="font-medium text-right">1024 x 768 px</span>

                                <span className="text-muted-foreground">Detected Count:</span>
                                <span className="font-medium text-right">245</span>

                                <span className="text-muted-foreground">Mag:</span>
                                <span className="font-medium text-right">5000x</span>
                            </div>
                        </SidePanelSection>

                        {/* 2. Scale Bar Settings */}
                        <SidePanelSection
                            title="Scale Bar"
                            icon={<Ruler size={16} />}
                            isOpen={activePanel === 'scale-bar'}
                            onToggle={() => togglePanel('scale-bar')}
                        >
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Value</label>
                                    <input
                                        type="number"
                                        value={scaleValue}
                                        onChange={(e) => setScaleValue(Number(e.target.value))}
                                        className="w-full bg-muted/40 border border-border rounded px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Unit</label>
                                    <input
                                        type="text"
                                        value={scaleUnit}
                                        onChange={(e) => setScaleUnit(e.target.value)}
                                        className="w-full bg-muted/40 border border-border rounded px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Length (px)</label>
                                    <input
                                        type="number"
                                        value={scalePixels}
                                        onChange={(e) => setScalePixels(Number(e.target.value))}
                                        className="w-full bg-muted/40 border border-border rounded px-2 py-1.5 text-sm"
                                    />
                                </div>
                            </div>
                        </SidePanelSection>

                        {/* 3. Single Particle Info */}
                        <SidePanelSection
                            title="Single Particle"
                            icon={<Circle size={16} />}
                            isOpen={activePanel === 'single-particle'}
                            onToggle={() => togglePanel('single-particle')}
                        >
                            <div className="p-2 border border-border/50 rounded bg-muted/20 text-center text-muted-foreground italic text-xs mb-2">
                                Select a particle to view details
                            </div>
                            {/* Mock Data for selection */}
                            <div className="grid grid-cols-2 gap-y-2 text-xs opacity-50">
                                <span className="text-muted-foreground">ID:</span>
                                <span className="text-right font-mono">--</span>
                                <span className="text-muted-foreground">Aspect Ratio:</span>
                                <span className="text-right font-mono">--</span>
                                <span className="text-muted-foreground">Perimeter:</span>
                                <span className="text-right font-mono">--</span>
                                <span className="text-muted-foreground">Area:</span>
                                <span className="text-right font-mono">--</span>
                            </div>
                        </SidePanelSection>

                        {/* 4. Filter Settings */}
                        <SidePanelSection
                            title="Filter Settings"
                            icon={<Sliders size={16} />}
                            isOpen={activePanel === 'filters'}
                            onToggle={() => togglePanel('filters')}
                        >
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                                    <span>Keep Edge Particles</span>
                                </label>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Area Range</span>
                                        <span className="font-mono">10 - 5000</span>
                                    </div>
                                    <input type="range" className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Circularity</span>
                                        <span className="font-mono">0.5 - 1.0</span>
                                    </div>
                                    <input type="range" className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" />
                                </div>
                            </div>
                        </SidePanelSection>

                        {/* 5. Visualization Settings */}
                        <SidePanelSection
                            title="Visualization"
                            icon={<Palette size={16} />}
                            isOpen={activePanel === 'visualization'}
                            onToggle={() => togglePanel('visualization')}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Scale Bar Color</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded border border-border shadow-sm" style={{ backgroundColor: scaleColor }} />
                                        <input type="color" value={scaleColor} onChange={(e) => setScaleColor(e.target.value)} className="w-8 h-8 opacity-0 absolute cursor-pointer" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Particle Color</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded border border-border shadow-sm" style={{ backgroundColor: particleColor }} />
                                        <input type="color" value={particleColor} onChange={(e) => setParticleColor(e.target.value)} className="w-8 h-8 opacity-0 absolute cursor-pointer" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Opacity</span>
                                        <span className="font-mono">80%</span>
                                    </div>
                                    <input type="range" className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary" defaultValue={80} />
                                </div>
                            </div>
                        </SidePanelSection>

                    </div>
                </div>
            </div>
        </div>
    );
};
