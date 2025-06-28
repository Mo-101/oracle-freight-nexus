
import React, { useState } from 'react';

interface InputPanelProps {
  onOracleAwaken: () => void;
  formData: {
    origin: string;
    destination: string;
    weight: number;
    volume: number;
    cargoType: string;
    selectedForwarders: string[];
  };
  onFormChange: (data: any) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ onOracleAwaken, formData, onFormChange }) => {
  const [priorities, setPriorities] = useState({
    time: 68,
    cost: 45,
    risk: 22
  });

  const forwarders = [
    { name: 'Kuehne + Nagel', selected: true },
    { name: 'DHL Global Forwarding', selected: true },
    { name: 'Siginon Logistics', selected: true },
    { name: 'Scan Global Logistics', selected: false },
    { name: 'Agility Logistics', selected: false }
  ];

  const handleForwarderChange = (forwarderName: string, checked: boolean) => {
    const updatedForwarders = checked 
      ? [...formData.selectedForwarders, forwarderName]
      : formData.selectedForwarders.filter(f => f !== forwarderName);
    
    onFormChange({
      ...formData,
      selectedForwarders: updatedForwarders
    });
  };

  return (
    <div className="lg:col-span-1">
      <div className="oracle-card p-6 h-full">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <i className="fas fa-shipping-fast mr-3 text-deepcal-light"></i>
          Shipment Configuration
        </h2>
        
        <div className="space-y-6">
          {/* Route Details */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <i className="fas fa-route mr-2 text-blue-400"></i>
              Route Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Origin</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                  value={formData.origin}
                  onChange={(e) => onFormChange({ ...formData, origin: e.target.value })}
                >
                  <option>Nairobi, Kenya</option>
                  <option>Dubai, UAE</option>
                  <option>Shanghai, China</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Destination</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                  value={formData.destination}
                  onChange={(e) => onFormChange({ ...formData, destination: e.target.value })}
                >
                  <option>Lusaka, Zambia</option>
                  <option>Johannesburg, South Africa</option>
                  <option>Lagos, Nigeria</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cargo Specifications */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <i className="fas fa-box-open mr-2 text-yellow-400"></i>
              Cargo Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => onFormChange({ ...formData, weight: parseFloat(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Volume (CBM)</label>
                <input 
                  type="number" 
                  value={formData.volume}
                  onChange={(e) => onFormChange({ ...formData, volume: parseFloat(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm mb-1">Cargo Type</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-deepcal-light"
                value={formData.cargoType}
                onChange={(e) => onFormChange({ ...formData, cargoType: e.target.value })}
              >
                <option>Emergency Health Kits</option>
                <option>Pharmaceuticals</option>
                <option>Laboratory Equipment</option>
                <option>Cold Chain Supplies</option>
              </select>
            </div>
          </div>

          {/* Priority Weighting */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <i className="fas fa-balance-scale mr-2 text-purple-400"></i>
              Symbolic Priority Weighting
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Time Criticality</span>
                  <span className="text-sm font-semibold">{priorities.time}%</span>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center">
                    <div className="text-xs text-purple-200">0</div>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-slate-700 rounded-full">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${priorities.time}%` }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-200">100</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Cost Sensitivity</span>
                  <span className="text-sm font-semibold">{priorities.cost}%</span>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center">
                    <div className="text-xs text-purple-200">0</div>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-slate-700 rounded-full">
                        <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${priorities.cost}%` }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-200">100</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Risk Tolerance</span>
                  <span className="text-sm font-semibold">{priorities.risk}%</span>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center">
                    <div className="text-xs text-purple-200">0</div>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-slate-700 rounded-full">
                        <div className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: `${priorities.risk}%` }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-200">100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Forwarders Selection */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <i className="fas fa-truck-loading mr-2 text-amber-400"></i>
              Freight Forwarders
            </h3>
            <div className="space-y-2">
              {forwarders.map((forwarder) => (
                <div key={forwarder.name} className="flex items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-deepcal-light"
                    checked={formData.selectedForwarders.includes(forwarder.name)}
                    onChange={(e) => handleForwarderChange(forwarder.name, e.target.checked)}
                  />
                  <span className="ml-3">{forwarder.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Oracle Activation */}
          <div>
            <button 
              onClick={onOracleAwaken}
              className="w-full mt-2 bg-gradient-to-r from-deepcal-purple to-deepcal-light hover:from-deepcal-light hover:to-deepcal-purple text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900/50 flex items-center justify-center"
            >
              <i className="fas fa-bolt mr-2"></i>
              Awaken the Oracle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
