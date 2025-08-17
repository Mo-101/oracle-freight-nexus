
import React, { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

const Map = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Interactive Map</h1>
          
          <Suspense fallback={
            <div className="flex items-center justify-center h-96">
              <div className="text-lg">Loading map...</div>
            </div>
          }>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <p className="text-muted-foreground">
                Map functionality will be implemented here.
              </p>
            </div>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Map;
