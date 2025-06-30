
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Database, Upload, Lock, Unlock } from 'lucide-react';
import { baseDataStore, DataVersion } from '@/services/baseDataStore';

export const DataValidationPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataVersion, setDataVersion] = useState<DataVersion | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setValidationMessage('');

    try {
      const csvContent = await file.text();
      const success = await baseDataStore.loadAndValidateData(csvContent, file.name);
      
      if (success) {
        const version = baseDataStore.getDataVersion();
        setDataVersion(version);
        setIsLocked(false);
        setValidationMessage('✅ Data validated successfully! DeepCAL engine unlocked.');
      } else {
        setValidationMessage('❌ Data validation failed. Please check the file format.');
      }
    } catch (error) {
      setValidationMessage(`❌ Error loading data: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkSystemStatus = useCallback(() => {
    const locked = baseDataStore.isSystemLocked();
    const version = baseDataStore.getDataVersion();
    setIsLocked(locked);
    setDataVersion(version);
    
    if (!locked && version) {
      setValidationMessage('✅ System unlocked with validated data');
    } else {
      setValidationMessage('🔒 System locked - no validated data loaded');
    }
  }, []);

  React.useEffect(() => {
    checkSystemStatus();
  }, [checkSystemStatus]);

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light flex items-center">
          <Database className="w-5 h-5 mr-2" />
          DeepCAL Data-First Protocol
          {isLocked ? (
            <Lock className="w-4 h-4 ml-2 text-red-400" />
          ) : (
            <Unlock className="w-4 h-4 ml-2 text-green-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div className={`p-4 rounded border-l-4 ${
          isLocked 
            ? 'bg-red-900/20 border-red-400 text-red-100' 
            : 'bg-green-900/20 border-green-400 text-green-100'
        }`}>
          <div className="flex items-center">
            {isLocked ? (
              <AlertTriangle className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            <span className="font-semibold">
              {isLocked ? 'SYSTEM LOCKED' : 'SYSTEM OPERATIONAL'}
            </span>
          </div>
          <p className="text-sm mt-2">
            {isLocked 
              ? 'No validated data loaded. All features are locked until base dataset is validated.'
              : 'Base dataset validated. All DeepCAL features are operational.'
            }
          </p>
        </div>

        {/* Data Version Info */}
        {dataVersion && (
          <div className="bg-slate-800/50 p-4 rounded">
            <h4 className="font-semibold text-deepcal-light mb-2">📊 Data Version</h4>
            <div className="text-sm space-y-1">
              <div><span className="text-slate-400">Version:</span> {dataVersion.version}</div>
              <div><span className="text-slate-400">Source:</span> {dataVersion.source}</div>
              <div><span className="text-slate-400">Hash:</span> <code className="text-xs">{dataVersion.hash.substring(0, 16)}...</code></div>
              <div><span className="text-slate-400">Loaded:</span> {dataVersion.timestamp.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div>
          <label htmlFor="csv-upload" className="block text-sm font-medium text-slate-300 mb-2">
            Upload deeptrack_2.csv or compatible dataset:
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="flex-1 text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-deepcal-purple file:text-white hover:file:bg-deepcal-dark"
            />
            <Button onClick={checkSystemStatus} variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Check Status
            </Button>
          </div>
        </div>

        {/* Validation Message */}
        {validationMessage && (
          <div className="bg-slate-900/50 p-3 rounded text-sm">
            {validationMessage}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center text-deepcal-light">
            <div className="w-4 h-4 border-2 border-deepcal-light border-t-transparent rounded-full animate-spin mr-2"></div>
            Validating data and unlocking DeepCAL engine...
          </div>
        )}

        {/* Protocol Info */}
        <div className="bg-slate-800/30 p-4 rounded text-xs text-slate-400">
          <p className="font-semibold mb-2">🔒 Data-First Protocol:</p>
          <ul className="space-y-1">
            <li>• All features remain locked until base dataset is validated</li>
            <li>• Data is hashed (SHA256) and versioned for audit trail</li>
            <li>• Required columns: shipment_id, origin_country, destination_country, weight_kg, volume_cbm, cost, forwarder, transit_days</li>
            <li>• Minimum 80% data completeness required for validation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
