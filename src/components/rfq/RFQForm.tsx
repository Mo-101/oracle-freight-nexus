
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { rfqService } from '@/services/rfqService';
import { useToast } from '@/hooks/use-toast';

export const RFQForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    goods_type: '',
    weight_kg: '',
    volume_cbm: '',
    required_delivery_date: '',
    special_instructions: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const rfqData = {
        ...formData,
        weight_kg: parseFloat(formData.weight_kg),
        volume_cbm: parseFloat(formData.volume_cbm),
        user_id: 'current_user' // In a real app, get from auth context
      };

      const rfqId = await rfqService.createRFQ(rfqData);
      
      toast({
        title: "RFQ Created Successfully",
        description: `RFQ ${rfqId} has been created and forwarders have been notified.`,
      });

      // Reset form
      setFormData({
        origin: '',
        destination: '',
        goods_type: '',
        weight_kg: '',
        volume_cbm: '',
        required_delivery_date: '',
        special_instructions: ''
      });

    } catch (error) {
      toast({
        title: "Error Creating RFQ",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="text-deepcal-light">Create New RFQ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder="e.g., Nairobi, Kenya"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                placeholder="e.g., Lusaka, Zambia"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goods_type">Goods Type</Label>
            <Select onValueChange={(value) => handleInputChange('goods_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select goods type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="medical">Medical Supplies</SelectItem>
                <SelectItem value="automotive">Automotive Parts</SelectItem>
                <SelectItem value="textiles">Textiles</SelectItem>
                <SelectItem value="machinery">Machinery</SelectItem>
                <SelectItem value="food">Food & Beverages</SelectItem>
                <SelectItem value="chemicals">Chemicals</SelectItem>
                <SelectItem value="general">General Cargo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight_kg}
                onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                placeholder="500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Volume (CBM)</Label>
              <Input
                id="volume"
                type="number"
                step="0.1"
                value={formData.volume_cbm}
                onChange={(e) => handleInputChange('volume_cbm', e.target.value)}
                placeholder="2.5"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_date">Required Delivery Date</Label>
            <Input
              id="delivery_date"
              type="date"
              value={formData.required_delivery_date}
              onChange={(e) => handleInputChange('required_delivery_date', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.special_instructions}
              onChange={(e) => handleInputChange('special_instructions', e.target.value)}
              placeholder="Any special handling requirements, temperature control, etc."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-deepcal-purple hover:bg-deepcal-dark"
          >
            {isSubmitting ? 'Creating RFQ...' : 'Submit RFQ'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
