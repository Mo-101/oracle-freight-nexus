
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="relative z-50 border-b border-deepcal-oracle/20 bg-slate-900/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="quantum-ring w-12 h-12 rounded-full bg-gradient-to-r from-deepcal-purple to-deepcal-oracle flex items-center justify-center">
              <i className="fas fa-cube text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">
                DeepCAL <span className="text-deepcal-oracle">Industries</span>
              </h1>
              <p className="text-sm text-slate-400">
                Quantum Freight Intelligence Engine
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Quantum Core Online</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
