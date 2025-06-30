
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dataExportService } from '@/services/dataExportService';
import { Download, Play, Settings } from 'lucide-react';

interface FineTuningConfig {
  includeCanonical: boolean;
  syntheticCount: number;
  includeWestAfrica: boolean;
  includeNorthAfrica: boolean;
  includeCentralAfrica: boolean;
  includeEdgeCases: boolean;
  exportFormat: 'jsonl' | 'csv' | 'json';
  modelName: string;
  epochs: number;
  learningRate: number;
  batchSize: number;
}

export const FineTuningConfig = () => {
  const [config, setConfig] = useState<FineTuningConfig>({
    includeCanonical: true,
    syntheticCount: 5000,
    includeWestAfrica: true,
    includeNorthAfrica: true,
    includeCentralAfrica: true,
    includeEdgeCases: true,
    exportFormat: 'jsonl',
    modelName: 'qwen-7b',
    epochs: 3,
    learningRate: 0.0001,
    batchSize: 4
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportStats, setExportStats] = useState<{total: number, canonical: number, synthetic: number} | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportedData = await dataExportService.exportForFineTuning(config);
      
      // Calculate stats
      const lines = exportedData.split('\n').filter(line => line.trim());
      const canonicalCount = config.includeCanonical ? 105 : 0;
      const syntheticCount = config.syntheticCount;
      
      setExportStats({
        total: lines.length,
        canonical: canonicalCount,
        synthetic: syntheticCount
      });

      // Download the file
      const filename = `deepcal_training_${Date.now()}.${config.exportFormat}`;
      const mimeType = config.exportFormat === 'jsonl' ? 'application/jsonl' : 
                      config.exportFormat === 'csv' ? 'text/csv' : 'application/json';
      
      dataExportService.downloadFile(exportedData, filename, mimeType);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateYAMLConfig = () => {
    const yamlConfig = `# DeepCAL Fine-tuning Configuration
model_name: ${config.modelName}
base_model: "Qwen/Qwen2.5-7B-Instruct"

# Training parameters
num_train_epochs: ${config.epochs}
learning_rate: ${config.learningRate}
per_device_train_batch_size: ${config.batchSize}
gradient_accumulation_steps: 4
warmup_steps: 100
logging_steps: 10
save_steps: 500
eval_steps: 500

# Data configuration
train_file: "deepcal_training_data.jsonl"
validation_split: 0.1
max_seq_length: 2048

# African logistics specific prompts
system_prompt: |
  You are DeepCAL, an AI assistant specialized in African logistics and freight forwarding.
  You provide accurate, data-driven insights for shipping across Africa, considering local
  conditions, regulations, and cultural factors.

# LoRA configuration for efficient fine-tuning
peft_config:
  task_type: "CAUSAL_LM"
  r: 16
  lora_alpha: 32
  lora_dropout: 0.1
  target_modules: ["q_proj", "v_proj", "k_proj", "o_proj"]

# Output configuration
output_dir: "./deepcal_finetuned"
hub_model_id: "deepcal-logistics-7b"
push_to_hub: false
`;

    // Download YAML config
    dataExportService.downloadFile(yamlConfig, 'deepcal_finetune_config.yaml', 'text/yaml');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            DeepCAL Fine-Tuning Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Data Configuration</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="canonical"
                  checked={config.includeCanonical}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({...prev, includeCanonical: checked as boolean}))
                  }
                />
                <Label htmlFor="canonical">Include Canonical Dataset (105 shipments)</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="syntheticCount">Synthetic Data Count</Label>
                <Input
                  id="syntheticCount"
                  type="number"
                  value={config.syntheticCount}
                  onChange={(e) => 
                    setConfig(prev => ({...prev, syntheticCount: parseInt(e.target.value)}))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Regional Coverage</Label>
                <div className="space-y-2">
                  {[
                    {key: 'includeWestAfrica', label: 'West Africa (Lagos, Dakar, Accra)'},
                    {key: 'includeNorthAfrica', label: 'North Africa (Cairo, Tunis, Algiers)'},
                    {key: 'includeCentralAfrica', label: 'Central Africa (Kinshasa, Yaoundé)'},
                    {key: 'includeEdgeCases', label: 'Edge Cases & Emergencies'}
                  ].map(({key, label}) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={config[key as keyof FineTuningConfig] as boolean}
                        onCheckedChange={(checked) =>
                          setConfig(prev => ({...prev, [key]: checked as boolean}))
                        }
                      />
                      <Label htmlFor={key}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Training Parameters</h3>
              
              <div className="space-y-2">
                <Label htmlFor="modelName">Base Model</Label>
                <Select value={config.modelName} onValueChange={(value) => 
                  setConfig(prev => ({...prev, modelName: value}))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qwen-7b">Qwen2.5-7B-Instruct</SelectItem>
                    <SelectItem value="deepseek-7b">DeepSeek-V2-Lite</SelectItem>
                    <SelectItem value="llama-7b">Llama-3.1-7B-Instruct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="epochs">Epochs</Label>
                  <Input
                    id="epochs"
                    type="number"
                    value={config.epochs}
                    onChange={(e) => 
                      setConfig(prev => ({...prev, epochs: parseInt(e.target.value)}))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchSize">Batch Size</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    value={config.batchSize}
                    onChange={(e) => 
                      setConfig(prev => ({...prev, batchSize: parseInt(e.target.value)}))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningRate">Learning Rate</Label>
                <Input
                  id="learningRate"
                  type="number"
                  step="0.00001"
                  value={config.learningRate}
                  onChange={(e) => 
                    setConfig(prev => ({...prev, learningRate: parseFloat(e.target.value)}))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exportFormat">Export Format</Label>
                <Select value={config.exportFormat} onValueChange={(value: 'jsonl' | 'csv' | 'json') => 
                  setConfig(prev => ({...prev, exportFormat: value}))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jsonl">JSONL (Fine-tuning)</SelectItem>
                    <SelectItem value="csv">CSV (Analysis)</SelectItem>
                    <SelectItem value="json">JSON (General)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Export Stats */}
          {exportStats && (
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Export Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Total Records:</span>
                  <span className="text-green-400 ml-2 font-mono">{exportStats.total}</span>
                </div>
                <div>
                  <span className="text-slate-400">Canonical:</span>
                  <span className="text-blue-400 ml-2 font-mono">{exportStats.canonical}</span>
                </div>
                <div>
                  <span className="text-slate-400">Synthetic:</span>
                  <span className="text-purple-400 ml-2 font-mono">{exportStats.synthetic}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button onClick={handleExport} disabled={isExporting} className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Training Data'}
            </Button>
            
            <Button onClick={generateYAMLConfig} variant="outline" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Download Config YAML
            </Button>
          </div>

          {/* Training Instructions */}
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Training Instructions</h3>
            <Textarea
              readOnly
              value={`# DeepCAL Fine-tuning Steps:

1. Export training data using the button above
2. Download the YAML configuration file
3. Set up your training environment:
   - Google Colab with GPU (free tier works)
   - Or local machine with CUDA GPU
   
4. Install requirements:
   pip install transformers datasets peft accelerate torch

5. Run training:
   python train_deepcal.py --config deepcal_finetune_config.yaml

6. Merge and convert to GGUF for LM Studio:
   python convert_to_gguf.py --model ./deepcal_finetuned

7. Load in LM Studio and test with African logistics queries

Estimated training time: 2-6 hours depending on GPU
Memory requirement: 16GB+ VRAM recommended`}
              rows={15}
              className="font-mono text-xs"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
