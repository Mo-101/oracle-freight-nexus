import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Cloud, RefreshCw, History, Search, TrendingUp } from 'lucide-react';
import { baseDataStore } from '@/services/baseDataStore';
import { supabaseDataService } from '@/services/supabaseDataService';
import { deepcalCore } from '@/utils/deepcalCore';

export const SupabaseIntegrationPanel = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [supabaseStats, setSupabaseStats] = useState({
    shipmentCount: 0,
    forwarderCount: 0,
    analysisCount: 0
  });

  useEffect(() => {
    checkConnectionStatus();
    loadAnalysisHistory();
    loadSupabaseStats();
  }, []);

  const checkConnectionStatus = async () => {
    const connected = baseDataStore.isSupabaseEnabled() && !baseDataStore.isSystemLocked();
    setIsConnected(connected);
    
    if (connected) {
      const version = baseDataStore.getDataVersion();
      if (version && version.source.includes('supabase')) {
        setLastSync(version.timestamp);
      }
    }
  };

  const loadAnalysisHistory = async () => {
    try {
      const history = await deepcalCore.getAnalysisHistory(5);
      setAnalysisHistory(history);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
  };

  const loadSupabaseStats = async () => {
    try {
      const shipments = await supabaseDataService.getAllShipments();
      const forwarders = await supabaseDataService.getForwarderPerformance();
      const analyses = await supabaseDataService.getAnalysisHistory(100);
      
      setSupabaseStats({
        shipmentCount: shipments.length,
        forwarderCount: forwarders.length,
        analysisCount: analyses.length
      });
    } catch (error) {
      console.error('Failed to load Supabase stats:', error);
    }
  };

  const handleSyncFromSupabase = async () => {
    setSyncStatus('syncing');
    try {
      const success = await baseDataStore.refreshFromSupabase();
      if (success) {
        setSyncStatus('success');
        setLastSync(new Date());
        await checkConnectionStatus();
        await loadSupabaseStats();
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
    }
    
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleIntelligentSearch = async () => {
    try {
      const recommendations = await deepcalCore.getIntelligentRecommendations(
        "express shipping from China to USA with high reliability",
        3
      );
      console.log('🔍 Intelligent recommendations:', recommendations);
      // You could display these in a modal or separate component
    } catch (error) {
      console.error('Intelligent search failed:', error);
    }
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Supabase Integration Status
          {isConnected ? (
            <Cloud className="w-4 h-4 ml-2 text-green-400" />
          ) : (
            <Cloud className="w-4 h-4 ml-2 text-red-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className={`p-4 rounded border-l-4 ${
          isConnected 
            ? 'bg-green-900/20 border-green-400 text-green-100' 
            : 'bg-yellow-900/20 border-yellow-400 text-yellow-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">
                {isConnected ? '🟢 Connected to Supabase' : '🟡 Supabase Available'}
              </div>
              <p className="text-sm mt-1">
                {isConnected 
                  ? 'Data is being persisted and enhanced with cloud analytics'
                  : 'Upload CSV data to activate persistent storage'
                }
              </p>
            </div>
            <Button
              onClick={handleSyncFromSupabase}
              disabled={syncStatus === 'syncing'}
              variant="outline"
              size="sm"
            >
              {syncStatus === 'syncing' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Sync
            </Button>
          </div>
        </div>

        {/* Stats */}
        {isConnected && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-800/50 rounded">
              <div className="text-2xl font-bold text-blue-400">{supabaseStats.shipmentCount}</div>
              <div className="text-xs text-slate-400">Shipments</div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded">
              <div className="text-2xl font-bold text-purple-400">{supabaseStats.forwarderCount}</div>
              <div className="text-xs text-slate-400">Forwarders</div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded">
              <div className="text-2xl font-bold text-green-400">{supabaseStats.analysisCount}</div>
              <div className="text-xs text-slate-400">Analyses</div>
            </div>
          </div>
        )}

        {/* Last Sync */}
        {lastSync && (
          <div className="text-sm text-slate-400">
            Last sync: {lastSync.toLocaleString()}
          </div>
        )}

        {/* Enhanced Features */}
        {isConnected && (
          <div className="space-y-2">
            <h4 className="font-semibold text-deepcal-light">Enhanced Features</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleIntelligentSearch}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Search className="w-3 h-3 mr-1" />
                AI Recommendations
              </Button>
              <Button
                onClick={loadAnalysisHistory}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <History className="w-3 h-3 mr-1" />
                Analysis History
              </Button>
              <Button
                onClick={loadSupabaseStats}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Performance Metrics
              </Button>
            </div>
          </div>
        )}

        {/* Recent Analysis History */}
        {analysisHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-deepcal-light">Recent Analyses</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {analysisHistory.map((analysis, index) => (
                <div key={analysis.id} className="text-xs bg-slate-800/30 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-deepcal-light">
                      {analysis.forwarders_analyzed?.slice(0, 2).join(', ')}
                      {analysis.forwarders_analyzed?.length > 2 && '...'}
                    </span>
                    <span className="text-slate-400">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    CR: {analysis.consistency_ratio.toFixed(3)} 
                    {analysis.is_consistent ? ' ✅' : ' ❌'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Info */}
        <div className="bg-slate-800/30 p-3 rounded text-xs text-slate-400">
          <p className="font-semibold mb-2">🚀 Supabase Integration Benefits:</p>
          <ul className="space-y-1">
            <li>• Persistent data storage across sessions</li>
            <li>• AI-powered semantic similarity search</li>
            <li>• Automatic forwarder performance tracking</li>
            <li>• Analysis history and audit trails</li>
            <li>• Real-time collaborative analytics</li>
            <li>• Scalable cloud infrastructure</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
