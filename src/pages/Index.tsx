
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HolographicCard from '@/components/HolographicCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

// Sample data based on the provided shipment data
const shipmentData = [
  {
    id: "SR_24-001",
    origin: "Kenya",
    destination: "Zimbabwe",
    cargo: "Cholera kits and Tents",
    category: "Emergency Health Kits",
    weight: 7352.98,
    volume: 24.68,
    cost: 18681,
    forwarder: "Kuehne Nagel",
    carrier: "Kenya Airways",
    mode: "Air",
    transit_days: 6,
    status: "Delivered",
    efficiency_score: 0.892
  },
  {
    id: "SR_24-002",
    origin: "Kenya",
    destination: "Zambia",
    cargo: "Cholera kits ORS Body bags Masks and Glucometers",
    category: "Emergency Health Kits",
    weight: 14397.00,
    volume: 50.88,
    cost: 59500,
    forwarder: "Kuehne Nagel",
    carrier: "Kenya Airways",
    mode: "Air",
    transit_days: 324,
    status: "Delivered",
    efficiency_score: 0.845
  },
  {
    id: "SR_24-004",
    origin: "Kenya",
    destination: "Zambia",
    cargo: "Tents Gloves PPEs and Drugs",
    category: "Field Support Material",
    weight: 10168.00,
    volume: 59.02,
    cost: 56800,
    forwarder: "KQ:Direct charter",
    carrier: "KQ:Direct charter",
    mode: "Air",
    transit_days: 120,
    status: "Delivered",
    efficiency_score: 0.712
  },
  {
    id: "SR_24-027",
    origin: "Kenya",
    destination: "Zambia",
    cargo: "Cholera kits IEHK Kits and Tents",
    category: "Emergency Health Kits",
    weight: 10113.91,
    volume: 40.67,
    cost: 30803,
    forwarder: "Kuehne Nagel",
    carrier: "Kuehne Nagel",
    mode: "Air",
    transit_days: 43,
    status: "Delivered",
    efficiency_score: 0.756
  },
  {
    id: "SR_24-048",
    origin: "Kenya",
    destination: "Ethiopia",
    cargo: "Cholera kits ORS and Ringer Lactate",
    category: "Emergency Health Kits",
    weight: 48092.00,
    volume: 134.06,
    cost: 140909,
    forwarder: "Freight In Time",
    carrier: "Freight In Time",
    mode: "Air",
    transit_days: 6,
    status: "Delivered",
    efficiency_score: 0.923
  }
];

interface DestinationStats {
  country: string;
  shipments: number;
  totalCost: number;
  avgCost: number;
  totalWeight: number;
}

