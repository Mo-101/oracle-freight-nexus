
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ForwarderIntelligence, DynamicRankingConfig } from '@/types/freight';
import { dynamicRankingEngine } from '@/utils/dynamicRankingEngine';
import { RefreshCw, TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';

interface RealTimeRankingPanelProps {
  forwarders: ForwarderIntelligence[];
  onRankingUpdate: (rankedForwarders: ForwarderIntelligence[]) => void;
}

export const RealTimeRankingPanel = ({ forwarders, onRankingUpdate }: RealTimeRankingPanelProps) => {
  const [config, setConfig] = useState<DynamicRankingConfig>(dynamicRankingEngine.getDefaultConfig());
  const [rankedForwarders, setRankedForwarders] = useState<ForwarderIntelligence[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const presets = dynamicRankingEngine.getPresetConfigs();

  const performRanking = async () => {
    setIsRefreshing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const ranked = dynamicRankingEngine.rankForwarders(forwarders, config);
    setRankedForwarders(ranked);
    setLastUpdate(new Date());
    onRankingUpdate(ranked);
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    performRanking();
  }, [forwarders, config]);

  const handlePresetChange = (presetName: string) => {
    const presetConfig = presets[presetName as keyof typeof presets];
    if (presetConfig) {
      setConfig(presetConfig);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (rank <= 3) return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-deepcal-light flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Real-Time Forwarder Ranking
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ranking Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="costOptimized">Cost Optimized</SelectItem>
                <SelectItem value="timeOptimized">Time Optimized</SelectItem>
                <SelectItem value="emergency">Emergency Mode</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={performRanking}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </Button>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          Last updated: {lastUpdate.toLocaleTimeString()} • 
          Showing live rates and dynamic scoring
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankedForwarders.map((forwarder) => (
            <div 
              key={forwarder.name}
              className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Badge className={getRankBadgeColor(forwarder.rankPosition || 0)}>
                    #{forwarder.rankPosition}
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white">{forwarder.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getScoreColor(forwarder.dynamicScore || 0)}`}>
                        {((forwarder.dynamicScore || 0) * 100).toFixed(1)}%
                      </span>
                      <span className="text-xs text-slate-400">Dynamic Score</span>
                    </div>
                  </div>
                </div>
                {forwarder.realTimeRate && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">
                      ${forwarder.realTimeRate.totalRate}/kg
                    </div>
                    <div className="text-xs text-slate-400">
                      Valid until {new Date(forwarder.realTimeRate.validUntil).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-400 mr-2" />
                  <div>
                    <div className="text-slate-400">Base Rate</div>
                    <div className="font-semibold">${forwarder.realTimeRate?.baseRate || forwarder.avgCostPerKg}/kg</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-400 mr-2" />
                  <div>
                    <div className="text-slate-400">Transit</div>
                    <div className="font-semibold">{forwarder.avgTransitDays} days</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-purple-400 mr-2" />
                  <div>
                    <div className="text-slate-400">Reliability</div>
                    <div className="font-semibold">{forwarder.reliabilityScore}%</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-yellow-400 mr-2" />
                  <div>
                    <div className="text-slate-400">Success Rate</div>
                    <div className="font-semibold">{forwarder.successRate}%</div>
                  </div>
                </div>
              </div>

              {forwarder.realTimeRate && (
                <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-600/30">
                  <div className="text-xs text-slate-400 mb-2">Rate Breakdown:</div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                    <div>Fuel: ${forwarder.realTimeRate.fuelSurcharge}</div>
                    <div>Security: ${forwarder.realTimeRate.securityFee}</div>
                    <div>Handling: ${forwarder.realTimeRate.handlingFee}</div>
                    <div>Customs: ${forwarder.realTimeRate.customsFee}</div>
                    <div>Insurance: ${forwarder.realTimeRate.insuranceRate}</div>
                    <div className="font-semibold text-green-400">Total: ${forwarder.realTimeRate.totalRate}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
