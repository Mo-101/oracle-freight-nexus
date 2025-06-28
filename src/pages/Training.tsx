import React, { useState, useEffect, useRef } from "react";
import {
  Cpu, Zap, Activity, TrendingUp, Clock, Signal, MemoryStick, BarChart3,
  CheckCircle, AlertCircle, XCircle, Timer, Target, Brain, Sliders, Database, Settings, Terminal, AlertTriangle, Info
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuantumParticles from '../components/QuantumParticles';
import HolographicCard from '../components/HolographicCard';

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

// Quantum UI Node Cards
const QuantumDataInputCard = () => {
  return (
    <HolographicCard className="w-72" animationClass="animate-float">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-deepcal-purple flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-dna text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-deepcal-light text-lg">Quantum Data Input</h3>
            <div className="text-xs text-slate-400">Emergency Health Kits Dataset</div>
          </div>
        </div>
        <div className="text-xs text-slate-300 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Quantum Entanglement</span>
            <span className="text-green-400">✓ Superpositioned</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Data Integrity</span>
            <span className="text-green-400">✓ Verified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Qubits Allocated</span>
            <span className="text-deepcal-light">1,024</span>
          </div>
        </div>
      </div>
    </HolographicCard>
  );
};

const QuantumPreprocessorCard = () => {
  return (
    <HolographicCard className="w-72" animationClass="animate-float-2">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-deepcal-light flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-microchip text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-deepcal-light text-lg">Quantum Preprocessor</h3>
            <div className="text-xs text-slate-400">Parallel Dimension Reduction</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
              <span className="text-xs text-slate-300">Quantum Validation</span>
            </div>
            <span className="text-xs font-mono text-green-400">99.8%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-deepcal-light mr-2 animate-pulse"></div>
              <span className="text-xs text-slate-300">Entanglement Mapping</span>
            </div>
            <span className="text-xs font-mono text-deepcal-light">64q</span>
          </div>
        </div>
      </div>
    </HolographicCard>
  );
};

const QuantumAnalyticsCard = () => {
  return (
    <HolographicCard className="w-80" animationClass="animate-float-3">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-brain text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-blue-300 text-lg">Quantum Analytics Core</h3>
            <div className="text-xs text-slate-400">Neural Quantum Network</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Avg Transit</div>
            <div className="font-mono text-slate-200">2.4d <span className="text-green-400">(-18%)</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Cost Efficiency</div>
            <div className="font-mono text-slate-200">$0.98/kg <span className="text-green-400">(+9.5%)</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Reliability</div>
            <div className="font-mono text-slate-200">96.2% <span className="text-green-400">(+4.2pp)</span></div>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-600/50">
            <div className="text-deepcal-light mb-1">Risk Factor</div>
            <div className="font-mono text-slate-200">3.8% <span className="text-green-400">(-4.2pp)</span></div>
          </div>
        </div>
      </div>
    </HolographicCard>
  );
};

const QuantumInterfaceCard = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    volume: '',
    priority: 'Medical Supplies (Q-Priority 9)',
    emergency: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleOptimize = () => {
    console.log('Executing quantum optimization with:', formData);
  };

  return (
    <HolographicCard className="w-96" animationClass="animate-float-4">
      <div className="oracle-card p-5">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-3 glowing-border">
            <i className="fas fa-terminal text-white text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-green-300 text-lg">Quantum Interface</h3>
            <div className="text-xs text-slate-400">Real-time Optimization</div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-deepcal-light mb-1">Origin Coordinates</label>
            <input 
              type="text" 
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none" 
              placeholder="Qx: 0.42, Qy: 0.78"
            />
          </div>
          <div>
            <label className="block text-xs text-deepcal-light mb-1">Destination Field</label>
            <input 
              type="text" 
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none" 
              placeholder="Enter quantum coordinates"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-deepcal-light mb-1">Mass (kg)</label>
              <input 
                type="number" 
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-deepcal-light mb-1">Volume (qbm)</label>
              <input 
                type="number" 
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:border-deepcal-light focus:outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleOptimize}
            className="w-full bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-dark hover:to-deepcal-purple text-white py-3 px-4 rounded text-sm font-bold transition-all duration-300 transform hover:scale-[1.01] active:scale-95 flex items-center justify-center glowing-border"
          >
            <i className="fas fa-bolt mr-2"></i>
            Execute Quantum Optimization
          </button>
        </div>
      </div>
    </HolographicCard>
  );
};

