
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 px-0 border-t border-slate-700 mt-8 w-full">
      <div className="max-w-full px-6 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8">
          <div>
            <i className="fas fa-brain text-deepcal-light mr-2"></i>
            PHASE I – Simulated Symbolic Engine
          </div>
          <div>
            <i className="fas fa-chart-network text-deepcal-light mr-2"></i>
            PHASE II – Visual Dashboard (In Development)
          </div>
          <div>
            <i className="fas fa-wave-square text-deepcal-light mr-2"></i>
            PHASE III – DeepTalk Voice (Q3 2025)
          </div>
          <div>
            <i className="fas fa-bolt text-deepcal-light mr-2"></i>
            PHASE IV – Live Shipment Integration (Q4 2025)
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-500">
          © 2025 DeepCAL++ Technologies • The First Symbolic Logistical Intelligence Engine • 🔱
        </div>
      </div>
    </footer>
  );
};

export default Footer;
