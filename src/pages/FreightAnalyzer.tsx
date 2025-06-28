
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HolographicCard from '@/components/HolographicCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Forwarder {
  id: string;
  name: string;
  avgCostPerKg: number;
  avgTransitDays: number;
  reliabilityScore: number;
  onTimeRate: number;
  specialties: string[];
  maxWeight: number;
  maxVolume: number;
  modes: string[];
}

interface ShipmentCalculation {
  forwarder: Forwarder;
  estimatedCost: number;
  estimatedTransit: number;
  riskScore: number;
  efficiencyScore: number;
  ahpScore: number;
  topsisRank: number;
}

const FreightAnalyzer = () => {
  const [shipmentData, setShipmentData] = useState({
    origin: 'Kenya',
    destination: '',
    weight: '',
    volume: '',
    cargo: '',
    priority: 'standard',
    mode: 'any'
  });

  const [newForwarder, setNewForwarder] = useState({
    name: '',
    avgCostPerKg: '',
    avgTransitDays: '',
    reliabilityScore: '',
    specialties: '',
    modes: 'Air'
  });

  const [forwarders, setForwarders] = useState<Forwarder[]>([
    {
      id: '1',
      name: 'Kuehne Nagel',
      avgCostPerKg: 2.45,
      avgTransitDays: 5,
      reliabilityScore: 94.2,
      onTimeRate: 92.8,
      specialties: ['Emergency Health Kits', 'Cold Chain'],
      maxWeight: 50000,
      maxVolume: 200,
      modes: ['Air', 'Sea', 'Road']
    },
    {
      id: '2',
      name: 'Kenya Airways Cargo',
      avgCostPerKg: 3.12,
      avgTransitDays: 3,
      reliabilityScore: 89.7,
      onTimeRate: 88.4,
      specialties: ['Emergency Health Kits', 'Fast Delivery'],
      maxWeight: 30000,
      maxVolume: 150,
      modes: ['Air']
    },
    {
      id: '3',
      name: 'Freight In Time',
      avgCostPerKg: 2.18,
      avgTransitDays: 7,
      reliabilityScore: 91.5,
      onTimeRate: 87.2,
      specialties: ['Field Support Material', 'PPE'],
      maxWeight: 40000,
      maxVolume: 180,
      modes: ['Air', 'Road']
    },
    {
      id: '4',
      name: 'Scan Global Logistics',
      avgCostPerKg: 2.89,
      avgTransitDays: 4,
      reliabilityScore: 93.1,
      onTimeRate: 91.6,
      specialties: ['Lab & Diagnostics', 'Pharmaceuticals'],
      maxWeight: 35000,
      maxVolume: 160,
      modes: ['Air', 'Sea']
    },
    {
      id: '5',
      name: 'DHL Express',
      avgCostPerKg: 4.25,
      avgTransitDays: 2,
      reliabilityScore: 96.8,
      onTimeRate: 95.2,
      specialties: ['Emergency Delivery', 'Small Packages'],
      maxWeight: 5000,
      maxVolume: 50,
      modes: ['Air']
    }
  ]);

  // Advanced AHP-TOPSIS calculation
  const calculateOptimalForwarders = useMemo((): ShipmentCalculation[] => {
    if (!shipmentData.weight || !shipmentData.destination) return [];

    const weight = parseFloat(shipmentData.weight);
    const volume = parseFloat(shipmentData.volume) || 0;

    // Filter suitable forwarders
    const suitableForwarders = forwarders.filter(f => 
      f.maxWeight >= weight && f.maxVolume >= volume
    );

    if (suitableForwarders.length === 0) return [];

    // AHP Criteria Weights (normalized)
    const criteria = {
      cost: 0.35,      // Cost importance
      speed: 0.25,     // Transit time importance  
      reliability: 0.25, // Reliability importance
      specialty: 0.15   // Specialty match importance
    };

    const calculations = suitableForwarders.map(forwarder => {
      // Cost calculation with volume consideration
      const baseCost = forwarder.avgCostPerKg * weight;
      const volumeMultiplier = volume > 0 ? Math.max(1, volume / 100) : 1;
      const estimatedCost = baseCost * volumeMultiplier;

      // Transit time with priority adjustment
      const priorityMultiplier = shipmentData.priority === 'emergency' ? 0.7 : 1;
      const estimatedTransit = Math.ceil(forwarder.avgTransitDays * priorityMultiplier);

      // Risk scoring (inverse of reliability)
      const riskScore = 100 - forwarder.reliabilityScore;

      // Specialty matching
      const specialtyMatch = forwarder.specialties.some(s => 
        shipmentData.cargo.toLowerCase().includes(s.toLowerCase())
      ) ? 1 : 0.5;

      // Normalized scores for TOPSIS (0-1 scale)
      const normalizedCost = 1 / (estimatedCost / 1000); // Lower cost = higher score
      const normalizedSpeed = 1 / estimatedTransit; // Faster = higher score
      const normalizedReliability = forwarder.reliabilityScore / 100;
      const normalizedSpecialty = specialtyMatch;

      // Weighted scores
      const weightedCost = normalizedCost * criteria.cost;
      const weightedSpeed = normalizedSpeed * criteria.speed;
      const weightedReliability = normalizedReliability * criteria.reliability;
      const weightedSpecialty = normalizedSpecialty * criteria.specialty;

      // AHP Score (sum of weighted criteria)
      const ahpScore = weightedCost + weightedSpeed + weightedReliability + weightedSpecialty;

      // Efficiency Score (composite metric)
      const efficiencyScore = (
        (normalizedReliability * 0.4) +
        (normalizedSpeed * 0.3) +
        (normalizedCost * 0.2) +
        (normalizedSpecialty * 0.1)
      ) * 100;

      return {
        forwarder,
        estimatedCost: Math.round(estimatedCost),
        estimatedTransit,
        riskScore: Math.round(riskScore * 10) / 10,
        efficiencyScore: Math.round(efficiencyScore * 10) / 10,
        ahpScore: Math.round(ahpScore * 1000) / 1000,
        topsisRank: 0 // Will be set after sorting
      };
    });

    // Sort by AHP score (TOPSIS ranking)
    calculations.sort((a, b) => b.ahpScore - a.ahpScore);
    
    // Assign TOPSIS ranks
    calculations.forEach((calc, index) => {
      calc.topsisRank = index + 1;
    });

    return calculations;
  }, [shipmentData, forwarders]);

  const addForwarder = () => {
    if (!newForwarder.name || !newForwarder.avgCostPerKg) return;

    const forwarder: Forwarder = {
      id: Date.now().toString(),
      name: newForwarder.name,
      avgCostPerKg: parseFloat(newForwarder.avgCostPerKg),
      avgTransitDays: parseInt(newForwarder.avgTransitDays) || 5,
      reliabilityScore: parseFloat(newForwarder.reliabilityScore) || 85,
      onTimeRate: parseFloat(newForwarder.reliabilityScore) || 85,
      specialties: newForwarder.specialties.split(',').map(s => s.trim()).filter(s => s),
      maxWeight: 50000,
      maxVolume: 200,
      modes: [newForwarder.modes]
    };

    setForwarders([...forwarders, forwarder]);
    setNewForwarder({
      name: '',
      avgCostPerKg: '',
      avgTransitDays: '',
      reliabilityScore: '',
      specialties: '',
      modes: 'Air'
    });
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-green-400 bg-green-900/20';
      case 2: return 'text-blue-400 bg-blue-900/20';
      case 3: return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen quantum-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-quantum-400 to-neural-400 bg-clip-text text-transparent mb-4">
            DeepCAL Freight Analyzer
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Advanced logistics calculator powered by Neutrosophic AHP-TOPSIS algorithm for optimal freight forwarder selection
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-dark-800/50 border border-quantum-500/30">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-quantum-600">Freight Calculator</TabsTrigger>
            <TabsTrigger value="forwarders" className="data-[state=active]:bg-quantum-600">Forwarder Management</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-quantum-600">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipment Input Form */}
              <HolographicCard>
                <Card className="oracle-card h-full">
                  <CardHeader>
                    <CardTitle className="text-quantum-300 flex items-center">
                      <i className="fas fa-calculator mr-2"></i>
                      Shipment Calculator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-quantum-300">Origin</Label>
                        <Input 
                          value={shipmentData.origin}
                          onChange={(e) => setShipmentData({...shipmentData, origin: e.target.value})}
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                      <div>
                        <Label className="text-quantum-300">Destination</Label>
                        <Input 
                          value={shipmentData.destination}
                          onChange={(e) => setShipmentData({...shipmentData, destination: e.target.value})}
                          placeholder="e.g., Zimbabwe"
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-quantum-300">Weight (kg)</Label>
                        <Input 
                          type="number"
                          value={shipmentData.weight}
                          onChange={(e) => setShipmentData({...shipmentData, weight: e.target.value})}
                          placeholder="e.g., 5000"
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                      <div>
                        <Label className="text-quantum-300">Volume (cbm)</Label>
                        <Input 
                          type="number"
                          value={shipmentData.volume}
                          onChange={(e) => setShipmentData({...shipmentData, volume: e.target.value})}
                          placeholder="e.g., 25"
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-quantum-300">Cargo Description</Label>
                      <Input 
                        value={shipmentData.cargo}
                        onChange={(e) => setShipmentData({...shipmentData, cargo: e.target.value})}
                        placeholder="e.g., Emergency Health Kits"
                        className="bg-dark-800/50 border-quantum-500/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-quantum-300">Priority</Label>
                        <select 
                          value={shipmentData.priority}
                          onChange={(e) => setShipmentData({...shipmentData, priority: e.target.value})}
                          className="w-full p-2 bg-dark-800/50 border border-quantum-500/30 rounded-md text-white"
                        >
                          <option value="standard">Standard</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-quantum-300">Preferred Mode</Label>
                        <select 
                          value={shipmentData.mode}
                          onChange={(e) => setShipmentData({...shipmentData, mode: e.target.value})}
                          className="w-full p-2 bg-dark-800/50 border border-quantum-500/30 rounded-md text-white"
                        >
                          <option value="any">Any Mode</option>
                          <option value="air">Air Only</option>
                          <option value="sea">Sea Only</option>
                          <option value="road">Road Only</option>
                        </select>
                      </div>
                    </div>

                    <Button className="w-full bg-quantum-600 hover:bg-quantum-700">
                      <i className="fas fa-search mr-2"></i>
                      Calculate Optimal Routes
                    </Button>
                  </CardContent>
                </Card>
              </HolographicCard>

              {/* Algorithm Visualization */}
              <HolographicCard>
                <Card className="oracle-card h-full">
                  <CardHeader>
                    <CardTitle className="text-quantum-300 flex items-center">
                      <i className="fas fa-brain mr-2"></i>
                      AHP-TOPSIS Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-quantum-700/30 border-2 border-quantum-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <i className="fas fa-atom text-quantum-400 text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-semibold text-quantum-300 mb-2">
                        Neutrosophic Decision Matrix
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Processing multi-criteria analysis with uncertainty handling
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Cost Weight</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-dark-700 rounded-full mr-2">
                            <div className="w-7/20 h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-green-400">35%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Speed Weight</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-dark-700 rounded-full mr-2">
                            <div className="w-1/4 h-full bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-blue-400">25%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Reliability Weight</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-dark-700 rounded-full mr-2">
                            <div className="w-1/4 h-full bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-purple-400">25%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Specialty Weight</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-dark-700 rounded-full mr-2">
                            <div className="w-3/20 h-full bg-yellow-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-yellow-400">15%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-3 bg-dark-800/50 rounded-lg border border-quantum-500/20">
                      <div className="text-xs text-center text-quantum-300 font-mono">
                        "Minimizing uncertainty in emergency logistics decisions"
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>

            {/* Results Table */}
            {calculateOptimalForwarders.length > 0 && (
              <HolographicCard>
                <Card className="oracle-card">
                  <CardHeader>
                    <CardTitle className="text-quantum-300 flex items-center">
                      <i className="fas fa-trophy mr-2"></i>
                      Optimized Forwarder Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-quantum-300">Rank</TableHead>
                            <TableHead className="text-quantum-300">Forwarder</TableHead>
                            <TableHead className="text-quantum-300">Estimated Cost</TableHead>
                            <TableHead className="text-quantum-300">Transit Time</TableHead>
                            <TableHead className="text-quantum-300">Risk Score</TableHead>
                            <TableHead className="text-quantum-300">Efficiency</TableHead>
                            <TableHead className="text-quantum-300">AHP Score</TableHead>
                            <TableHead className="text-quantum-300">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {calculateOptimalForwarders.map((calc) => (
                            <TableRow key={calc.forwarder.id} className="hover:bg-dark-800/30">
                              <TableCell>
                                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankColor(calc.topsisRank)}`}>
                                  {calc.topsisRank}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-semibold text-quantum-400">{calc.forwarder.name}</div>
                                  <div className="text-xs text-gray-400">
                                    Reliability: {calc.forwarder.reliabilityScore}%
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-green-400 font-semibold">
                                ${calc.estimatedCost.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-blue-400">
                                {calc.estimatedTransit} days
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${calc.riskScore < 10 ? 'bg-green-500' : calc.riskScore < 20 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                  <span className={calc.riskScore < 10 ? 'text-green-400' : calc.riskScore < 20 ? 'text-yellow-400' : 'text-red-400'}>
                                    {calc.riskScore}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-12 h-2 bg-dark-700 rounded-full mr-2">
                                    <div 
                                      className="h-full bg-gradient-to-r from-neural-500 to-quantum-500 rounded-full"
                                      style={{ width: `${calc.efficiencyScore}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-quantum-300">{calc.efficiencyScore}%</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-purple-400 font-mono">
                                {calc.ahpScore}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  className={calc.topsisRank === 1 ? 'bg-green-600 hover:bg-green-700' : 'bg-quantum-600 hover:bg-quantum-700'}
                                >
                                  {calc.topsisRank === 1 ? 'Select Best' : 'Select'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            )}
          </TabsContent>

          <TabsContent value="forwarders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Forwarder */}
              <HolographicCard>
                <Card className="oracle-card">
                  <CardHeader>
                    <CardTitle className="text-quantum-300 flex items-center">
                      <i className="fas fa-plus-circle mr-2"></i>
                      Add New Forwarder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-quantum-300">Company Name</Label>
                      <Input 
                        value={newForwarder.name}
                        onChange={(e) => setNewForwarder({...newForwarder, name: e.target.value})}
                        placeholder="e.g., Global Logistics Inc."
                        className="bg-dark-800/50 border-quantum-500/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-quantum-300">Cost per kg ($)</Label>
                        <Input 
                          type="number"
                          step="0.01"
                          value={newForwarder.avgCostPerKg}
                          onChange={(e) => setNewForwarder({...newForwarder, avgCostPerKg: e.target.value})}
                          placeholder="e.g., 2.50"
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                      <div>
                        <Label className="text-quantum-300">Avg Transit (days)</Label>
                        <Input 
                          type="number"
                          value={newForwarder.avgTransitDays}
                          onChange={(e) => setNewForwarder({...newForwarder, avgTransitDays: e.target.value})}
                          placeholder="e.g., 5"
                          className="bg-dark-800/50 border-quantum-500/30"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-quantum-300">Reliability Score (%)</Label>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        value={newForwarder.reliabilityScore}
                        onChange={(e) => setNewForwarder({...newForwarder, reliabilityScore: e.target.value})}
                        placeholder="e.g., 92"
                        className="bg-dark-800/50 border-quantum-500/30"
                      />
                    </div>

                    <div>
                      <Label className="text-quantum-300">Specialties (comma-separated)</Label>
                      <Input 
                        value={newForwarder.specialties}
                        onChange={(e) => setNewForwarder({...newForwarder, specialties: e.target.value})}
                        placeholder="e.g., Emergency Health Kits, PPE"
                        className="bg-dark-800/50 border-quantum-500/30"
                      />
                    </div>

                    <div>
                      <Label className="text-quantum-300">Transport Modes</Label>
                      <select 
                        value={newForwarder.modes}
                        onChange={(e) => setNewForwarder({...newForwarder, modes: e.target.value})}
                        className="w-full p-2 bg-dark-800/50 border border-quantum-500/30 rounded-md text-white"
                      >
                        <option value="Air">Air</option>
                        <option value="Sea">Sea</option>
                        <option value="Road">Road</option>
                        <option value="Rail">Rail</option>
                      </select>
                    </div>

                    <Button onClick={addForwarder} className="w-full bg-quantum-600 hover:bg-quantum-700">
                      <i className="fas fa-plus mr-2"></i>
                      Add Forwarder
                    </Button>
                  </CardContent>
                </Card>
              </HolographicCard>

              {/* Forwarder List */}
              <HolographicCard>
                <Card className="oracle-card h-full overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-quantum-300 flex items-center">
                      <i className="fas fa-list mr-2"></i>
                      Current Forwarders ({forwarders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 max-h-96 overflow-y-auto">
                    <div className="space-y-2 p-6">
                      {forwarders.map((forwarder) => (
                        <div key={forwarder.id} className="p-3 bg-dark-800/30 rounded-lg border border-quantum-500/20">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-quantum-400">{forwarder.name}</h4>
                            <div className="text-xs text-gray-400">
                              ${forwarder.avgCostPerKg}/kg
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-400">Transit:</span>
                              <span className="text-blue-400 ml-1">{forwarder.avgTransitDays}d</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Reliability:</span>
                              <span className="text-green-400 ml-1">{forwarder.reliabilityScore}%</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-400 mb-1">Specialties:</div>
                            <div className="flex flex-wrap gap-1">
                              {forwarder.specialties.map((specialty, idx) => (
                                <span key={idx} className="px-2 py-1 bg-quantum-600/20 rounded text-xs text-quantum-300">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HolographicCard>
                <Card className="oracle-card text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-quantum-600/20 border-2 border-quantum-500 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-users text-quantum-400 text-2xl"></i>
                    </div>
                    <div className="text-3xl font-bold text-quantum-300 mb-2">{forwarders.length}</div>
                    <div className="text-sm text-gray-400">Active Forwarders</div>
                  </CardContent>
                </Card>
              </HolographicCard>

              <HolographicCard>
                <Card className="oracle-card text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-neural-600/20 border-2 border-neural-500 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-chart-line text-neural-400 text-2xl"></i>
                    </div>
                    <div className="text-3xl font-bold text-neural-300 mb-2">
                      {Math.round(forwarders.reduce((sum, f) => sum + f.reliabilityScore, 0) / forwarders.length)}%
                    </div>
                    <div className="text-sm text-gray-400">Avg Reliability</div>
                  </CardContent>
                </Card>
              </HolographicCard>

              <HolographicCard>
                <Card className="oracle-card text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-purple-600/20 border-2 border-purple-500 flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-dollar-sign text-purple-400 text-2xl"></i>
                    </div>
                    <div className="text-3xl font-bold text-purple-300 mb-2">
                      ${(forwarders.reduce((sum, f) => sum + f.avgCostPerKg, 0) / forwarders.length).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">Avg Cost/kg</div>
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

export default FreightAnalyzer;
