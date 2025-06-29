
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { TrainingTabs } from '../components/training/TrainingTabs';
import { EngineConfigTab } from '../components/training/EngineConfigTab';
import { WeightsConfigTab } from '../components/training/WeightsConfigTab';
import { AdvancedConfigTab } from '../components/training/AdvancedConfigTab';
import { TrainingLogsPanel } from '../components/training/TrainingLogsPanel';

const Training = () => {
  const [activeTab, setActiveTab] = useState('engine');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'engine':
        return <EngineConfigTab />;
      case 'weights':
        return <WeightsConfigTab />;
      case 'advanced':
        return <AdvancedConfigTab />;
      case 'logs':
        return <TrainingLogsPanel />;
      default:
        return <EngineConfigTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TrainingTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Training;
