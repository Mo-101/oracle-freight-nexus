
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { TrainingTabs } from '../components/training/TrainingTabs';
import { EngineConfigTab } from '../components/training/EngineConfigTab';
import { WeightsConfigTab } from '../components/training/WeightsConfigTab';
import { AdvancedConfigTab } from '../components/training/AdvancedConfigTab';
import { TrainingLogsPanel } from '../components/training/TrainingLogsPanel';

const Training = () => {
  const [activeTab, setActiveTab] = useState('engine');
  const [isTraining, setIsTraining] = useState(false);
  
  // Mock state for model configuration
  const [modelConfig, setModelConfig] = useState({
    primaryLLM: 'GPT-4 Turbo',
    creativity: 75,
    responseLength: 80,
    contextWindow: 8192,
    realTimeProcessing: true
  });

  // Mock state for weights
  const [weights, setWeights] = useState({
    cost: 0.25,
    time: 0.3,
    reliability: 0.35,
    risk: 0.1
  });

  // Mock training metrics
  const trainingMetrics = {
    samplesProcessed: 127453,
    accuracy: 94.2,
    lastTraining: '2 hours ago',
    modelVersion: 'v2.4.1'
  };

  // Mock training activities
  const trainingActivities = [
    {
      id: '1',
      stage: 'Data Processing',
      progress: 100,
      timestamp: '10:45:23',
      status: 'completed' as const,
      metrics: { loss: 0.024, accuracy: 94.2, learningRate: 0.0008 }
    },
    {
      id: '2', 
      stage: 'Model Training',
      progress: 67,
      timestamp: '10:45:25',
      status: 'active' as const,
      metrics: { loss: 0.031, accuracy: 92.1, learningRate: 0.0008 }
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'engine':
        return (
          <EngineConfigTab 
            modelConfig={modelConfig}
            setModelConfig={setModelConfig}
            trainingMetrics={trainingMetrics}
            isTraining={isTraining}
            trainingActivities={trainingActivities}
          />
        );
      case 'weights':
        return (
          <WeightsConfigTab 
            weights={weights}
            setWeights={setWeights}
          />
        );
      case 'advanced':
        return <AdvancedConfigTab />;
      case 'logs':
        return <TrainingLogsPanel isTraining={isTraining} />;
      default:
        return (
          <EngineConfigTab 
            modelConfig={modelConfig}
            setModelConfig={setModelConfig}
            trainingMetrics={trainingMetrics}
            isTraining={isTraining}
            trainingActivities={trainingActivities}
          />
        );
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
