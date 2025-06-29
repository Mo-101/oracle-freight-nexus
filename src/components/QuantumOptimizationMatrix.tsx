
import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { ForwarderPerformance } from '../types/deeptrack';

type Props = {
  forwarders: ForwarderPerformance[];
};

export const QuantumOptimizationMatrix = ({ forwarders }: Props) => {
  const data = forwarders.map(f => ({
    x: f.avgCostPerKg,
    y: f.avgTransitDays,
    z: f.reliabilityScore,
    name: f.name,
    color: f.quoteWinRate * 100
  }));

  const Plot = createPlotlyComponent(Plotly);
  
  return (
    <div className="w-full h-96 oracle-card">
      <Plot
        data={[{
          type: 'scatter3d',
          mode: 'markers',
          x: data.map(d => d.x),
          y: data.map(d => d.y),
          z: data.map(d => d.z),
          text: data.map(d => d.name),
          hovertemplate: '<b>%{text}</b><br>Cost: $%{x}/kg<br>Transit: %{y} days<br>Reliability: %{z}<extra></extra>',
          marker: {
            size: 12,
            color: data.map(d => d.color),
            colorscale: [
              [0, '#1e293b'],
              [0.3, '#7e22ce'],
              [0.6, '#a855f7'],
              [1, '#c084fc']
            ],
            opacity: 0.8,
            line: {
              color: '#a855f7',
              width: 1
            }
          }
        }]}
        layout={{
          title: {
            text: '🌌 Quantum Decision Space Matrix',
            font: { color: '#c084fc', size: 16 }
          },
          scene: {
            xaxis: { 
              title: 'Cost/kg ($)',
              titlefont: { color: '#a855f7' },
              tickfont: { color: '#e2e8f0' },
              gridcolor: '#374151',
              zerolinecolor: '#7e22ce'
            },
            yaxis: { 
              title: 'Transit Days',
              titlefont: { color: '#a855f7' },
              tickfont: { color: '#e2e8f0' },
              gridcolor: '#374151',
              zerolinecolor: '#7e22ce'
            },
            zaxis: { 
              title: 'Reliability Score',
              titlefont: { color: '#a855f7' },
              tickfont: { color: '#e2e8f0' },
              gridcolor: '#374151',
              zerolinecolor: '#7e22ce'
            },
            bgcolor: 'rgba(15, 23, 42, 0.8)',
            camera: {
              eye: { x: 1.2, y: 1.2, z: 0.6 }
            }
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          margin: { t: 50, b: 20, l: 0, r: 0 },
          font: { color: '#e2e8f0' }
        }}
        config={{
          displayModeBar: false,
          responsive: true
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
