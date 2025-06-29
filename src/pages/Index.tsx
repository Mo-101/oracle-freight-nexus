import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import InputPanel from '../components/InputPanel';
import OutputPanel from '../components/OutputPanel';
import Footer from '../components/Footer';
import { PredictiveTimeline } from '../components/analytics/PredictiveTimeline';

interface FormData {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cargoType: string;
  selectedForwarders: string[];
}

interface ForwarderRanking {
  name: string;
  transitDays: number;
  cost: number;
  risk: number;
  score: number;
  rank: number;
}

// Historical shipment data simulation
const historicalData = [
  { origin: "Nairobi, Kenya", destination: "Lusaka, Zambia", weight_kg: 7850, volume_cbm: 24.5, forwarder: "Kuehne + Nagel", transit_days: 5.2, cost_usd: 36189.50, on_time: true },
  { origin: "Nairobi, Kenya", destination: "Lusaka, Zambia", weight_kg: 6500, volume_cbm: 20.8, forwarder: "DHL Global Forwarding", transit_days: 6.0, cost_usd: 33865.00, on_time: true },
  { origin: "Nairobi, Kenya", destination: "Lusaka, Zambia", weight_kg: 5200, volume_cbm: 18.2, forwarder: "Siginon Logistics", transit_days: 6.5, cost_usd: 23140.00, on_time: false },
];

const Index = () => {
  const [showOutput, setShowOutput] = useState(false);
  const [rankings, setRankings] = useState<ForwarderRanking[]>([]);
  const [formData, setFormData] = useState<FormData>({
    origin: 'Nairobi, Kenya',
    destination: 'Lusaka, Zambia',
    weight: 7850,
    volume: 24.5,
    cargoType: 'Emergency Health Kits',
    selectedForwarders: ['Kuehne + Nagel', 'DHL Global Forwarding', 'Siginon Logistics']
  });

  // Calculate KPIs for forwarders
  const calculateForwarderKPIs = (data: any[], forwarders: string[]) => {
    const results: any = {};
    forwarders.forEach(f => {
      const forwarderData = data.filter(d => d.forwarder === f);
      if (forwarderData.length > 0) {
        const totalShipments = forwarderData.length;
        const totalWeight = forwarderData.reduce((sum, d) => sum + d.weight_kg, 0);
        const avgTransitDays = forwarderData.reduce((sum, d) => sum + d.transit_days, 0) / totalShipments;
        const avgCost = forwarderData.reduce((sum, d) => sum + d.cost_usd, 0) / totalShipments;
        const onTimeRate = forwarderData.filter(d => d.on_time).length / totalShipments;
        const costPerKg = avgCost / (totalWeight / totalShipments);
        
        results[f] = { totalShipments, avgTransitDays, avgCost, onTimeRate, costPerKg };
      } else {
        // Default values for forwarders without historical data
        results[f] = {
          totalShipments: 1,
          avgTransitDays: 7 + Math.random() * 3,
          avgCost: 30000 + Math.random() * 15000,
          onTimeRate: 0.7 + Math.random() * 0.3,
          costPerKg: 4 + Math.random() * 2
        };
      }
    });
    return results;
  };

  // Normalize values between 0-1
  const normalize = (value: number, min: number, max: number) => {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  };

  // Rank forwarders using TOPSIS-like scoring
  const rankForwarders = (kpis: any) => {
    return Object.entries(kpis).map(([name, data]: [string, any]) => ({
      name,
      transitDays: data.avgTransitDays,
      cost: data.costPerKg,
      risk: Math.round((1 - data.onTimeRate) * 100),
      score: (
        0.68 * (1 - normalize(data.avgTransitDays, 4, 8)) +
        0.45 * (1 - normalize(data.costPerKg, 4, 7)) +
        0.22 * normalize(data.onTimeRate, 0.7, 1)
      )
    }))
    .sort((a, b) => b.score - a.score)
    .map((forwarder, index) => ({
      ...forwarder,
      rank: index + 1,
      transitDays: Number(forwarder.transitDays.toFixed(1)),
      cost: Number(forwarder.cost.toFixed(2)),
      score: Number(forwarder.score.toFixed(2))
    }));
  };

  const handleOracleAwaken = () => {
    console.log('Oracle awakening with data:', formData);
    
    // Filter historical data for this route
    const routeData = historicalData.filter(d => 
      d.origin === formData.origin && d.destination === formData.destination
    );
    
    // Calculate KPIs
    const kpis = calculateForwarderKPIs(routeData, formData.selectedForwarders);
    const ranked = rankForwarders(kpis);
    
    console.log('Calculated rankings:', ranked);
    
    setRankings(ranked);
    setShowOutput(true);
    
    // Smooth scroll to output after a brief delay
    setTimeout(() => {
      const outputElement = document.getElementById('outputPanel');
      if (outputElement) {
        outputElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  useEffect(() => {
    // Initialize animations
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.oracle-card, header');
      elements.forEach(el => {
        el.classList.add('animate-fade-in');
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <InputPanel 
              onOracleAwaken={handleOracleAwaken}
              formData={formData}
              onFormChange={setFormData}
            />
            
            <OutputPanel 
              isVisible={showOutput}
              rankings={rankings}
              formData={formData}
            />
          </div>
          
          {/* Add Predictive Timeline when output is shown */}
          {showOutput && (
            <div className="mt-8">
              <PredictiveTimeline />
            </div>
          )}
          
          {showOutput && (
            <div className="mt-6 text-center text-sm text-slate-400">
              DeepCAL++ vΩ • Symbolic Logistical Intelligence Engine • First Transmission: {new Date().toISOString().split('T')[0]}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
