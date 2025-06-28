
import React, { useState } from 'react';
import Header from '@/components/Header';
import HolographicCard from '@/components/HolographicCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AITraining = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState('neutrosophic-ahp');

  // Mock training data
  const trainingMetrics = [
    { epoch: 1, accuracy: 0.72, loss: 0.45, validation: 0.68 },
    { epoch: 2, accuracy: 0.78, loss: 0.38, validation: 0.74 },
    { epoch: 3, accuracy: 0.82, loss: 0.32, validation: 0.79 },
    { epoch: 4, accuracy: 0.85, loss: 0.28, validation: 0.82 },
    { epoch: 5, accuracy: 0.88, loss: 0.24, validation: 0.85 },
    { epoch: 6, accuracy: 0.91, loss: 0.21, validation: 0.87 },
    { epoch: 7, accuracy: 0.93, loss: 0.18, validation: 0.89 },
    { epoch: 8, accuracy: 0.94, loss: 0.16, validation: 0.91 }
  ];

  const modelPerformance = [
    { model: 'Neutrosophic AHP', accuracy: 94.2, efficiency: 88.7, reliability: 92.1 },
    { model: 'Grey TOPSIS', accuracy: 91.8, efficiency: 85.3, reliability: 89.6 },
    { model: 'Fuzzy AHP', accuracy: 87.4, efficiency: 82.1, reliability: 85.9 },
    { model: 'Classical MCDM', accuracy: 82.6, efficiency: 78.4, reliability: 81.2 }
  ];

  const dataQuality = [
    { metric: 'Completeness', score: 94.8, status: 'Excellent' },
    { metric: 'Consistency', score: 91.2, status: 'Good' },
    { metric: 'Accuracy', score: 96.7, status: 'Excellent' },
    { metric: 'Timeliness', score: 89.4, status: 'Good' },
    { metric: 'Relevance', score: 93.1, status: 'Excellent' }
  ];

  const handleTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  return (
    <div className="min-h-screen quantum-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-quantum-400 to-neural-400 bg-clip-text text-transparent mb-4">
            AI Training & Management Console
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Advanced neural network training for DeepCAL's decision-making algorithms using Neutrosophic AHP-TOPSIS methodology
          </p>
        </div>

        <Tabs defaultValue="training" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-dark-800/50 border border-quantum-500/30">
            <TabsTrigger value="training" className="data-[state=active]:bg-quantum-600">Model Training</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-quantum-600">Performance</TabsTrigger>
            <TabsTrigger value="data-quality" className="data-[state=active]:bg-quantum-600">Data Quality</TabsTrigger>
            <TabsTrigger value="deployment" className="data-[state=active]:bg-quantum-600">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Training Controls */}
              <HolographicCard>
                <Card className="oracle-card h-full">
                  <CardHeader>
                    <CardTitle className="text-quantum-300 flex items-center">
                      <i className="fas fa-brain mr-2"></i>
                      Neural Network Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="model-select" className="text-quantum-300">Select Model Architecture</Label>
                      <select 
                        id="model-select"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full mt-1 p-2 bg-dark-800/50 border border-quantum-500/30 rounded-md text-white"
                      >
                        <option value="neutrosophic-ahp">Neutrosophic AHP-TOPSIS</option>
                        <option value="grey-topsis">Grey TOPSIS</option>
                        <option value="fuzzy-ahp">Fuzzy AHP</option>
                        <option value="deep-mcdm">Deep MCDM Hybrid</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="learning-rate" className="text-quantum-300">Learning Rate</Label>
                        <Input 
                          id="learning-rate"
                          defaultValue="0.001"
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="batch-size" className="text-quantum-300">Batch Size</Label>
                        <Input 
                          id="batch-size"
                          defaultValue="32"
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="epochs" className="text-quantum-300">Training Epochs</Label>
                      <Input 
                        id="epochs"
                        defaultValue="100"
                        className="bg-dark-800/50 border-quantum-500/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-quantum-300">Training Progress</span>
                        <span className="text-neural-400">{trainingProgress}%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-quantum-500 to-neural-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${trainingProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleTraining}
                      disabled={isTraining}
                      className="w-full bg-quantum-600 hover:bg-quantum-700 disabled:opacity-50"
                    >
                      {isTraining ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Training in Progress...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-play mr-2"></i>
                          Start Training
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </HolographicCard>

              {/* Training Metrics */}
              <HolographicCard>
                <Card className="oracle-card h-full">
                  <CardHeader>
                    <CardTitle className="text-quantum-300 flex items-center">
                      <i className="fas fa-chart-line mr-2"></i>
                      Training Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trainingMetrics}>
                        <CartesianGrid strokeDasharray="3,3" stroke="rgba(99, 102, 241, 0.1)" />
                        <XAxis dataKey="epoch" stroke="#a5b4fc" />
                        <YAxis stroke="#a5b4fc" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="accuracy" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Accuracy"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="validation" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          name="Validation"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="loss" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Loss"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>

            {/* Real-time Training Status */}
            <HolographicCard>
              <Card className="oracle-card">
                <CardHeader>
                  <CardTitle className="text-quantum-300 flex items-center">
                    <i className="fas fa-microchip mr-2"></i>
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-green-600/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-server text-green-400 text-xl"></i>
                      </div>
                      <div className="text-sm text-green-400">GPU Cluster</div>
                      <div className="text-xs text-gray-400">Online</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-database text-blue-400 text-xl"></i>
                      </div>
                      <div className="text-sm text-blue-400">Data Pipeline</div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-purple-600/20 border-2 border-purple-500 flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <i className="fas fa-brain text-purple-400 text-xl"></i>
                      </div>
                      <div className="text-sm text-purple-400">Neural Core</div>
                      <div className="text-xs text-gray-400">{isTraining ? 'Training' : 'Ready'}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-quantum-600/20 border-2 border-quantum-500 flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-shield-alt text-quantum-400 text-xl"></i>
                      </div>
                      <div className="text-sm text-quantum-400">Validation</div>
                      <div className="text-xs text-gray-400">Secured</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HolographicCard>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HolographicCard>
                <Card className="oracle-card">
                  <CardHeader>
                    <CardTitle className="text-quantum-300">Model Performance Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={modelPerformance}>
                        <CartesianGrid strokeDasharray="3,3" stroke="rgba(99, 102, 241, 0.1)" />
                        <XAxis dataKey="model" stroke="#a5b4fc" />
                        <YAxis stroke="#a5b4fc" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="accuracy" fill="#10b981" />
                        <Bar dataKey="efficiency" fill="#6366f1" />
                        <Bar dataKey="reliability" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </HolographicCard>

              <HolographicCard>
                <Card className="oracle-card">
                  <CardHeader>
                    <CardTitle className="text-quantum-300">Model Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-dark-800/50 p-4 rounded-lg border border-quantum-500/20">
                      <h4 className="text-quantum-400 font-semibold mb-2">Neutrosophic AHP-TOPSIS</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Parameters:</span>
                          <span className="text-neural-400">2.4M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Training Data:</span>
                          <span className="text-neural-400">15,847 records</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inference Time:</span>
                          <span className="text-neural-400">12ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accuracy:</span>
                          <span className="text-green-400">94.2%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          </TabsContent>

          <TabsContent value="data-quality" className="space-y-6">
            <HolographicCard>
              <Card className="oracle-card">
                <CardHeader>
                  <CardTitle className="text-quantum-300 flex items-center">
                    <i className="fas fa-chart-pie mr-2"></i>
                    Data Quality Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {dataQuality.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="rgba(99, 102, 241, 0.2)"
                              strokeWidth="4"
                              fill="none"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              stroke="#6366f1"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 36}`}
                              strokeDashoffset={`${2 * Math.PI * 36 * (1 - item.score / 100)}`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-bold text-quantum-300">{item.score}%</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300">{item.metric}</div>
                        <div className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </HolographicCard>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HolographicCard>
                <Card className="oracle-card">
                  <CardHeader>
                    <CardTitle className="text-quantum-300">Model Deployment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-green-500/30">
                        <div>
                          <div className="text-green-400 font-semibold">Production Model</div>
                          <div className="text-xs text-gray-400">Neutrosophic AHP v2.1.0</div>
                        </div>
                        <div className="text-green-400">
                          <i className="fas fa-check-circle"></i>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-blue-500/30">
                        <div>
                          <div className="text-blue-400 font-semibold">Staging Model</div>
                          <div className="text-xs text-gray-400">Grey TOPSIS v1.8.3</div>
                        </div>
                        <div className="text-blue-400">
                          <i className="fas fa-sync fa-spin"></i>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-yellow-500/30">
                        <div>
                          <div className="text-yellow-400 font-semibold">Development Model</div>
                          <div className="text-xs text-gray-400">Deep MCDM v0.9.1</div>
                        </div>
                        <div className="text-yellow-400">
                          <i className="fas fa-wrench"></i>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-quantum-600 hover:bg-quantum-700">
                      <i className="fas fa-rocket mr-2"></i>
                      Deploy New Model
                    </Button>
                  </CardContent>
                </Card>
              </HolographicCard>

              <HolographicCard>
                <Card className="oracle-card">
                  <CardHeader>
                    <CardTitle className="text-quantum-300">System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>API Response Time</span>
                        <span className="text-green-400">12ms avg</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Model Accuracy</span>
                        <span className="text-green-400">94.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Uptime</span>
                        <span className="text-green-400">99.97%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Memory Usage</span>
                        <span className="text-blue-400">2.1GB / 8GB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>CPU Usage</span>
                        <span className="text-blue-400">34%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AITraining;
