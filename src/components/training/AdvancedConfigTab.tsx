
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const AdvancedConfigTab = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light">Algorithm Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Optimization Method</Label>
            <select className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white">
              <option>Grey-AHP-TOPSIS</option>
              <option>Fuzzy TOPSIS</option>
              <option>ELECTRE III</option>
            </select>
          </div>
          <div>
            <Label className="text-slate-300">Convergence Threshold</Label>
            <Input placeholder="0.001" className="mt-1" />
          </div>
          <div>
            <Label className="text-slate-300">Max Iterations</Label>
            <Input placeholder="1000" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card className="oracle-card">
        <CardHeader>
          <CardTitle className="text-deepcal-light">Performance Tuning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Parallel Processing</Label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">GPU Acceleration</Label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Memory Optimization</Label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
