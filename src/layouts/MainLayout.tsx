
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { motion } from 'framer-motion';

export const MainLayout = () => {

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
            </main>
        </motion.div>
    );
};