interface ForwarderPerformance {
  forwarder: string;
  shipments: number;
  avgCost: number;
  avgEfficiency: number;
  avgTransit: number;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredData = useMemo(() => {
    return shipmentData.filter(item => {
      const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.cargo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter]);

  const analyticsData = useMemo(() => {
    const totalShipments = shipmentData.length;
    const totalWeight = shipmentData.reduce((sum, item) => sum + item.weight, 0);
    const totalCost = shipmentData.reduce((sum, item) => sum + item.cost, 0);
    const avgTransitTime = shipmentData.reduce((sum, item) => sum + item.transit_days, 0) / totalShipments;
    const avgEfficiency = shipmentData.reduce((sum, item) => sum + item.efficiency_score, 0) / totalShipments;

    return {
      totalShipments,
      totalWeight: Math.round(totalWeight),
      totalCost: Math.round(totalCost),
      avgTransitTime: Math.round(avgTransitTime),
      avgEfficiency: Math.round(avgEfficiency * 100)
    };
  }, []);

  const destinationStats = useMemo(() => {
    const stats: { [key: string]: { count: number; totalCost: number; totalWeight: number } } = {};
    
    shipmentData.forEach(item => {
      if (!stats[item.destination]) {
        stats[item.destination] = { count: 0, totalCost: 0, totalWeight: 0 };
      }
      stats[item.destination].count++;
      stats[item.destination].totalCost += item.cost;
      stats[item.destination].totalWeight += item.weight;
    });
    
    return Object.entries(stats).map(([country, data]): DestinationStats => ({
      country,
      shipments: data.count,
      totalCost: data.totalCost,
      avgCost: Math.round(data.totalCost / data.count),
      totalWeight: Math.round(data.totalWeight)
    }));
  }, []);

  const forwarderPerformance = useMemo(() => {
    const performance: { [key: string]: { shipments: number; totalCost: number; totalEfficiency: number; avgTransit: number } } = {};
    
    shipmentData.forEach(item => {
      if (!performance[item.forwarder]) {
        performance[item.forwarder] = { 
          shipments: 0, 
          totalCost: 0, 
          totalEfficiency: 0,
          avgTransit: 0
        };
      }
      performance[item.forwarder].shipments++;
      performance[item.forwarder].totalCost += item.cost;
      performance[item.forwarder].totalEfficiency += item.efficiency_score;
      performance[item.forwarder].avgTransit += item.transit_days;
    });

    return Object.entries(performance).map(([forwarder, data]): ForwarderPerformance => ({
      forwarder,
      shipments: data.shipments,
      avgCost: Math.round(data.totalCost / data.shipments),
      avgEfficiency: Math.round((data.totalEfficiency / data.shipments) * 100),
      avgTransit: Math.round(data.avgTransit / data.shipments)
    }));
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen quantum-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <HolographicCard className="animate-float">
            <Card className="oracle-card h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-quantum-600 flex items-center justify-center mx-auto mb-3 quantum-ring">
                  <i className="fas fa-shipping-fast text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-quantum-300 mb-1">{analyticsData.totalShipments}</div>
                <div className="text-sm text-gray-400">Total Shipments</div>
              </CardContent>
            </Card>
          </HolographicCard>

          <HolographicCard className="animate-float-2">
            <Card className="oracle-card h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-neural-600 flex items-center justify-center mx-auto mb-3 quantum-ring">
                  <i className="fas fa-weight-hanging text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-neural-300 mb-1">{analyticsData.totalWeight.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Weight (kg)</div>
              </CardContent>
            </Card>
          </HolographicCard>

          <HolographicCard className="animate-float-3">
            <Card className="oracle-card h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3 quantum-ring">
                  <i className="fas fa-dollar-sign text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-purple-300 mb-1">${analyticsData.totalCost.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Cost</div>
              </CardContent>
            </Card>
          </HolographicCard>

          <HolographicCard className="animate-float-4">
            <Card className="oracle-card h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-3 quantum-ring">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-blue-300 mb-1">{analyticsData.avgTransitTime}d</div>
                <div className="text-sm text-gray-400">Avg Transit Time</div>
              </CardContent>
            </Card>
          </HolographicCard>

          <HolographicCard className="animate-float">
            <Card className="oracle-card h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-3 quantum-ring">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
                <div className="text-3xl font-bold text-green-300 mb-1">{analyticsData.avgEfficiency}%</div>
                <div className="text-sm text-gray-400">Avg Efficiency</div>
              </CardContent>
            </Card>
          </HolographicCard>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Destination Performance Chart */}
          <HolographicCard>
            <Card className="oracle-card h-full">
              <CardHeader>
                <CardTitle className="text-quantum-300 flex items-center">
                  <i className="fas fa-globe-africa mr-2"></i>
                  Shipments by Destination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={destinationStats}>
                    <CartesianGrid strokeDasharray="3,3" stroke="rgba(99, 102, 241, 0.1)" />
                    <XAxis dataKey="country" stroke="#a5b4fc" />
                    <YAxis stroke="#a5b4fc" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="shipments" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </HolographicCard>

          {/* Forwarder Performance */}
          <HolographicCard>
            <Card className="oracle-card h-full">
              <CardHeader>
                <CardTitle className="text-quantum-300 flex items-center">
                  <i className="fas fa-truck mr-2"></i>
                  Forwarder Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={forwarderPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ forwarder, percent }) => `${forwarder}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="shipments"
                    >
                      {forwarderPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </HolographicCard>
        </div>

        {/* AI Insight Panel */}
        <HolographicCard className="mb-8">
          <Card className="oracle-card">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple p-6 rounded-lg">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                        <i className="fas fa-brain text-xl text-white"></i>
                      </div>
                      <h2 className="text-xl font-bold text-white">DeepCAL++ AI Oracle</h2>
                    </div>
                    <p className="text-purple-200">Real-time logistics intelligence for quantum decision-making</p>
                  </div>
                  <Button className="bg-white text-deepcal-purple hover:bg-gray-100">
                    <i className="fas fa-robot mr-2"></i>
                    Generate Quantum Report
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg border border-white border-opacity-20">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">Neural Accuracy</h3>
                      <i className="fas fa-chart-line text-neural-300"></i>
                    </div>
                    <p className="text-2xl font-bold text-white">94.6%</p>
                    <div className="mt-2 text-sm text-purple-200">
                      <span className="text-neural-300"><i className="fas fa-arrow-up"></i> 2.3%</span> quantum boost
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg border border-white border-opacity-20">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">Disruption Oracle</h3>
                      <i className="fas fa-exclamation-triangle text-yellow-300"></i>
                    </div>
                    <p className="text-2xl font-bold text-white">Medium</p>
                    <div className="mt-2 text-sm text-purple-200">
                      12 routes under quantum analysis
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-10 p-4 rounded-lg border border-white border-opacity-20">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">Cost Optimization</h3>
                      <i className="fas fa-infinity text-quantum-300"></i>
                    </div>
                    <p className="text-2xl font-bold text-white">$24,500</p>
                    <div className="mt-2 text-sm text-purple-200">
                      Projected quantum savings
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </HolographicCard>

        {/* Search and Filter Controls */}
        <HolographicCard className="mb-6">
          <Card className="oracle-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="🔍 Search quantum shipments by ID, destination, or cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-dark-800/50 border-quantum-500/30 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedFilter('all')}
                    className="bg-quantum-600 hover:bg-quantum-700 border-quantum-500/30"
                  >
                    <i className="fas fa-layer-group mr-1"></i>
                    All Categories
                  </Button>
                  <Button
                    variant={selectedFilter === 'Emergency Health Kits' ? 'default' : 'outline'}
                    onClick={() => setSelectedFilter('Emergency Health Kits')}
                    className="bg-neural-600 hover:bg-neural-700 border-neural-500/30"
                  >
                    <i className="fas fa-briefcase-medical mr-1"></i>
                    Health Kits
                  </Button>
                  <Button
                    variant={selectedFilter === 'Field Support Material' ? 'default' : 'outline'}
                    onClick={() => setSelectedFilter('Field Support Material')}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-500/30"
                  >
                    <i className="fas fa-tools mr-1"></i>
                    Field Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </HolographicCard>

        {/* Detailed Shipments Table */}
        <HolographicCard>
          <Card className="oracle-card">
            <CardHeader>
              <CardTitle className="text-quantum-300 flex items-center">
                <i className="fas fa-table mr-2"></i>
                Quantum Shipment Matrix ({filteredData.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-quantum-300">Shipment ID</TableHead>
                      <TableHead className="text-quantum-300">Route</TableHead>
                      <TableHead className="text-quantum-300">Cargo</TableHead>
                      <TableHead className="text-quantum-300">Weight (kg)</TableHead>
                      <TableHead className="text-quantum-300">Cost ($)</TableHead>
                      <TableHead className="text-quantum-300">Forwarder</TableHead>
                      <TableHead className="text-quantum-300">Transit Days</TableHead>
                      <TableHead className="text-quantum-300">Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((shipment) => (
                      <TableRow key={shipment.id} className="hover:bg-dark-800/30 border-dark-700/30">
                        <TableCell className="font-mono text-quantum-400">{shipment.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-300">{shipment.origin}</span>
                            <i className="fas fa-arrow-right mx-2 text-quantum-500"></i>
                            <span className="text-sm text-gray-300">{shipment.destination}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-300" title={shipment.cargo}>
                          {shipment.cargo}
                        </TableCell>
                        <TableCell className="text-neural-400">{shipment.weight.toLocaleString()}</TableCell>
                        <TableCell className="text-green-400">${shipment.cost.toLocaleString()}</TableCell>
                        <TableCell className="text-purple-400">{shipment.forwarder}</TableCell>
                        <TableCell className="text-blue-400">{shipment.transit_days}d</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-12 h-2 bg-dark-700 rounded-full mr-2">
                              <div 
                                className="h-full bg-gradient-to-r from-neural-500 to-quantum-500 rounded-full"
                                style={{ width: `${shipment.efficiency_score * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-quantum-300">{Math.round(shipment.efficiency_score * 100)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </HolographicCard>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <HolographicCard>
            <Card className="oracle-card h-full">
              <CardHeader>
                <CardTitle className="text-quantum-300 flex items-center">
                  <i className="fas fa-award mr-2"></i>
                  Carrier Quantum Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forwarderPerformance.map((carrier, index) => (
                    <div key={carrier.forwarder}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-300">{carrier.forwarder}</span>
                        <span className="text-sm text-quantum-300">{carrier.avgEfficiency}%</span>
                      </div>
                      <div className="w-full bg-dark-700 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-quantum-500 to-neural-500 h-2.5 rounded-full transition-all duration-1000" 
                          style={{ width: `${carrier.avgEfficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </HolographicCard>
          
          <HolographicCard>
            <Card className="oracle-card h-full">
              <CardHeader>
                <CardTitle className="text-quantum-300 flex items-center">
                  <i className="fas fa-globe mr-2"></i>
                  Regional Quantum Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={destinationStats}>
                    <CartesianGrid strokeDasharray="3,3" stroke="rgba(99, 102, 241, 0.1)" />
                    <XAxis dataKey="country" stroke="#a5b4fc" />
                    <YAxis stroke="#a5b4fc" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="avgCost" fill="url(#quantumGradient)" />
                    <defs>
                      <linearGradient id="quantumGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </HolographicCard>
        </div>
      </div>
    </div>
  );
};

export default Index;
