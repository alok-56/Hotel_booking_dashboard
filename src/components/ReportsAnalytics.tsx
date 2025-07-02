
import React, { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ReportsAnalytics = () => {
  const [selectedReport, setSelectedReport] = useState('occupancy');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    { id: 'occupancy', name: 'Occupancy Report', description: 'Room occupancy trends and patterns' },
    { id: 'revenue', name: 'Revenue Report', description: 'Financial performance and earnings' },
    { id: 'guest', name: 'Guest Analytics', description: 'Guest demographics and behavior' },
    { id: 'operations', name: 'Operations Report', description: 'Operational efficiency metrics' }
  ];

  const keyMetrics = [
    { title: 'Average Occupancy', value: '78.5%', change: '+5.2%', positive: true },
    { title: 'Revenue Growth', value: '₹28.4L', change: '+15.8%', positive: true },
    { title: 'Guest Satisfaction', value: '4.7/5', change: '+0.3', positive: true },
    { title: 'Booking Conversion', value: '68.2%', change: '-2.1%', positive: false }
  ];

  const occupancyData = [
    { date: '2025-01-01', occupancy: 65, revenue: 125000 },
    { date: '2025-01-02', occupancy: 72, revenue: 138000 },
    { date: '2025-01-03', occupancy: 85, revenue: 165000 },
    { date: '2025-01-04', occupancy: 78, revenue: 148000 },
    { date: '2025-01-05', occupancy: 92, revenue: 185000 },
    { date: '2025-01-06', occupancy: 88, revenue: 172000 },
    { date: '2025-01-07', occupancy: 76, revenue: 145000 }
  ];

  const guestDemographics = [
    { segment: 'Business Travelers', percentage: 45, count: 287 },
    { segment: 'Leisure Tourists', percentage: 35, count: 223 },
    { segment: 'Group Bookings', percentage: 15, count: 96 },
    { segment: 'Long Stay Guests', percentage: 5, count: 32 }
  ];

  const topPerformingRooms = [
    { room: 'Executive Suite', occupancy: 95, revenue: 245000 },
    { room: 'Deluxe Room', occupancy: 88, revenue: 189000 },
    { room: 'Premium Room', occupancy: 82, revenue: 167000 },
    { room: 'Classic Room', occupancy: 75, revenue: 142000 }
  ];

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Detailed insights and performance analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {keyMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-600 mb-1">{metric.title}</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <div className={`text-xs flex items-center ${
                  metric.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${metric.positive ? '' : 'rotate-180'}`} />
                  {metric.change} vs last period
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Select Report Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport === report.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <h3 className="font-medium text-gray-900 mb-2">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {selectedReport === 'occupancy' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Occupancy Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {occupancyData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${day.occupancy}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{day.occupancy}%</div>
                        <div className="text-xs text-gray-500">₹{(day.revenue / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingRooms.map((room, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{room.room}</div>
                        <div className="text-sm text-gray-600">{room.occupancy}% occupancy</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₹{(room.revenue / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-green-600">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedReport === 'guest' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Guest Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guestDemographics.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{segment.segment}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{segment.percentage}%</span>
                          <span className="text-xs text-gray-500 ml-2">({segment.count} guests)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Satisfaction Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Overall Rating</span>
                    <span className="text-2xl font-bold text-green-600">4.7/5</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { category: 'Service Quality', rating: 4.8 },
                      { category: 'Room Cleanliness', rating: 4.9 },
                      { category: 'Amenities', rating: 4.5 },
                      { category: 'Value for Money', rating: 4.4 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.category}</span>
                        <span className="font-medium text-gray-900">{item.rating}/5</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedReport === 'revenue' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Revenue Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹28.4L</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+15.8% growth</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">₹1,847</div>
                  <div className="text-sm text-gray-600">Average Daily Rate</div>
                  <div className="text-xs text-blue-600 mt-1">+8.2% vs last month</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">₹4,450</div>
                  <div className="text-sm text-gray-600">Revenue Per Room</div>
                  <div className="text-xs text-purple-600 mt-1">+12.3% improvement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedReport === 'operations' && (
          <Card>
            <CardHeader>
              <CardTitle>Operational Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Key Performance Indicators</h3>
                  {[
                    { metric: 'Check-in Time', value: '8.5 min', target: '< 10 min', status: 'good' },
                    { metric: 'Housekeeping Turnaround', value: '45 min', target: '< 60 min', status: 'good' },
                    { metric: 'Guest Request Resolution', value: '12 min', target: '< 15 min', status: 'good' },
                    { metric: 'Maintenance Response', value: '25 min', target: '< 30 min', status: 'good' }
                  ].map((kpi, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{kpi.metric}</div>
                        <div className="text-sm text-gray-600">Target: {kpi.target}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{kpi.value}</div>
                        <div className="text-xs text-green-600">✓ On Track</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Staff Performance</h3>
                  <div className="space-y-3">
                    {[
                      { department: 'Front Desk', efficiency: 92, staff: 8 },
                      { department: 'Housekeeping', efficiency: 88, staff: 12 },
                      { department: 'Maintenance', efficiency: 85, staff: 4 },
                      { department: 'Food Service', efficiency: 90, staff: 6 }
                    ].map((dept, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{dept.department}</div>
                          <div className="text-sm text-gray-600">{dept.staff} staff members</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{dept.efficiency}%</div>
                          <div className="text-xs text-gray-500">Efficiency</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;
