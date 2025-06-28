
import React, { useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuantumParticles from '../components/QuantumParticles';
import { 
  QuantumDataInputCard, 
  QuantumPreprocessorCard, 
  QuantumAnalyticsCard, 
  QuantumInterfaceCard 
} from '../components/training/QuantumCards';
import { TrainingTabs } from '../components/training/TrainingTabs';
import { EngineConfigTab } from '../components/training/EngineConfigTab';
import { WeightsConfigTab } from '../components/training/WeightsConfigTab';
import { AdvancedConfigTab } from '../components/training/AdvancedConfigTab';
import { TrainingLogsPanel } from '../components/training/TrainingLogsPanel';
import { TrainingActivityMonitor } from '../components/training/TrainingActivityMonitor';
import { LiveMetricsPanel } from '../components/training/LiveMetricsPanel';
import { SystemStatusSidebar } from '../components/training/SystemStatusSidebar';

// Types
interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

interface ModelConfig {
  primaryLLM: string;
  creativity: number;
  responseLength: number;
  contextWindow: number;
  realTimeProcessing: boolean;
}

interface TrainingMetrics {
  samplesProcessed: number;
  accuracy: number;
  lastTraining: string;
  modelVersion: string;
}

interface TrainingActivity {
  id: string;
  stage: string;
  progress: number;
  timestamp: string;
  status: "completed" | "active" | "pending" | "error";
  metrics: {
    loss: number;
    accuracy: number;
    learningRate: number;
  };
}

interface SystemStatus {
  neutroEngine: string;
  firestore: string;
  groqAPI: string;
  trainingPipeline: string;
}

const Training = () => {
  const [activeTab, setActiveTab] = useState("engine");
  const [isTraining, setIsTraining] = useState(true);
  const [weights, setWeights] = useState<WeightVector>({ 
    cost: 0.25, 
    time: 0.25, 
    reliability: 0.25, 
    risk: 0.25 
  });

  const modelConfig: ModelConfig = { 
    primaryLLM: "GPT-4 Turbo", 
    creativity: 70, 
    responseLength: 80, 
    contextWindow: 5, 
    realTimeProcessing: true 
  };
  
  const setModelConfig = (config: ModelConfig) => {
    console.log('Model config updated:', config);
  };
  
  const trainingMetrics: TrainingMetrics = { 
    samplesProcessed: 3214, 
    accuracy: 94.2, 
    lastTraining: "2025-06-27", 
    modelVersion: "v2.0" 
  };
  
  const trainingActivities: TrainingActivity[] = [
    { 
      id: "1", 
      stage: "Initialize", 
      progress: 100, 
      timestamp: "10:02", 
      status: "completed", 
      metrics: { loss: 0.21, accuracy: 88.2, learningRate: 0.001 } 
    },
    { 
      id: "2", 
      stage: "Feature Extraction", 
      progress: 100, 
      timestamp: "10:05", 
      status: "completed", 
      metrics: { loss: 0.17, accuracy: 92.0, learningRate: 0.001 } 
    },
    { 
      id: "3", 
      stage: "Neural Training", 
      progress: 70, 
      timestamp: "10:15", 
      status: "active", 
      metrics: { loss: 0.12, accuracy: 94.1, learningRate: 0.0008 } 
    },
    { 
      id: "4", 
      stage: "Evaluation", 
      progress: 0, 
      timestamp: "--:--", 
      status: "pending", 
      metrics: { loss: 0, accuracy: 0, learningRate: 0 } 
    },
  ];
  
  const systemStatus: SystemStatus = {
    neutroEngine: "connected",
    firestore: "connected",
    groqAPI: "connected",
    trainingPipeline: "connected",
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <QuantumParticles />
      
      <main className="flex-1 py-8 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-deepcal-purple to-deepcal-light flex items-center justify-center glowing-border">
                  <i className="fas fa-brain text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deepcal-light to-white">
                    DeepCAL++ Training & Quantum Matrix
                  </h1>
                  <p className="text-slate-400 mt-1">
                    Advanced training pipeline with quantum optimization integration
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="oracle-card px-4 py-2 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                  <span className="text-sm text-slate-200">Training Pipeline Active</span>
                </div>
                <div className="oracle-card px-4 py-2 flex items-center">
                  <i className="fas fa-database text-deepcal-light mr-2"></i>
                  <span className="text-sm text-slate-200">v2.1.0-quantum</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Node UI Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 place-items-center">
            <QuantumDataInputCard />
            <QuantumPreprocessorCard />
            <QuantumAnalyticsCard />
            <QuantumInterfaceCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <SystemStatusSidebar systemStatus={systemStatus} trainingMetrics={trainingMetrics} />
              <LiveMetricsPanel isTraining={isTraining} />
            </aside>

            {/* Main Panel */}
            <main className="lg:col-span-5 space-y-8">
              <TrainingTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <section>
                {activeTab === "engine" && (
                  <EngineConfigTab
                    modelConfig={modelConfig}
                    setModelConfig={setModelConfig}
                    trainingMetrics={trainingMetrics}
                    isTraining={isTraining}
                    trainingActivities={trainingActivities}
                  />
                )}
                {activeTab === "weights" && (
                  <WeightsConfigTab weights={weights} setWeights={setWeights} />
                )}
                {activeTab === "advanced" && <AdvancedConfigTab />}
                {activeTab === "logs" && <TrainingLogsPanel isTraining={isTraining} />}
              </section>

              <TrainingActivityMonitor isTraining={isTraining} trainingActivities={trainingActivities} />
            </main>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Training;
