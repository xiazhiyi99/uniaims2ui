import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './layouts/MainLayout';
import { DashboardView } from './features/dashboard/DashboardView';
import { UploadView } from './features/dashboard/UploadView';
import { ParticleAnalysisView } from './features/recognition/ParticleAnalysisView';
import { FiberAnalysisView } from './features/recognition/FiberAnalysisView';
// import { AnalysisHubView } from './features/analysis/AnalysisHubView';
import { FineTuningView } from './features/finetuning/FineTuningView';
import { ReportsView } from './features/reports/ReportsView';
import { GlobalFooter } from './components/GlobalFooter';
import { GlobalHeader } from './components/GlobalHeader';
import { DataBatchDetailView } from './features/data/DataBatchDetailView';
import { DataBatchOverview } from './features/data/DataBatchOverview';
import { DataBatchBrowser } from './features/data/DataBatchBrowser';
import { DataBatchTasks } from './features/data/DataBatchTasks';
import { CreateDataBatchView } from './features/data/CreateDataBatchView';
import { AttributeAnalysisView } from './features/analysis/AttributeAnalysisView';
import { CorrelationAnalysisView } from './features/analysis/CorrelationAnalysisView';
import { ComparisonAnalysisView } from './features/analysis/ComparisonAnalysisView';
import { TaskComparisonView } from './features/analysis/TaskComparisonView';

import { DocsView } from './features/docs/DocsView';


const AnimatedRoutes = () => {
  const location = useLocation();

  // Group all workstation routes under a single key to prevent re-animation 
  // when switching between them (e.g. Analysis -> Reports).
  // Only animate when switching between "Dashboard" context and "Workstation" context.
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/' || location.pathname === '/upload' || location.pathname === '/data/new';
  const animationKey = isDashboard ? 'dashboard' : 'workstation';

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Routes location={location} key={animationKey}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/upload" element={<UploadView />} />
        <Route path="/data/new" element={<CreateDataBatchView />} />
        <Route path="/docs" element={<DocsView />} />

        {/* Workspace Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/data/:batchId" element={<DataBatchDetailView />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DataBatchOverview />} />
            <Route path="browser" element={<DataBatchBrowser />} />
            <Route path="tasks" element={<DataBatchTasks />} />
          </Route>
          <Route path="/:taskId/particles" element={<ParticleAnalysisView />} />
          <Route path="/:taskId/fibers" element={<FiberAnalysisView />} />
          <Route path="/:taskId/analysis">
            <Route index element={<Navigate to="attribute" replace />} />
            <Route path="attribute" element={<AttributeAnalysisView />} />
            <Route path="correlation" element={<CorrelationAnalysisView />} />
            <Route path="comparison" element={<ComparisonAnalysisView />} />
            <Route path="task_comparison" element={<TaskComparisonView />} />
          </Route>
          <Route path="/finetune" element={<FineTuningView />} />
          <Route path="/:taskId/reports" element={<ReportsView />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

import { SidebarProvider } from './context/SidebarContext';

// ...

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <GlobalHeader />
        <AnimatedRoutes />
        <GlobalFooter />
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
