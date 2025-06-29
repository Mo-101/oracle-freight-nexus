
import React from 'react';
import { Header } from '../components/Header';
import { TrainingTabs } from '../components/training/TrainingTabs';

const Training = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-dark">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <TrainingTabs />
      </main>
    </div>
  );
};

export default Training;
