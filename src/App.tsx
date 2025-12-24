import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './layouts/MainLayout';
import { DashboardView } from './features/dashboard/DashboardView';
import { UploadView } from './features/dashboard/UploadView';
import { ParticleAnalysisView } from './features/recognition/ParticleAnalysisView';
import { FiberAnalysisView } from './features/recognition/FiberAnalysisView';
import { AnalysisHubView } from './features/analysis/AnalysisHubView';
import { FineTuningView } from './features/finetuning/FineTuningView';
import { ReportsView } from './features/reports/ReportsView';
import { GlobalFooter } from './components/GlobalFooter';
import { GlobalHeader } from './components/GlobalHeader';

const AnimatedRoutes = () => {
  const location = useLocation();

  // Group all workstation routes under a single key to prevent re-animation 
  // when switching between them (e.g. Analysis -> Reports).
  // Only animate when switching between "Dashboard" context and "Workstation" context.
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/' || location.pathname === '/upload';
  const animationKey = isDashboard ? 'dashboard' : 'workstation';

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Routes location={location} key={animationKey}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/upload" element={<UploadView />} />

        {/* Workspace Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/particles" element={<ParticleAnalysisView />} />
          <Route path="/fibers" element={<FiberAnalysisView />} />
          <Route path="/analysis" element={<AnalysisHubView />} />
          <Route path="/finetune" element={<FineTuningView />} />
          <Route path="/reports" element={<ReportsView />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <GlobalHeader />
      <AnimatedRoutes />
      <GlobalFooter />
    </BrowserRouter>
  );
}

export default App;
