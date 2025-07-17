import React from 'react';
import { Bed, TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const RoomWiseEarningReport = () => {
  const roomTypes = [
    {
      type: 'Executive Suite',
      totalRooms: 20,
      avgRate: 8500,
      occupancy: 85,
      revenue: 1445000,
      growth: 18
    },
    {
      type: 'Premium Double',
      totalRooms: 45,
      avgRate: 4500,
      occupancy: 78,
      revenue: 1575000,
      growth: 12
    },
    {
      type: 'Deluxe Single',
      totalRooms: 80,
      avgRate: 2500,
      occupancy: 92,
      revenue: 1840000,
      growth: 8
    },
    {
      type: 'Standard Single',
      totalRooms: 35,
      avgRate: 1800,
      occupancy: 95,
      revenue: 598500,
      growth: -2
    }
  ];

  const roomDetails = [
    { roomNo: '301', type: 'Executive Suite', hotel: 'Grand Plaza', revenue: 85000, nights: 28, avgRate: 8500 },
    { roomNo: '201', type: 'Premium Double', hotel: 'Ocean View', revenue: 67500, nights: 25, avgRate: 4500 },
    { roomNo: '101', type: 'Deluxe Single', hotel: 'Mountain Retreat', revenue: 62500, nights: 30, avgRate: 2500 },
    { roomNo: '205', type: 'Premium Double', hotel: 'Grand Plaza', revenue: 58500, nights: 26, avgRate: 4500 },
    { roomNo: '302', type: 'Executive Suite', hotel: 'Ocean View', revenue: 76500, nights: 27, avgRate: 8500 }
  ];

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return 'text-green-600';
    if (occupancy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Room-wise Earning Report</h1>
        <p className="text-gray-600">Analyze performance and revenue by room types and individual rooms</p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <Button variant="outline">Today</Button>
          <Button variant="outline">This Week</Button>
          <Button variant="outline">This Month</Button>
          <Button>Custom Range</Button>
        </div>
        <Button>Export Report</Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
            <p className="text-xs text-muted-foreground">Across all hotels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Occupancy</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Room Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,125</div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue per Room</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹27,750</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      {/* Room Type Performance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Performance by Room Type</CardTitle>
          <CardDescription>Compare revenue and occupancy across different room categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Room Type</th>
                  <th className="text-left py-3 px-4 font-medium">Total Rooms</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Rate</th>
                  <th className="text-left py-3 px-4 font-medium">Occupancy</th>
                  <th className="text-left py-3 px-4 font-medium">Total Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue/Room</th>
                  <th className="text-left py-3 px-4 font-medium">Growth</th>
                  <th className="text-left py-3 px-4 font-medium">Performance</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((room, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{room.type}</td>
                    <td className="py-3 px-4">{room.totalRooms}</td>
                    <td className="py-3 px-4">₹{room.avgRate.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getOccupancyColor(room.occupancy)}`}>
                        {room.occupancy}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">₹{(room.revenue / 100000).toFixed(1)}L</td>
                    <td className="py-3 px-4">₹{(room.revenue / room.totalRooms / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getGrowthColor(room.growth)}`}>
                        {room.growth > 0 ? '+' : ''}{room.growth}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${room.occupancy}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Rooms */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Rooms</CardTitle>
          <CardDescription>Individual room performance this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Room No.</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Hotel</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Nights Sold</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Rate</th>
                  <th className="text-left py-3 px-4 font-medium">Occupancy</th>
                  <th className="text-left py-3 px-4 font-medium">Rank</th>
                </tr>
              </thead>
              <tbody>
                {roomDetails.map((room, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{room.roomNo}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{room.type}</Badge>
                    </td>
                    <td className="py-3 px-4">{room.hotel}</td>
                    <td className="py-3 px-4 font-bold text-green-600">₹{room.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">{room.nights}</td>
                    <td className="py-3 px-4">₹{room.avgRate.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getOccupancyColor((room.nights / 30) * 100)}`}>
                        {Math.round((room.nights / 30) * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-blue-100 text-blue-800">#{index + 1}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomWiseEarningReport;