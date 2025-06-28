import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <InputPanel 
              onOracleAwaken={handleOracleAwaken}
              formData={formData}
              onFormChange={setFormData}
            />
            
            <OutputPanel 
              isVisible={showOutput}
              rankings={rankings}
              formData={formData}
            />
          </div>
          
          {showOutput && (
            <div className="mt-6 text-center text-sm text-slate-400">
              DeepCAL++ vΩ • Symbolic Logistical Intelligence Engine • First Transmission: {new Date().toISOString().split('T')[0]}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
