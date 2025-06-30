
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, DollarSign } from 'lucide-react';

interface CompactRate {
  name: string;
  rate: number;
  trend: 'up' | 'down' | 'stable';
  confidence: 'High' | 'Good' | 'Medium';
}

export const CompactRealTimePanel = () => {
  const [rates, setRates] = useState<CompactRate[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const compactRates: CompactRate[] = [
    { name: 'Siginon', rate: 3.28, trend: 'down', confidence: 'High' },
    { name: 'Bwosi', rate: 3.48, trend: 'stable', confidence: 'High' },
    { name: 'Freight In Time', rate: 3.57, trend: 'up', confidence: 'High' },
    { name: 'Kuehne Nagel', rate: 3.89, trend: 'down', confidence: 'High' }
  ];

  const refreshRates = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedRates = compactRates.map(rate => ({
      ...rate,
      rate: rate.rate + (Math.random() - 0.5) * 0.1,
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
    }));
    
    setRates(updatedRates);
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshRates();
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-red-400';
    if (trend === 'down') return 'text-green-400';
    return 'text-slate-400';
  };

  return (
    <Card className="oracle-card mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-deepcal-light text-sm flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Live Rates
          </CardTitle>
          <Button
            onClick={refreshRates}
            disabled={isRefreshing}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-slate-400">
          Updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {(rates.length > 0 ? rates : compactRates).slice(0, 4).map((rate, index) => (
            <div 
              key={rate.name}
              className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-700/30"
            >
              <div className="flex items-center space-x-2">
                <div className={`text-xs px-1.5 py-0.5 rounded ${
                  index === 0 ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-300'
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <div className="text-xs font-medium text-white">{rate.name}</div>
                  <div className="text-xs text-slate-400">{rate.confidence}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-green-400">
                  ${rate.rate.toFixed(2)}
                </div>
                <div className={`text-xs ${getTrendColor(rate.trend)}`}>
                  {getTrendIcon(rate.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-2 border-t border-slate-700/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Kenya → Zambia</span>
            <span className="text-deepcal-light">Real-time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
