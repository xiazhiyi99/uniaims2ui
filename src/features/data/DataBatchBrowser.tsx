import { Search, Trash2, Plus, FileImage } from 'lucide-react';
import { BATCH_DETAILS } from './mockData';

export const DataBatchBrowser = () => {
    return (
        <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <input
                        type="text"
                        placeholder="Search files..."
                        className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                        <Trash2 size={14} /> Delete Selected
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                        <Plus size={16} /> Upload Files
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto pb-4 custom-scrollbar">
                {BATCH_DETAILS.images.map((img) => (
                    <div key={img.id} className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer relative">
                        <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center relative">
                            <FileImage className="text-neutral-300" size={32} />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                            </div>
                        </div>
                        <div className="p-2 border-t border-border">
                            <div className="text-xs font-medium truncate" title={img.name}>{img.name}</div>
                            <div className="text-[10px] text-muted-foreground flex justify-between mt-1">
                                <span>{img.size}</span>
                                <span>{img.date.split(' ')[0]}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
