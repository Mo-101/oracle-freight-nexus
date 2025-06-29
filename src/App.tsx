
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import Footer from './components/Footer';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import QuantumParticles from './components/QuantumParticles';
import { Interactive3DGlobe } from './components/Interactive3DGlobe';
import { MCPIntegrationPanel } from './components/mcp/MCPIntegrationPanel';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-dark dark:from-gray-950 dark:via-slate-950 dark:to-gray-950">
            <QuantumParticles />
            <Header />
            
            <main className="container mx-auto px-4 py-8 relative z-10">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-200px)]">
                      {/* Left Panel - Input */}
                      <div className="xl:col-span-1 space-y-6">
                        <InputPanel />
                        <MCPIntegrationPanel className="max-h-96" />
                      </div>
                      
                      {/* Center Panel - 3D Globe */}
                      <div className="xl:col-span-1 flex items-center justify-center">
                        <div className="w-full h-[600px] max-w-lg">
                          <Interactive3DGlobe />
                        </div>
                      </div>
                      
                      {/* Right Panel - Output */}
                      <div className="xl:col-span-1">
                        <OutputPanel />
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
