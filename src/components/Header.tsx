
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Analytics', icon: 'fas fa-chart-line' },
    { path: '/chat', label: 'Chat Oracle', icon: 'fas fa-comments' },
    { path: '/quantum', label: 'Quantum View', icon: 'fas fa-atom' },
    { path: '/map', label: 'Global Map', icon: 'fas fa-map' },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple py-4 px-6 symbolic-border">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 animate-fade-in mb-4 lg:mb-0">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-deepcal-purple rounded-full flex items-center justify-center glowing-border">
                <i className="fas fa-infinity text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-100">
                DeepCAL++ vΩ
              </h1>
            </Link>
          </div>
          
          {/* Main Navigation */}
          <nav className="flex flex-wrap justify-center lg:justify-end items-center gap-3 mb-4 lg:mb-0">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-deepcal-purple text-white glowing-border'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 hover:bg-deepcal-purple/50'
                }`}
              >
                <i className={`${item.icon} mr-2`}></i>
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              </Link>
            ))}
          </nav>

          {/* Status Section */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center lg:text-left">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
              <span className="ml-2 text-sm font-semibold">🟣 ASSEMBLY IN PROGRESS</span>
            </div>
            <div className="hidden lg:flex items-center">
              <span className="text-xl">🔱</span>
              <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-400 text-sm">
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
