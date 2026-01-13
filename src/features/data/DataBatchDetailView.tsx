import { useParams, Outlet } from 'react-router-dom';
import { BATCH_DETAILS } from './mockData';

export const DataBatchDetailView = () => {
    const { batchId } = useParams();

    return (
        <div className="h-full flex flex-col font-sans text-foreground animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto w-full space-y-6 flex flex-col h-full">
                {/* Header Info */}
                <div className="shrink-0 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Data Board</span>
                        <span className="text-muted-foreground/50">/</span>
                        <span>{batchId}</span>
                    </div>
                    <h1 className="text-2xl font-bold">{BATCH_DETAILS.name}</h1>
                </div>

                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};


