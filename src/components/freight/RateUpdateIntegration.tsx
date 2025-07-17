import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickRateUpdatePanel } from './QuickRateUpdatePanel';
import { RealTimeRatePanel } from './RealTimeRatePanel';
import { realRateService } from '@/services/realRateService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Database, Plus, Activity } from 'lucide-react';

interface RateUpdateIntegrationProps {
  route: { origin: string; destination: string };
  onSystemUpdate?: () => void;
}

export function RateUpdateIntegration({ route, onSystemUpdate }: RateUpdateIntegrationProps) {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const handleRateUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    onSystemUpdate?.();
  };

  const dataFreshness = realRateService.getDataFreshness();
  const availableForwarders = realRateService.getForwardersForRoute(route.origin, route.destination);

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Real Rate System Status
          </CardTitle>
          <CardDescription>
            System ready to receive real rates based on canonical data foundation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <Database className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">{dataFreshness.totalRoutes}</div>
              <div className="text-xs text-muted-foreground">Active Routes</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">{dataFreshness.totalForwarders}</div>
              <div className="text-xs text-muted-foreground">Forwarders</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Plus className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">{availableForwarders.length}</div>
              <div className="text-xs text-muted-foreground">This Route</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Badge variant="outline" className="w-full">
                {dataFreshness.lastRefresh.toLocaleDateString()}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">Last Refresh</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Management Interface */}
      <Tabs defaultValue="current-rates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current-rates">Current Rates</TabsTrigger>
          <TabsTrigger value="update-rates">Update Rates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current-rates" className="space-y-4">
          <RealTimeRatePanel 
            key={refreshTrigger}
            route={route}
            onRateUpdate={handleRateUpdate}
          />
        </TabsContent>
        
        <TabsContent value="update-rates" className="space-y-4">
          <QuickRateUpdatePanel onRateUpdated={handleRateUpdate} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate Update Instructions</CardTitle>
              <CardDescription>
                How to input real market rates into the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">1. Select Forwarder & Route</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose the forwarder and destination from the dropdowns. Use "Custom" to add new forwarders.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">2. Set Market Adjustment</h4>
                  <p className="text-sm text-muted-foreground">
                    Enter the current market rate as a factor of historical data:
                    • 1.0 = Same as historical average
                    • 1.2 = 20% higher than historical
                    • 0.8 = 20% lower than historical
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">3. System Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Updated rates immediately flow into DeepCAL ranking engine and decision matrices.
                    Historical data remains intact as the foundation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}