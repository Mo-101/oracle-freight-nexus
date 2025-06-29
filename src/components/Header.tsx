
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple py-4 px-6 symbolic-border">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 animate-fade-in">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-deepcal-purple rounded-full flex items-center justify-center glowing-border">
                <i className="fas fa-infinity text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-100">
                DeepCAL++ vΩ
              </h1>
            </Link>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className="px-4 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition text-white"
              >
                <i className="fas fa-chart-line mr-2"></i> Analytics
              </Link>
              <Link 
                to="/chat" 
                className="px-4 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition text-white"
              >
                <i className="fas fa-comments mr-2"></i> Chat Oracle
              </Link>
              <Link 
                to="/quantum" 
                className="px-4 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition text-white"
              >
                <i className="fas fa-atom mr-2"></i> Quantum View
              </Link>
              <Link 
                to="/map" 
                className="px-4 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition text-white"
              >
                <i className="fas fa-map mr-2"></i> Global Map
              </Link>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
              <span className="ml-2 text-sm font-semibold">🟣 ASSEMBLY IN PROGRESS</span>
            </div>
            <div className="hidden md:block">
              <span className="text-xl">🔱</span>
              <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-400">
                The Oracle of Freight is Awakening...
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
