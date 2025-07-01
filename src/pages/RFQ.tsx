
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RFQForm } from '@/components/rfq/RFQForm';
import { RFQList } from '@/components/rfq/RFQList';
import { QuoteTable } from '@/components/rfq/QuoteTable';

const RFQ = () => {
  const [selectedRFQId, setSelectedRFQId] = useState<string>('rfq_001'); // For demo

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-deepcal-light mb-2">
            RFQ Management System
          </h1>
          <p className="text-slate-400">
            Create RFQs, manage quotes, and track shipments all in one place
          </p>
        </div>

        <Tabs defaultValue="rfqs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger 
              value="rfqs" 
              className="data-[state=active]:bg-deepcal-purple data-[state=active]:text-white"
            >
              My RFQs
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="data-[state=active]:bg-deepcal-purple data-[state=active]:text-white"
            >
              Create RFQ
            </TabsTrigger>
            <TabsTrigger 
              value="quotes" 
              className="data-[state=active]:bg-deepcal-purple data-[state=active]:text-white"
            >
              Quotes
            </TabsTrigger>
            <TabsTrigger 
              value="shipments" 
              className="data-[state=active]:bg-deepcal-purple data-[state=active]:text-white"
            >
              Shipments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rfqs" className="space-y-6">
            <RFQList />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <RFQForm />
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <QuoteTable rfqId={selectedRFQId} />
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <Card className="oracle-card">
              <CardHeader>
                <CardTitle className="text-deepcal-light">Active Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-400 py-8">
                  Shipment tracking functionality coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RFQ;