// Training Tabs Component
const TrainingTabs = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: string) => void }) => {
  const tabs = [
    { id: "engine", label: "Engine Configuration", icon: Brain },
    { id: "weights", label: "Criteria Weights", icon: Sliders },
    { id: "advanced", label: "Advanced", icon: Settings },
    { id: "logs", label: "Logs", icon: Terminal }
  ];
  
  return (
    <div className="flex border-b border-slate-700 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-medium flex items-center gap-2 transition-all ${
            activeTab === tab.id
              ? "text-deepcal-light border-b-2 border-deepcal-light"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <tab.icon className="w-4 h-4" /> {tab.label}
        </button>
      ))}
    </div>
  );
};

// Engine Configuration Tab
const EngineConfigTab = ({ 
  modelConfig, 
  setModelConfig, 
  trainingMetrics, 
  isTraining, 
  trainingActivities 
}: {
  modelConfig: ModelConfig;
  setModelConfig: (config: ModelConfig) => void;
  trainingMetrics: TrainingMetrics;
  isTraining: boolean;
  trainingActivities: TrainingActivity[];
}) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Engine Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Primary LLM</Label>
            <select className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white">
              <option>GPT-4 Turbo</option>
              <option>Claude-3 Opus</option>
              <option>Gemini Pro</option>
            </select>
          </div>
          <div>
            <Label className="text-slate-300">Creativity Level: {modelConfig.creativity}%</Label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={modelConfig.creativity}
              className="w-full mt-1"
            />
          </div>
          <div>
            <Label className="text-slate-300">Response Length: {modelConfig.responseLength}%</Label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={modelConfig.responseLength}
              className="w-full mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Training Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 text-sm">Samples Processed</div>
              <div className="text-2xl font-bold text-green-400">{trainingMetrics.samplesProcessed.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Accuracy</div>
              <div className="text-2xl font-bold text-deepcal-light">{trainingMetrics.accuracy}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Last Training</div>
              <div className="text-slate-200">{trainingMetrics.lastTraining}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm">Model Version</div>
              <div className="text-slate-200">{trainingMetrics.modelVersion}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Weights Configuration Tab
const WeightsConfigTab = ({ weights, setWeights }: { weights: WeightVector; setWeights: (w: WeightVector) => void }) => {
  const handleWeightChange = (criterion: keyof WeightVector, value: number) => {
    const newWeights = { ...weights, [criterion]: value / 100 };
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    
    if (total > 0) {
      Object.keys(newWeights).forEach(key => {
        newWeights[key as keyof WeightVector] = newWeights[key as keyof WeightVector] / total;
      });
    }
    
    setWeights(newWeights);
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Criteria Weights Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(weights).map(([criterion, weight]) => (
          <div key={criterion}>
            <div className="flex justify-between mb-2">
              <Label className="text-slate-300 capitalize">{criterion}</Label>
              <span className="text-deepcal-light font-mono">{(weight * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weight * 100}
              onChange={(e) => handleWeightChange(criterion as keyof WeightVector, parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Advanced Configuration Tab
const AdvancedConfigTab = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light">Algorithm Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Optimization Method</Label>
            <select className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white">
              <option>Grey-AHP-TOPSIS</option>
              <option>Fuzzy TOPSIS</option>
              <option>ELECTRE III</option>
            </select>
          </div>
          <div>
            <Label className="text-slate-300">Convergence Threshold</Label>
            <Input placeholder="0.001" className="mt-1" />
          </div>
          <div>
            <Label className="text-slate-300">Max Iterations</Label>
            <Input placeholder="1000" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light">Performance Tuning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Parallel Processing</Label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">GPU Acceleration</Label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Memory Optimization</Label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Training Logs Panel
const TrainingLogsPanel = ({ isTraining }: { isTraining: boolean }) => {
  const logs = [
    { timestamp: '10:45:23', level: 'INFO', message: 'Training batch 1247/2000 completed' },
    { timestamp: '10:45:21', level: 'SUCCESS', message: 'Model checkpoint saved successfully' },
    { timestamp: '10:45:19', level: 'INFO', message: 'Learning rate adjusted to 0.0008' },
    { timestamp: '10:45:15', level: 'WARNING', message: 'High memory usage detected (85%)' },
    { timestamp: '10:45:12', level: 'INFO', message: 'Validation accuracy: 94.2%' },
  ];

  const getLogColor = (level: string) => {
    switch (level) {
      case 'SUCCESS': return 'text-green-400';
      case 'WARNING': return 'text-yellow-400';
      case 'ERROR': return 'text-red-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Training Logs
          {isTraining && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-slate-500">[{log.timestamp}]</span>
              <span className={`ml-2 ${getLogColor(log.level)}`}>{log.level}:</span>
              <span className="ml-2 text-slate-200">{log.message}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// System Status Sidebar
const SystemStatusSidebar = ({ systemStatus, trainingMetrics }: { systemStatus: SystemStatus; trainingMetrics: TrainingMetrics }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light text-lg">System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(systemStatus).map(([system, status]) => (
          <div key={system} className="flex items-center justify-between">
            <span className="text-slate-300 text-sm capitalize">{system.replace(/([A-Z])/g, ' $1')}</span>
            {getStatusIcon(status)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Live Metrics Panel
const LiveMetricsPanel = ({ isTraining }: { isTraining: boolean }) => {
  const [metrics, setMetrics] = useState({
    cpu: 72,
    memory: 85,
    gpu: 91,
    throughput: 1247
  });

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        gpu: Math.max(50, Math.min(100, prev.gpu + (Math.random() - 0.5) * 8)),
        throughput: Math.max(800, Math.min(2000, prev.throughput + (Math.random() - 0.5) * 100))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isTraining]);

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">CPU Usage</span>
            <span className="text-deepcal-light">{metrics.cpu}%</span>
          </div>
          <Progress value={metrics.cpu} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Memory</span>
            <span className="text-deepcal-light">{metrics.memory}%</span>
          </div>
          <Progress value={metrics.memory} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">GPU Usage</span>
            <span className="text-deepcal-light">{metrics.gpu}%</span>
          </div>
          <Progress value={metrics.gpu} className="h-2" />
        </div>
        <div className="pt-2 border-t border-slate-700">
          <div className="text-xs text-slate-400">Throughput</div>
          <div className="text-lg font-bold text-green-400">{metrics.throughput} samples/sec</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Training Activity Monitor
const TrainingActivityMonitor = ({ isTraining, trainingActivities }: { isTraining: boolean; trainingActivities: TrainingActivity[] }) => {
  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Training Pipeline Activity
          {isTraining && <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trainingActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex-shrink-0">
                {activity.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {activity.status === 'active' && <div className="w-5 h-5 border-2 border-deepcal-light border-t-transparent rounded-full animate-spin" />}
                {activity.status === 'pending' && <Clock className="w-5 h-5 text-slate-400" />}
                {activity.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-200 font-medium">{activity.stage}</span>
                  <span className="text-xs text-slate-400">{activity.timestamp}</span>
                </div>
                <Progress value={activity.progress} className="h-2 mb-2" />
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Loss: </span>
                    <span className="text-deepcal-light">{activity.metrics.loss.toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Accuracy: </span>
                    <span className="text-green-400">{activity.metrics.accuracy.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">LR: </span>
                    <span className="text-slate-300">{activity.metrics.learningRate.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Training Page Component
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
