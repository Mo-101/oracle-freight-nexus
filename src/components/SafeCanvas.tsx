
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ErrorBoundary from './ErrorBoundary';

interface SafeCanvasProps {
  children: React.ReactNode;
  className?: string;
}

const CanvasErrorFallback = ({ error }: { error?: Error }) => (
  <div className="flex items-center justify-center h-full bg-muted rounded">
    <div className="text-center p-4">
      <p className="text-muted-foreground mb-2">3D rendering unavailable</p>
      <p className="text-xs text-muted-foreground">
        {error?.message || 'WebGL or Three.js error'}
      </p>
    </div>
  </div>
);

export const SafeCanvas: React.FC<SafeCanvasProps> = ({ children, className = "w-full h-96" }) => {
  return (
    <div className={className}>
      <ErrorBoundary fallback={CanvasErrorFallback}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full bg-muted rounded">
            <div className="text-muted-foreground">Loading 3D scene...</div>
          </div>
        }>
          <Canvas
            dpr={[1, 2]}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
            camera={{ position: [0, 0, 5], fov: 75 }}
            onCreated={(state) => {
              // Ensure proper initialization
              state.gl.setClearColor('#ffffff', 0);
            }}
          >
            {children}
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SafeCanvas;
