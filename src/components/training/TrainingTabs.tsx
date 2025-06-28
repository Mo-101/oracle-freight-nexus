
import React from "react";
import { Brain, Sliders, Settings, Terminal } from "lucide-react";

interface TrainingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TrainingTabs = ({ activeTab, onTabChange }: TrainingTabsProps) => {
  const tabs = [
    { id: "engine", label: "Engine Configuration", icon: Brain },
    { id: "weights", label: "Criteria Weights", icon: Sliders },
    { id: "advanced", label: "Advanced", icon: Settings },
    { id: "logs", label: "Logs", icon: Terminal }
  ];
  
  return (
    <div className="flex border-b border-slate-700 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-medium flex items-center gap-2 transition-all ${
            activeTab === tab.id
              ? "text-deepcal-light border-b-2 border-deepcal-light"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <tab.icon className="w-4 h-4" /> {tab.label}
        </button>
      ))}
    </div>
  );
};
