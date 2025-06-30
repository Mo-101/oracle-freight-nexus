
import React, { useEffect, useRef } from 'react';

interface Node {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'output' | 'core';
  x: number;
  y: number;
  connections: string[];
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  life: number;
}

const AnimatedNodeOracle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Define our quantum oracle nodes
  const nodes: Node[] = [
    {
      id: 'core',
      name: 'Oracle Core',
      type: 'core',
      x: 0,
      y: 0,
      connections: ['data', 'ai', 'analysis', 'output']
    },
    {
      id: 'data',
      name: 'Data Sources',
      type: 'input',
      x: -200,
      y: -150,
      connections: ['core']
    },
    {
      id: 'ai',
      name: 'AI Processing',
      type: 'processing',
      x: 200,
      y: -150,
      connections: ['core']
    },
    {
      id: 'analysis',
      name: 'Risk Analysis',
      type: 'processing',
      x: -200,
      y: 150,
      connections: ['core']
    },
    {
      id: 'output',
      name: 'Decisions',
      type: 'output',
      x: 200,
      y: 150,
      connections: ['core']
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Handle responsive sizing
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      // Update node positions relative to canvas center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      nodes.forEach(node => {
        if (node.id === 'core') {
          node.x = centerX;
          node.y = centerY;
        } else {
          // Position other nodes relative to center
          const baseX = node.id === 'data' || node.id === 'analysis' ? -200 : 200;
          const baseY = node.id === 'data' || node.id === 'ai' ? -150 : 150;
          node.x = centerX + baseX;
          node.y = centerY + baseY;
        }
      });
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let animationFrame: number;
    let pulsePhase = 0;
    const particles: Particle[] = [];
    
    // Draw a glowing connection between nodes
    const drawConnection = (source: Node, target: Node) => {
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      
      // Create a gradient for the connection line
      const gradient = ctx.createLinearGradient(
        source.x, source.y, target.x, target.y
      );
      gradient.addColorStop(0, 'rgba(128, 90, 213, 0.7)'); // Deepcal purple
      gradient.addColorStop(1, 'rgba(64, 200, 224, 0.7)'); // Deepcal light
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add animated particles occasionally
      if (Math.random() > 0.98) {
        const progress = Math.random();
        const x = source.x + (target.x - source.x) * progress;
        const y = source.y + (target.y - source.y) * progress;
        
        particles.push({
          x, y,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 2 + 1,
          life: 100
        });
      }
    };
    
    // Draw a quantum node with pulsing effect
    const drawNode = (node: Node) => {
      // Determine color based on node type
      let color: string;
      switch(node.type) {
        case 'input': color = '#6a4c93'; break;
        case 'processing': color = '#40c8e0'; break;
        case 'output': color = '#2ecc71'; break;
        case 'core': color = '#ff6b6b'; break;
        default: color = '#805ad5';
      }
      
      const pulse = Math.sin(pulsePhase) * 0.2 + 1;
      const radius = node.type === 'core' ? 30 * pulse : 20 * pulse;
      
      // Draw glow
      const gradient = ctx.createRadialGradient(
        node.x, node.y, radius * 0.8,
        node.x, node.y, radius * 1.5
      );
      gradient.addColorStop(0, `${color}80`);
      gradient.addColorStop(1, `${color}00`);
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw main node
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Draw outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y + radius + 20);
    };
    
    // Draw animated particles along connections
    const drawParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life / 100})`;
        ctx.fill();
        
        p.life -= p.speed;
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    };
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const target = nodes.find(n => n.id === connId);
          if (target) {
            drawConnection(node, target);
          }
        });
      });
      
      // Draw nodes
      nodes.forEach(node => {
        drawNode(node);
      });
      
      // Draw particles
      drawParticles();
      
      pulsePhase = (pulsePhase + 0.02) % (Math.PI * 2);
      animationFrame = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 text-deepcal-light font-bold text-lg">
        🌌 Quantum Oracle Engine
      </div>
      <div className="absolute bottom-4 right-4 text-slate-400 text-sm">
        Neural processing active
      </div>
    </div>
  );
};

export default AnimatedNodeOracle;
