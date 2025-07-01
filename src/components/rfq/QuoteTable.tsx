
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { rfqService } from '@/services/rfqService';
import { Quote } from '@/types/rfq';
import { useToast } from '@/hooks/use-toast';

interface QuoteTableProps {
  rfqId: string;
}

export const QuoteTable = ({ rfqId }: QuoteTableProps) => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    loadQuotes();
  }, [rfqId]);

  const loadQuotes = async () => {
    try {
      const data = await rfqService.getQuotesForRFQ(rfqId);
      setQuotes(data.sort((a, b) => a.rate - b.rate)); // Sort by rate
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    setAccepting(quoteId);
    try {
      const success = await rfqService.acceptQuote(quoteId);
      if (success) {
        toast({
          title: "Quote Accepted",
          description: "Shipment has been created and all parties have been notified.",
        });
        // Refresh quotes to show updated status
        await loadQuotes();
      }
    } catch (error) {
      toast({
        title: "Error Accepting Quote",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setAccepting(null);
    }
  };

  if (loading) {
    return (
      <Card className="oracle-card">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">Loading quotes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light">
          Quotes for RFQ: {rfqId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quotes.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            No quotes received yet. Forwarders have been notified.
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <div
                key={quote.id}
                className={`p-4 rounded-lg border ${
                  index === 0
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-slate-600 bg-slate-800/30'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-200 flex items-center">
                      {quote.forwarder_name}
                      {index === 0 && (
                        <Badge className="ml-2 bg-green-500 text-white text-xs">
                          BEST RATE
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Quote ID: {quote.id}
                    </p>
                  </div>
                  <Badge 
                    className={`${
                      quote.status === 'accepted' ? 'bg-green-500' :
                      quote.status === 'rejected' ? 'bg-red-500' :
                      'bg-yellow-500'
                    } text-white`}
                  >
                    {quote.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-deepcal-light">
                      ${quote.rate.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">{quote.currency}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-slate-200">
                      {quote.transit_days}
                    </div>
                    <div className="text-xs text-slate-400">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-200">
                      {new Date(quote.validity_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-400">Valid Until</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-200">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-400">Received</div>
                  </div>
                </div>

                {quote.remarks && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-1">Remarks:</p>
                    <p className="text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                      {quote.remarks}
                    </p>
                  </div>
                )}

                {quote.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAcceptQuote(quote.id)}
                      disabled={accepting === quote.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {accepting === quote.id ? 'Accepting...' : 'Accept Quote'}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-900/20"
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
