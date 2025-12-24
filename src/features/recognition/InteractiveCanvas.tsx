import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    radius: number;
    selected?: boolean;
}

const MOCK_PARTICLES: Particle[] = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 800,
    y: Math.random() * 600,
    radius: Math.random() * 20 + 5,
}));

export const InteractiveCanvas = () => {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.01), 5);
            setScale(newScale);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - startPan.x,
            y: e.clientY - startPan.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-hidden bg-neutral-900 relative cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <motion.div
                className="absolute origin-top-left"
                style={{
                    x: offset.x,
                    y: offset.y,
                    scale: scale,
                }}
            >
                {/* Simulated Image */}
                <div className="w-[1024px] h-[768px] bg-neutral-800 relative shadow-2xl">
                    {/* Grid Pattern to show scale */}
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-4xl select-none pointer-events-none">
                        SEM IMAGE PLACEHOLDER
                    </div>

                    {/* Particles Overlay */}
                    {MOCK_PARTICLES.map(p => (
                        <div
                            key={p.id}
                            className="absolute rounded-full border-2 border-green-500/60 hover:border-green-400 hover:bg-green-500/10 cursor-pointer transition-colors"
                            style={{
                                left: p.x,
                                top: p.y,
                                width: p.radius * 2,
                                height: p.radius * 2,
                            }}
                            title={`Particle #${p.id}`}
                        />
                    ))}
                </div>
            </motion.div>

            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded font-mono pointer-events-none">
                Scale: {(scale * 100).toFixed(0)}%
            </div>
        </div>
    );
};
