import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardOverview from './components/dashboard/DashboardOverview';
import CropAdvisor from './components/crop/CropAdvisor';
import IrrigationQueue from './components/irrigation/IrrigationQueue';
import { useIrrigationQueue } from './hooks/useIrrigationQueue';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    queue,
    simulationStep,
    lastSimulatedAt,
    activePlot,
    advanceSixHours,
    resetQueue,
  } = useIrrigationQueue();

  const renderPanel = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview activePlot={activePlot} />;
      case 'crop':
        return <CropAdvisor />;
      case 'irrigation':
        return (
          <IrrigationQueue
            queue={queue}
            simulationStep={simulationStep}
            lastSimulatedAt={lastSimulatedAt}
            onAdvance={advanceSixHours}
            onReset={resetQueue}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur lg:hidden">
          <p className="text-xs font-medium text-saka-700">SakIA · Cooperative Insights</p>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
