
import { Outlet, useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { AnalysisHubView } from '../features/analysis/AnalysisHubView';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export const MainLayout = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const showAnalysis = searchParams.get('analysis') === 'true';

    const closeAnalysis = () => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('analysis');
            return newParams;
        });
    };

    return (
        <motion.div
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            exit={{ x: '100vw' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex h-screen w-screen overflow-hidden bg-background text-foreground absolute top-0 left-0"
        >
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-auto p-6 relative">
                <Outlet />

                {/* Analysis Overlay */}
                {showAnalysis && (
                    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 p-6 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-200">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={closeAnalysis}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <AnalysisHubView />
                        </div>
                    </div>
                )}
            </main>
        </motion.div>
    );
};

