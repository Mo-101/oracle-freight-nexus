
import React from 'react';
import { Header } from '../components/Header';
import { FreightIntelligenceDashboard } from '../components/freight/FreightIntelligenceDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <FreightIntelligenceDashboard 
          origin="Kenya"
          destination="Zambia"
          cargoType="Emergency Health Kits"
          weight={1000}
          volume={2.5}
        />
      </main>
    </div>
  );
};

export default Index;
