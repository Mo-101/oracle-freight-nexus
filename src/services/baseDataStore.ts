import { sha256 } from 'crypto-js';
import { neonDataService } from './neonDataService';

export interface DataVersion {
  version: string;
  hash: string;
  source: string;
  timestamp: Date;
  validated: boolean;
}

export interface BaseDataValidation {
  hasRequiredColumns: boolean;
  rowCount: number;
  missingValues: string[];
  dataTypes: Record<string, string>;
  errors: string[];
}

class BaseDataStore {
  private static instance: BaseDataStore;
  private dataVersion: DataVersion | null = null;
  private rawData: any[] = [];
  private isLocked: boolean = true;
  private useNeon: boolean = true; // Updated to use Neon instead of Supabase

  private constructor() {}

  static getInstance(): BaseDataStore {
    if (!BaseDataStore.instance) {
      BaseDataStore.instance = new BaseDataStore();
    }
    return BaseDataStore.instance;
  }

  async initializeFromNeon(): Promise<boolean> {
    if (!this.useNeon) return false;
    
    try {
      console.log('🔄 BaseDataStore: Initializing from Neon Database...');
      
      const shipments = await neonDataService.getAllShipments();
      if (shipments.length > 0) {
        this.rawData = shipments;
        
        // Create a data version from existing data
        const dataString = JSON.stringify(shipments);
        const hash = sha256(dataString).toString();
        
        this.dataVersion = {
          version: `v1.0.0-neon-${Date.now()}`,
          hash,
          source: 'neon-database',
          timestamp: new Date(),
          validated: true
        };
        
        this.isLocked = false;
        console.log('✅ BaseDataStore: Initialized from Neon with', shipments.length, 'records');
        return true;
      }
      
      console.log('ℹ️ BaseDataStore: No data found in Neon, system remains locked');
      return false;
    } catch (error) {
      console.error('❌ BaseDataStore: Failed to initialize from Neon:', error);
      return false;
    }
  }

  async loadAndValidateData(csvData: string, source: string, persistToNeon = true): Promise<boolean> {
    try {
      console.log('🔒 BaseDataStore: Starting data validation protocol...');
      
      // Generate hash and version
      const hash = sha256(csvData).toString();
      const version = `v1.0.0-deepbase-${Date.now()}`;
      
      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });

      // Validate data structure
      const validation = this.validateDataStructure(rows, headers);
      
      if (!validation.hasRequiredColumns || validation.errors.length > 0) {
        console.error('❌ Data validation failed:', validation.errors);
        return false;
      }

      // Store validated data
      this.rawData = rows;
      this.dataVersion = {
        version,
        hash,
        source,
        timestamp: new Date(),
        validated: true
      };

      // Persist to Neon if enabled
      if (this.useNeon && persistToNeon) {
        console.log('💾 BaseDataStore: Persisting data to Neon...');
        const success = await neonDataService.bulkInsertShipments(rows, true);
        if (success) {
          console.log('✅ BaseDataStore: Data persisted to Neon successfully');
        } else {
          console.warn('⚠️ BaseDataStore: Failed to persist to Neon, continuing with in-memory data');
        }
      }

      this.isLocked = false;
      console.log('✅ BaseDataStore: Data validated and unlocked');
      console.log('📊 Data version:', this.dataVersion);
      
      return true;
    } catch (error) {
      console.error('❌ BaseDataStore: Failed to load data:', error);
      return false;
    }
  }

  private validateDataStructure(rows: any[], headers: string[]): BaseDataValidation {
    const requiredColumns = [
      'shipment_id', 'origin_country', 'destination_country',
      'weight_kg', 'volume_cbm', 'cost', 'forwarder', 'transit_days'
    ];

    const validation: BaseDataValidation = {
      hasRequiredColumns: true,
      rowCount: rows.length,
      missingValues: [],
      dataTypes: {},
      errors: []
    };

    // Check required columns
    for (const col of requiredColumns) {
      if (!headers.includes(col)) {
        validation.hasRequiredColumns = false;
        validation.errors.push(`Missing required column: ${col}`);
      }
    }

    // Check data types and missing values
    if (rows.length > 0) {
      for (const header of headers) {
        const values = rows.map(row => row[header]).filter(v => v && v !== '');
        const nonEmptyCount = values.length;
        const totalCount = rows.length;
        
        if (nonEmptyCount < totalCount * 0.8) { // 80% threshold
          validation.missingValues.push(`${header}: ${totalCount - nonEmptyCount} missing values`);
        }

        // Detect data type
        if (values.length > 0) {
          const sample = values[0];
          if (!isNaN(Number(sample))) {
            validation.dataTypes[header] = 'numeric';
          } else if (sample.match(/^\d{4}-\d{2}-\d{2}/)) {
            validation.dataTypes[header] = 'date';
          } else {
            validation.dataTypes[header] = 'text';
          }
        }
      }
    }

    return validation;
  }

  hasSyncedFrom(source: string): boolean {
    return !this.isLocked && this.dataVersion?.source === source;
  }

  isSystemLocked(): boolean {
    return this.isLocked;
  }

  getDataVersion(): DataVersion | null {
    return this.dataVersion;
  }

  getRawData(): any[] {
    if (this.isLocked) {
      throw new Error("Base algorithmic data not loaded – system locked.");
    }
    return this.rawData;
  }

  enforceDataLock() {
    if (this.isLocked) {
      throw new Error("Base algorithmic data not loaded – system locked.");
    }
  }

  // Updated methods for Neon integration
  async refreshFromNeon(): Promise<boolean> {
    return await this.initializeFromNeon();
  }

  enableNeonIntegration(enabled: boolean = true) {
    this.useNeon = enabled;
    console.log(`🔧 BaseDataStore: Neon integration ${enabled ? 'enabled' : 'disabled'}`);
  }

  isNeonEnabled(): boolean {
    return this.useNeon;
  }

  // Keep backward compatibility
  isSupabaseEnabled(): boolean {
    return this.useNeon; // Map to Neon for compatibility
  }

  async refreshFromSupabase(): Promise<boolean> {
    return await this.refreshFromNeon(); // Redirect to Neon
  }
}

export const baseDataStore = BaseDataStore.getInstance();

// Auto-initialize from Neon on startup
baseDataStore.initializeFromNeon().catch(console.error);
