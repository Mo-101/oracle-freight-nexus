
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp } from 'lucide-react';

interface DeepCALCoreProps {
  isActive?: boolean;
  confidence?: number;
  lastUpdate?: Date;
}

export const DeepCALCore: React.FC<DeepCALCoreProps> = ({
  isActive = true,
  confidence = 0.85,
  lastUpdate = new Date()
}) => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          DeepCAL Core System
          <Badge variant={isActive ? "default" : "secondary"} className="ml-auto">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Advanced cognitive analytics engine for freight logistics optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">Confidence</div>
              <div className="text-lg font-bold text-green-600">
                {Math.round(confidence * 100)}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium">Last Update</div>
              <div className="text-sm font-mono">
                {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepCALCore;
