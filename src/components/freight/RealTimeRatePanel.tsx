
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface ForwarderRate {
  name: string;
  baseRate: number;
  volumeDiscount: number;
  fuelSurcharge: number;
  customs: number;
  insurance: number;
  confidence: 'High' | 'Good' | 'Medium' | 'Low';
  seasonalAdjustment?: number;
}

interface RealTimeRatePanelProps {
  route: string;
  onRateUpdate?: (rates: ForwarderRate[]) => void;
}

export const RealTimeRatePanel = ({ route, onRateUpdate }: RealTimeRatePanelProps) => {
  const [rates, setRates] = useState<ForwarderRate[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time rates data based on your specifications
  const kenyaZambiaRates: ForwarderRate[] = [
    {
      name: 'Siginon',
      baseRate: 3.28,
      volumeDiscount: 3.94,
      fuelSurcharge: 0.53,
      customs: 0.05,
      insurance: 0.08,
      confidence: 'High'
    },
    {
      name: 'Bwosi',
      baseRate: 3.48,
      volumeDiscount: 4.32,
      fuelSurcharge: 0.70,
      customs: 0.05,
      insurance: 0.09,
      confidence: 'High'
    },
    {
      name: 'Freight In Time',
      baseRate: 3.57,
      volumeDiscount: 4.46,
      fuelSurcharge: 0.74,
      customs: 0.05,
      insurance: 0.09,
      confidence: 'High',
      seasonalAdjustment: -0.13
    },
    {
      name: 'Scan Global Logistics',
      baseRate: 3.53,
      volumeDiscount: 4.54,
      fuelSurcharge: 0.86,
      customs: 0.05,
      insurance: 0.09,
      confidence: 'High'
    },
    {
      name: 'Kuehne Nagel',
      baseRate: 3.89,
      volumeDiscount: 4.76,
      fuelSurcharge: 0.73,
      customs: 0.05,
      insurance: 0.10,
      confidence: 'High',
      seasonalAdjustment: -0.11
    },
    {
      name: 'AGL',
      baseRate: 3.86,
      volumeDiscount: 4.84,
      fuelSurcharge: 0.83,
      customs: 0.05,
      insurance: 0.10,
      confidence: 'High'
    },
    {
      name: 'DHL Global',
      baseRate: 4.83,
      volumeDiscount: 6.23,
      fuelSurcharge: 1.22,
      customs: 0.05,
      insurance: 0.12,
      confidence: 'High',
      seasonalAdjustment: 0.13
    },
    {
      name: 'DHL Express',
      baseRate: 5.61,
      volumeDiscount: 6.90,
      fuelSurcharge: 1.11,
      customs: 0.05,
      insurance: 0.14,
      confidence: 'Good'
    }
  ];

  const refreshRates = async () => {
    setIsRefreshing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add small random variations to simulate real-time updates
    const updatedRates = kenyaZambiaRates.map(rate => ({
      ...rate,
      baseRate: rate.baseRate + (Math.random() - 0.5) * 0.1,
      fuelSurcharge: rate.fuelSurcharge + (Math.random() - 0.5) * 0.05
    }));
    
    setRates(updatedRates);
    setLastUpdate(new Date());
    onRateUpdate?.(updatedRates);
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshRates();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshRates, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTotalRate = (rate: ForwarderRate) => {
    const baseTotal = rate.volumeDiscount + rate.fuelSurcharge + rate.customs + rate.insurance;
    return baseTotal + (rate.seasonalAdjustment || 0);
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-deepcal-light flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Real-Time Rate Integration
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={refreshRates}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="flex items-center text-sm">
              <span className="text-slate-400 mr-2">Auto:</span>
              <span className={autoRefresh ? 'text-green-400' : 'text-red-400'}>
                {autoRefresh ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          Last updated: {lastUpdate.toLocaleTimeString()} • Route: {route}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rates.map((rate, index) => (
            <div 
              key={rate.name}
              className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-deepcal-light/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded text-xs border ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    index <= 2 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{rate.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">Base: ${rate.baseRate.toFixed(2)}/kg</span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-900/30 text-blue-300">
                        Volume Discount
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    ${getTotalRate(rate).toFixed(2)}/kg
                  </div>
                  <div className={`text-sm font-medium ${getConfidenceColor(rate.confidence)}`}>
                    {rate.confidence}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Fuel Surcharge</div>
                  <div className="font-semibold text-orange-300">${rate.fuelSurcharge.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Customs</div>
                  <div className="font-semibold text-blue-300">${rate.customs.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Insurance</div>
                  <div className="font-semibold text-purple-300">${rate.insurance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Confidence</div>
                  <div className={`font-semibold ${getConfidenceColor(rate.confidence)}`}>
                    {rate.confidence}
                  </div>
                </div>
                {rate.seasonalAdjustment && (
                  <div>
                    <div className="text-slate-400">Seasonal</div>
                    <div className={`font-semibold ${rate.seasonalAdjustment > 0 ? 'text-red-300' : 'text-green-300'}`}>
                      {rate.seasonalAdjustment > 0 ? '+' : ''}${rate.seasonalAdjustment.toFixed(2)}/kg
                    </div>
                  </div>
                )}
              </div>

              {rate.seasonalAdjustment && (
                <div className="mt-3 p-2 bg-slate-900/50 rounded border border-slate-600/30 flex items-center">
                  <TrendingUp className="w-4 h-4 text-deepcal-light mr-2" />
                  <span className="text-xs text-slate-300">
                    Seasonal adjustment: {rate.seasonalAdjustment > 0 ? '+' : ''}${rate.seasonalAdjustment.toFixed(2)}/kg
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
