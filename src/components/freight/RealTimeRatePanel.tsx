import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, TrendingUp, TrendingDown, Clock, Zap, Database, AlertCircle } from 'lucide-react';
import { realRateService } from '@/services/realRateService';

interface ForwarderRate {
  name: string;
  baseRate: number;
  volumeDiscount: number;
  fuelSurcharge: number;
  customs: number;
  insurance: number;
  confidence: string;
  seasonalAdjustment?: number;
  source?: string;
  lastUpdated?: Date;
}

interface RealTimeRatePanelProps {
  route: { origin: string; destination: string };
  onRateUpdate?: (rates: ForwarderRate[]) => void;
}

export function RealTimeRatePanel({ route, onRateUpdate }: RealTimeRatePanelProps) {
  const [rates, setRates] = useState<ForwarderRate[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  const refreshRates = async () => {
    setIsRefreshing(true);
    
    try {
      // Get real rates from canonical data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const forwarders = [
        'Kuehne Nagel',
        'Scan Global Logistics',
        'DHL Express', 
        'DHL Global',
        'BWOSI',
        'AGL',
        'Siginon',
        'Freight in Time'
      ];

      const newRates: ForwarderRate[] = forwarders.map(forwarder => {
        const realRate = realRateService.generateRealTimeRate(forwarder, route.origin, route.destination, 1000);
        const metrics = realRateService.getRouteMetrics(route.origin, route.destination, forwarder);
        
        return {
          name: forwarder,
          baseRate: realRate.baseRate / 1000, // Convert to per kg
          volumeDiscount: 0.1 + Math.random() * 0.1,
          fuelSurcharge: realRate.fuelSurcharge / realRate.baseRate,
          customs: realRate.customsFee / realRate.baseRate,
          insurance: realRate.insuranceRate / realRate.baseRate,
          confidence: typeof realRate.confidence === 'number' ? 
            (realRate.confidence > 80 ? 'High' : realRate.confidence > 50 ? 'Medium' : 'Low') :
            realRate.confidence || 'Medium',
          source: realRate.source,
          lastUpdated: realRate.lastUpdated
        };
      });
      
      setRates(newRates);
      setLastUpdate(new Date());
      onRateUpdate?.(newRates);
    } catch (error) {
      console.error('Failed to refresh rates:', error);
    }
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshRates();
  }, [route.origin, route.destination]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshRates, 60000); // 1 minute intervals
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getConfidenceColor = (confidence: string): string => {
    switch (confidence) {
      case 'High': return 'border-green-500 text-green-600';
      case 'Medium': return 'border-yellow-500 text-yellow-600';
      case 'Low': return 'border-red-500 text-red-600';
      default: return 'border-gray-500 text-gray-600';
    }
  };

  const getTotalRate = (rate: ForwarderRate): number => {
    return rate.baseRate * (1 + rate.fuelSurcharge + rate.customs + rate.insurance);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Freight Rate Intelligence
              </CardTitle>
              <CardDescription>
                Data-driven rates for {route.origin} → {route.destination}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={refreshRates}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant="ghost"
              size="sm"
              className="h-auto p-1"
            >
              <Badge variant={autoRefresh ? "default" : "outline"}>
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </Badge>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {rates.map((rate, index) => (
              <div key={rate.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{rate.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${getTotalRate(rate).toFixed(2)}/kg
                      </p>
                      {rate.source && (
                        <div className="flex items-center gap-1 mt-1">
                          {rate.source === 'historical_data' ? (
                            <Database className="w-3 h-3 text-green-600" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {rate.source === 'historical_data' ? 'Historical Data' : 'Estimated'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className={getConfidenceColor(rate.confidence)}
                      >
                        {rate.confidence}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Base Rate</div>
                      <div className="font-medium">${rate.baseRate.toFixed(2)}/kg</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Fuel Surcharge</div>
                      <div className="font-medium">{(rate.fuelSurcharge * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Customs</div>
                      <div className="font-medium">{(rate.customs * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Insurance</div>
                      <div className="font-medium">{(rate.insurance * 100).toFixed(1)}%</div>
                    </div>
                  </div>

                  {rate.seasonalAdjustment && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                      {rate.seasonalAdjustment > 0 ? (
                        <TrendingUp className="w-4 h-4 text-red-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-500" />
                      )}
                      <span>
                        Seasonal adjustment: {rate.seasonalAdjustment > 0 ? '+' : ''}
                        {(rate.seasonalAdjustment * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}