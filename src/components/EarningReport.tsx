import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const EarningReport = () => {
  const earningsData = [
    { source: 'Room Bookings', amount: 4500000, percentage: 65, color: 'bg-blue-500' },
    { source: 'Restaurant', amount: 1200000, percentage: 17, color: 'bg-green-500' },
    { source: 'Events', amount: 800000, percentage: 12, color: 'bg-purple-500' },
    { source: 'Spa & Wellness', amount: 420000, percentage: 6, color: 'bg-orange-500' }
  ];

  const monthlyEarnings = [
    { month: 'Jan', amount: 5500000, growth: 12 },
    { month: 'Feb', amount: 6200000, growth: 18 },
    { month: 'Mar', amount: 5800000, growth: -6 },
    { month: 'Apr', amount: 7100000, growth: 22 },
    { month: 'May', amount: 7800000, growth: 15 },
    { month: 'Jun', amount: 6920000, growth: -8 }
  ];

  const hotelEarnings = [
    { hotel: 'Grand Plaza Hotel', revenue: 2850000, rooms: 120, avgRate: 4500 },
    { hotel: 'Ocean View Resort', revenue: 2380000, rooms: 80, avgRate: 5200 },
    { hotel: 'Mountain Retreat', revenue: 1690000, rooms: 60, avgRate: 3800 }
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earning Reports</h1>
        <p className="text-gray-600">Analyze revenue and profit trends</p>
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

      {/* Earning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹69,20,000</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹28,50,000</div>
            <p className="text-xs text-muted-foreground">41% profit margin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹40,70,000</div>
            <p className="text-xs text-muted-foreground">59% of revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,30,667</div>
            <p className="text-xs text-muted-foreground">Per day average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
            <CardDescription>Breakdown of revenue streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earningsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">₹{(item.amount / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-l-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue growth over 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyEarnings.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-gradient-to-t from-blue-600 to-blue-400 w-full rounded-t"
                    style={{ height: `${(data.amount / 10000000) * 200}px` }}
                  ></div>
                  <span className="text-xs mt-2">{data.month}</span>
                  <span className="text-xs text-gray-500">₹{(data.amount / 100000).toFixed(1)}L</span>
                  <span className={`text-xs font-medium ${data.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.growth > 0 ? '+' : ''}{data.growth}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotel Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hotel Performance</CardTitle>
          <CardDescription>Revenue breakdown by hotel properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Hotel</th>
                  <th className="text-left py-3 px-4 font-medium">Total Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">Total Rooms</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Room Rate</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue/Room</th>
                  <th className="text-left py-3 px-4 font-medium">Performance</th>
                </tr>
              </thead>
              <tbody>
                {hotelEarnings.map((hotel, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{hotel.hotel}</td>
                    <td className="py-3 px-4 font-bold text-green-600">₹{(hotel.revenue / 100000).toFixed(1)}L</td>
                    <td className="py-3 px-4">{hotel.rooms}</td>
                    <td className="py-3 px-4">₹{hotel.avgRate.toLocaleString()}</td>
                    <td className="py-3 px-4">₹{(hotel.revenue / hotel.rooms / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(hotel.revenue / 3000000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((hotel.revenue / 3000000) * 100)}%
                        </span>
                      </div>
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

export default EarningReport;