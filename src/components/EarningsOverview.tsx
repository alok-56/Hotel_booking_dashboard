
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, CreditCard, Banknote, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EarningsOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const earningsData = {
    totalRevenue: 2845000,
    roomRevenue: 2100000,
    serviceRevenue: 445000,
    otherRevenue: 300000,
    pendingPayments: 125000,
    monthlyGrowth: 15.8,
    occupancyRate: 78.5
  };

  const revenueBreakdown = [
    { category: 'Room Bookings', amount: 2100000, percentage: 73.8, color: 'bg-blue-500' },
    { category: 'Food & Beverage', amount: 445000, percentage: 15.6, color: 'bg-green-500' },
    { category: 'Spa & Wellness', amount: 180000, percentage: 6.3, color: 'bg-purple-500' },
    { category: 'Other Services', amount: 120000, percentage: 4.2, color: 'bg-orange-500' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 2200000, bookings: 450 },
    { month: 'Feb', revenue: 2400000, bookings: 520 },
    { month: 'Mar', revenue: 2650000, bookings: 580 },
    { month: 'Apr', revenue: 2300000, bookings: 490 },
    { month: 'May', revenue: 2750000, bookings: 620 },
    { month: 'Jun', revenue: 2845000, bookings: 640 }
  ];

  const paymentMethods = [
    { method: 'Credit Card', amount: 1520000, percentage: 53.4 },
    { method: 'UPI/Digital', amount: 856000, percentage: 30.1 },
    { method: 'Cash', amount: 341000, percentage: 12.0 },
    { method: 'Bank Transfer', amount: 128000, percentage: 4.5 }
  ];

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Earnings Overview</h1>
            <p className="text-gray-600">Track your revenue and financial performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <Button variant="outline">
              Export Report
            </Button>
          </div>
        </div>

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.totalRevenue)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{earningsData.monthlyGrowth}% vs last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Room Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.roomRevenue)}</p>
                  <p className="text-xs text-blue-600">73.8% of total revenue</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Service Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(earningsData.serviceRevenue)}</p>
                  <p className="text-xs text-purple-600">15.6% of total revenue</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(earningsData.pendingPayments)}</p>
                  <p className="text-xs text-gray-600">To be collected</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Banknote className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-900">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(item.amount)}</div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Visual Bar Chart */}
              <div className="mt-6 space-y-3">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{item.category}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width:`${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Monthly Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{month.month} 2025</div>
                      <div className="text-sm text-gray-600">{month.bookings} bookings</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{formatCurrency(month.revenue)}</div>
                      <div className="text-xs text-green-600">
                        {index > 0 && monthlyData[index - 1] ? 
                          `+${(((month.revenue - monthlyData[index - 1].revenue) / monthlyData[index - 1].revenue) * 100).toFixed(1)}%`
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
              Payment Methods Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {paymentMethods.map((payment, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(payment.amount)}
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{payment.method}</div>
                  <div className="text-xs text-gray-500">{payment.percentage}% of total</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹4,450</div>
              <div className="text-sm text-gray-600">Average Revenue Per Room</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{earningsData.occupancyRate}%</div>
              <div className="text-sm text-gray-600">Current Occupancy Rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹1,847</div>
              <div className="text-sm text-gray-600">Average Daily Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;
