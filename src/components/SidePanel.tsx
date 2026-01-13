import { type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';


interface SidePanelProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
}

export const SidePanelSection = ({ title, icon, children, isOpen, onToggle }: SidePanelProps) => (
    <div className={`border-b border-border/50 last:border-0 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'flex-1 min-h-0' : 'shrink-0'}`}>
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors text-sm font-medium shrink-0"
        >
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                {icon}
                <span className="text-foreground">{title}</span>
            </div>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {isOpen && (
            <div className="flex-1 overflow-y-auto p-3 pt-0 text-sm space-y-3 custom-scrollbar animate-in fade-in duration-300">
                {children}
            </div>
        )}
    </div>
);
