import { useState } from 'react';
import { FileText, User, Calendar, Save } from 'lucide-react';
import { BATCH_DETAILS } from './mockData';

export const DataBatchOverview = () => {
    const [batchName, setBatchName] = useState(BATCH_DETAILS.name);
    const [description, setDescription] = useState(BATCH_DETAILS.description);

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-300 h-full overflow-y-auto pb-6 custom-scrollbar">
            <div className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    Batch Information
                </h3>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Batch Name</label>
                        <input
                            type="text"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Uploaded By</label>
                        <div className="flex items-center gap-2 text-sm px-3 py-2 bg-muted/30 rounded-lg border border-transparent">
                            <User size={14} /> {BATCH_DETAILS.uploader}
                        </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Upload Date</label>
                        <div className="flex items-center gap-2 text-sm px-3 py-2 bg-muted/30 rounded-lg">
                            <Calendar size={14} /> {BATCH_DETAILS.uploadDate}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {BATCH_DETAILS.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20">
                                    #{tag}
                                </span>
                            ))}
                            <button className="px-2 py-1 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                                + Add Tag
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <h4 className="font-semibold text-red-600 mb-2">Danger Zone</h4>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Permanently delete this data batch and all associated files.</p>
                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                        Delete Batch
                    </button>
                </div>
            </div>
        </div>
    );
};
