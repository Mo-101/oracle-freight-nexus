
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
import Chat from './pages/Chat';
import Quantum from './pages/Quantum';
import Map from './pages/Map';
import Training from './pages/Training';
import RFQ from './pages/RFQ';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/quantum" element={<Quantum />} />
            <Route path="/map" element={<Map />} />
            <Route path="/training" element={<Training />} />
            <Route path="/rfq" element={<RFQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
