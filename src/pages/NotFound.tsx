
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-deepcal-light mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-dark hover:to-deepcal-purple text-white py-3 px-6 rounded-lg font-medium transition-all duration-300"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
