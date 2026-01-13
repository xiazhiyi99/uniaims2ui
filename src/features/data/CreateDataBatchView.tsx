import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileImage, X, Database, Plus } from 'lucide-react';


export const CreateDataBatchView = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Mock submission
        console.log('Creating batch:', { title, description, files });
        // Navigate back to data board (mock ID)
        navigate('/data/DB-NEW-001/overview');
    };

    return (
        <div className="min-h-screen pb-20 flex flex-col max-w-5xl mx-auto py-8 pt-24 animate-in fade-in duration-500">
            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/dashboard?tab=data')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Data Board
                </button>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create Data Batch</h1>
                <p className="text-muted-foreground text-lg">Upload images to create a new dataset for future analysis and training.</p>
            </div>

            <div className="flex flex-col gap-8">
                {/* Upload Area */}
                <div className="w-full">
                    <div
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className={`
                            border-2 border-dashed rounded-2xl p-10 relative overflow-hidden transition-all cursor-pointer group
                            ${files.length > 0 ? 'border-primary/50 bg-primary/5' : 'border-primary/20 hover:border-primary/50 bg-card hover:bg-muted/30'}
                        `}
                    >
                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                }
                            }}
                        />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Upload size={40} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold">Upload Images</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Drag & drop your files here, or click to select. Supports PNG, JPG, TIF, BMP.
                                </p>
                            </div>
                            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                <Plus size={20} />
                                Select Files
                            </button>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {files.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-card border border-border/60 rounded-xl group hover:border-primary/30 transition-colors shadow-sm">
                                    <div className="bg-muted/50 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-border/50">
                                        <FileImage size={20} className="text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Configuration Card */}
                <div className="bg-card border border-border/60 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Batch Configuration</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Batch Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Summer Sample Set B"
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional details about this batch..."
                                    rows={3}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-48 flex-shrink-0 flex items-end">
                            <button
                                onClick={handleSubmit}
                                disabled={!title || files.length === 0}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 shadow-lg shadow-primary/25 h-full max-h-[140px]"
                            >
                                <Database size={24} />
                                <span className="text-lg">Create Batch</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
