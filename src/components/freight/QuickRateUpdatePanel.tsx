import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { realRateService } from '@/services/realRateService';
import { useToast } from '@/hooks/use-toast';
import { Plus, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface QuickRateUpdatePanelProps {
  onRateUpdated?: () => void;
}

export function QuickRateUpdatePanel({ onRateUpdated }: QuickRateUpdatePanelProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    forwarder: '',
    origin: 'Kenya',
    destination: '',
    adjustmentFactor: '1.0',
    customForwarder: ''
  });

  const forwarders = [
    'Kuehne Nagel',
    'Scan Global Logistics', 
    'DHL Express',
    'DHL Global',
    'BWOSI',
    'AGL',
    'Siginon',
    'Freight in Time',
    'Custom'
  ];

  const destinations = realRateService.getAvailableRoutes()
    .map(route => route.split('-')[1])
    .filter((dest, index, arr) => arr.indexOf(dest) === index);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const forwarderName = formData.forwarder === 'Custom' ? formData.customForwarder : formData.forwarder;
    const factor = parseFloat(formData.adjustmentFactor);
    
    if (!forwarderName || !formData.destination || isNaN(factor)) {
      toast({
        title: "Invalid Input",
        description: "Please fill all required fields with valid data.",
        variant: "destructive"
      });
      return;
    }

    realRateService.updateMarketRate(
      forwarderName,
      formData.origin,
      formData.destination,
      factor,
      'user_input'
    );

    toast({
      title: "Rate Updated",
      description: `Market rate for ${forwarderName} on ${formData.origin}-${formData.destination} updated to ${factor}x`,
    });

    onRateUpdated?.();
    
    // Reset form
    setFormData({
      ...formData,
      adjustmentFactor: '1.0',
      customForwarder: ''
    });
  };

  const getAdjustmentBadge = (factor: string) => {
    const num = parseFloat(factor);
    if (isNaN(num)) return null;
    
    if (num > 1.1) return <Badge variant="destructive" className="ml-2"><TrendingUp className="w-3 h-3 mr-1" />Higher</Badge>;
    if (num < 0.9) return <Badge variant="secondary" className="ml-2"><TrendingDown className="w-3 h-3 mr-1" />Lower</Badge>;
    return <Badge variant="outline" className="ml-2">Market Rate</Badge>;
  };

  const dataFreshness = realRateService.getDataFreshness();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Quick Rate Update
        </CardTitle>
        <CardDescription>
          Update current market rates to override historical data
        </CardDescription>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Last refresh: {dataFreshness.lastRefresh.toLocaleDateString()}
          </div>
          <Badge variant="outline">{dataFreshness.totalRoutes} routes</Badge>
          <Badge variant="outline">{dataFreshness.totalForwarders} forwarders</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="forwarder">Forwarder</Label>
              <Select value={formData.forwarder} onValueChange={(value) => setFormData({...formData, forwarder: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select forwarder" />
                </SelectTrigger>
                <SelectContent>
                  {forwarders.map(forwarder => (
                    <SelectItem key={forwarder} value={forwarder}>{forwarder}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map(dest => (
                    <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.forwarder === 'Custom' && (
            <div className="space-y-2">
              <Label htmlFor="customForwarder">Custom Forwarder Name</Label>
              <Input
                id="customForwarder"
                value={formData.customForwarder}
                onChange={(e) => setFormData({...formData, customForwarder: e.target.value})}
                placeholder="Enter forwarder name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="adjustmentFactor" className="flex items-center">
              Market Adjustment Factor
              {getAdjustmentBadge(formData.adjustmentFactor)}
            </Label>
            <Input
              id="adjustmentFactor"
              type="number"
              step="0.1"
              min="0.1"
              max="5.0"
              value={formData.adjustmentFactor}
              onChange={(e) => setFormData({...formData, adjustmentFactor: e.target.value})}
              placeholder="1.0 = no change, 1.2 = 20% higher, 0.8 = 20% lower"
            />
            <p className="text-xs text-muted-foreground">
              1.0 = Market rate, &gt;1.0 = Higher than historical, &lt;1.0 = Lower than historical
            </p>
          </div>

          <Separator />

          <Button type="submit" className="w-full">
            Update Market Rate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}