
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

interface RouteData {
  origin: [number, number, number];
  destination: [number, number, number];
  shipments: number;
  risk: number;
  forwarder: string;
}

function Globe({ routes }: { routes: RouteData[] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#1e293b" 
          wireframe={true}
          opacity={0.3}
          transparent
        />
      </Sphere>

      {routes.map((route, index) => (
        <group key={index}>
          {/* Origin marker */}
          <mesh position={route.origin}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>

          {/* Destination marker */}
          <mesh position={route.destination}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#c084fc" />
          </mesh>

          {/* Route line */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...route.origin, ...route.destination])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#7e22ce" linewidth={3} />
          </line>

          {/* Info popup */}
          <Html position={route.destination}>
            <div className="bg-slate-900/90 text-white p-3 rounded-lg border border-deepcal-purple/50 text-xs backdrop-blur">
              <div className="font-semibold text-deepcal-light">{route.forwarder}</div>
              <div>Shipments: {route.shipments}</div>
              <div>Risk: <span className={route.risk > 50 ? 'text-red-400' : 'text-green-400'}>{route.risk}%</span></div>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

export const Interactive3DGlobe = () => {
  const routes: RouteData[] = [
    {
      origin: [-0.5, 0.8, 1.5], // Nairobi
      destination: [0.2, -0.3, 1.8], // Lusaka
      shipments: 24,
      risk: 8,
      forwarder: "Kuehne + Nagel"
    },
    {
      origin: [0.8, -0.2, 1.6], // Johannesburg
      destination: [0.2, -0.3, 1.8], // Lusaka
      shipments: 15,
      risk: 12,
      forwarder: "DHL Express"
    },
    {
      origin: [-0.3, 1.2, 1.4], // Cairo
      destination: [-0.5, 0.8, 1.5], // Nairobi
      shipments: 8,
      risk: 22,
      forwarder: "Siginon Logistics"
    }
  ];

  return (
    <div className="w-full h-96 oracle-card overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} color="#a855f7" intensity={0.8} />
        <pointLight position={[-10, -10, -10]} color="#c084fc" intensity={0.4} />
        <Globe routes={routes} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};
