
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Play, Pause } from 'lucide-react';

interface OracleGradioEmbedProps {
  gradioUrl?: string;
  className?: string;
}

export const OracleGradioEmbed = ({ 
  gradioUrl = "http://localhost:7860", 
  className = "" 
}: OracleGradioEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setIsConnected(true);
  };

  const openInNewTab = () => {
    window.open(gradioUrl, '_blank');
  };

  return (
    <Card className={`oracle-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-deepcal-light flex items-center">
            🔮 Quantum Oracle Engine
            <Badge className="ml-2 bg-deepcal-purple/20 text-deepcal-light border-deepcal-purple/30">
              {isConnected ? "ACTIVE" : "CONNECTING"}
            </Badge>
          </CardTitle>
          <button
            onClick={openInNewTab}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative w-full h-[800px] rounded-lg overflow-hidden border border-deepcal-purple/30">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-deepcal-purple to-deepcal-light flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-white opacity-80"></div>
                </div>
                <p className="text-deepcal-light font-medium">Awakening Oracle...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting to Gradio service</p>
              </div>
            </div>
          )}
          
          <iframe
            src={`${gradioUrl}?__theme=dark`}
            width="100%"
            height="100%"
            frameBorder={0}
            title="DeepCAL++ Quantum Oracle Engine"
            allow="clipboard-write; microphone"
            onLoad={handleIframeLoad}
            className="bg-transparent"
          />
        </div>
      </CardContent>
    </Card>
  );
};
