
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Plus, Edit, BarChart3, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PricingManagement = () => {
  const [selectedRoom, setSelectedRoom] = useState('classic');

  const roomTypes = [
    { id: 'classic', name: 'Classic Room', basePrice: 1200, occupancy: 85 },
    { id: 'deluxe', name: 'Deluxe Room', basePrice: 1800, occupancy: 78 },
    { id: 'suite', name: 'Executive Suite', basePrice: 3200, occupancy: 65 },
    { id: 'premium', name: 'Premium Room', basePrice: 2400, occupancy: 72 }
  ];

  const pricingStrategies = [
    { name: 'Weekend Premium', multiplier: 1.3, active: true },
    { name: 'Holiday Surge', multiplier: 1.8, active: true },
    { name: 'Early Bird Discount', multiplier: 0.85, active: false },
    { name: 'Last Minute Deals', multiplier: 0.7, active: true }
  ];

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
            <p className="text-gray-600">Manage room rates and dynamic pricing strategies</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            New Pricing Rule
          </Button>
        </div>

        {/* Pricing Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Daily Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,847</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue Per Room</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,425</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pricing Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Room for improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-blue-600">Dynamic pricing rules</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Type Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Room Type Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomTypes.map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedRoom === room.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{room.name}</h3>
                        <p className="text-sm text-gray-500">Base Rate: ₹{room.basePrice}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">₹{room.basePrice}</div>
                        <div className="text-sm text-gray-500">{room.occupancy}% occupied</div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit Rate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Pricing Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Dynamic Pricing Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingStrategies.map((strategy, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{strategy.name}</h3>
                      <p className="text-sm text-gray-500">
                        {strategy.multiplier > 1 ? '+' : ''}{((strategy.multiplier - 1) * 100).toFixed(0)}% price adjustment
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        strategy.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {strategy.active ? 'Active' : 'Inactive'}
                      </span>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Calendar Pricing View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square p-2 border rounded-lg text-center cursor-pointer hover:bg-gray-50"
                >
                  <div className="text-sm font-medium">{(i % 30) + 1}</div>
                  <div className="text-xs text-gray-500">₹{1200 + (i * 50)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingManagement;
