
import React from 'react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-deepcal-oracle/30 hover:bg-deepcal-oracle/10 transition-all duration-300"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-deepcal-oracle" />
      ) : (
        <Moon className="h-4 w-4 text-deepcal-oracle" />
      )}
    </Button>
  );
};
