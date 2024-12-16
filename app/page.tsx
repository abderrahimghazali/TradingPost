"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

const TradingPost = () => {
  const [finalItem, setFinalItem] = useState({
    name: '',
    price: ''
  });
  
  const [materials, setMaterials] = useState([
    { id: 1, name: '', price: '', quantity: '' }
  ]);
  
  const [profit, setProfit] = useState({
    totalCost: 0,
    profit: 0,
    isProfit: false
  });

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: materials.length + 1,
        name: '',
        price: '',
        quantity: ''
      }
    ]);
  };

  const removeMaterial = (id) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const updateMaterial = (id, field, value) => {
    setMaterials(materials.map(material => {
      if (material.id === id) {
        // For price and quantity, only allow numbers and decimal point
        if (field === 'price' || field === 'quantity') {
          const sanitizedValue = value.replace(/[^0-9.]/g, '');
          // Prevent multiple decimal points
          const decimalCount = (sanitizedValue.match(/\./g) || []).length;
          if (decimalCount > 1) return material;
          return { ...material, [field]: sanitizedValue };
        }
        return { ...material, [field]: value };
      }
      return material;
    }));
  };

  const calculateProfit = () => {
    const totalCost = materials.reduce((sum, material) => {
      const price = parseFloat(material.price) || 0;
      const quantity = parseFloat(material.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    const finalPrice = parseFloat(finalItem.price) || 0;
    const profitAmount = finalPrice - totalCost;
    
    setProfit({
      totalCost,
      profit: profitAmount,
      isProfit: profitAmount > 0
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New World Trading Post Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Final Item Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Final Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                placeholder="e.g. Armoring Matrix"
                value={finalItem.name}
                onChange={(e) => setFinalItem({ ...finalItem, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Market Price (Gold)</Label>
              <Input
                id="itemPrice"
                type="text"
                placeholder="0.00"
                value={finalItem.price}
                step="0.1"
                onChange={(e) => setFinalItem({ 
                  ...finalItem, 
                  price: Math.round(parseFloat(e.target.value || 0) * 100) / 100 
                })}
              />
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Required Materials</h3>
          {materials.map((material) => (
            <div key={material.id} className="grid grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`material-${material.id}-name`}>Material Name</Label>
                <Input
                  id={`material-${material.id}-name`}
                  placeholder="e.g. Prismatic Block"
                  value={material.name}
                  onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`material-${material.id}-price`}>Unit Price</Label>
                <Input
                  id={`material-${material.id}-price`}
                  type="number"
                  placeholder="0"
                  value={material.price}
                  onChange={(e) => updateMaterial(material.id, 'price', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`material-${material.id}-quantity`}>Quantity</Label>
                <Input
                  id={`material-${material.id}-quantity`}
                  type="number"
                  placeholder="0"
                  value={material.quantity}
                  onChange={(e) => updateMaterial(material.id, 'quantity', e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => removeMaterial(material.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addMaterial}>Add Material</Button>
        </div>

        {/* Calculate Section */}
        <div className="space-y-4">
          <Button onClick={calculateProfit} className="w-full">Calculate Profit</Button>
          
          {profit.totalCost > 0 && (
            <div className="space-y-2 p-4 bg-secondary rounded-lg">
              <p className="font-semibold">Total Cost: {profit.totalCost.toFixed(2)} gold</p>
              <p className={`font-semibold ${profit.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                Profit: {profit.profit.toFixed(2)} gold
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingPost;