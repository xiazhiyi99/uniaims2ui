import { useNavigate } from 'react-router-dom';
import { Activity, Layers, MoreVertical } from 'lucide-react';
import { BATCH_DETAILS } from './mockData';

export const DataBatchTasks = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-4 animate-in fade-in duration-300 h-full overflow-y-auto pb-6 custom-scrollbar">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Analysis & Training performed on this dataset</h3>
            <div className="grid gap-4">
                {BATCH_DETAILS.linkedTasks.map(task => (
                    <div
                        key={task.id}
                        onClick={() => navigate(task.type === 'training' ? '/finetune?tab=training' : `/${task.id}/${task.type}s`)}
                        className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 hover:shadow-md cursor-pointer transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.type === 'training' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {task.type === 'training' ? <Activity size={20} /> : <Layers size={20} />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{task.name}</h4>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span className="font-mono">{task.id}</span>
                                    <span>•</span>
                                    <span className="capitalize">{task.type}</span>
                                    <span>•</span>
                                    <span>{task.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                {task.status}
                            </span>
                            <MoreVertical size={16} className="text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
