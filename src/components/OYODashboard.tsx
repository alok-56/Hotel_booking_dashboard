import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Star, Calendar, TrendingUp, Search, Check, ChevronDown, BarChart3, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Hotel {
  id: string;
  name: string;
  sector: string;
  todayBookings: number;
  todayEarnings: number;
  todayVacantRooms: number;
  lastMonthBookings: number;
  lastMonthEarnings: number;
  totalRooms: number;
  allTimeBookings: number;
  allTimeEarnings: number;
}

const OYODashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [currentDate] = useState('1 June - 30 June');
  const [selectedHotels, setSelectedHotels] = useState<string[]>(['HTL001']);
  const [showHotelSelector, setShowHotelSelector] = useState(false);

  const hotels: Hotel[] = [
    {
      id: 'HTL001',
      name: 'Smriti Villa',
      sector: 'Sector 15',
      todayBookings: 12,
      todayEarnings: 8500,
      todayVacantRooms: 8,
      lastMonthBookings: 320,
      lastMonthEarnings: 245000,
      totalRooms: 20,
      allTimeBookings: 1250,
      allTimeEarnings: 985000
    },
    {
      id: 'HTL002',
      name: 'HOTEL SKYSPACE',
      sector: 'Sector 22',
      todayBookings: 8,
      todayEarnings: 6200,
      todayVacantRooms: 5,
      lastMonthBookings: 280,
      lastMonthEarnings: 198000,
      totalRooms: 15,
      allTimeBookings: 980,
      allTimeEarnings: 756000
    },
    {
      id: 'HTL003',
      name: 'R S Hotels',
      sector: 'Sector 18',
      todayBookings: 15,
      todayEarnings: 11200,
      todayVacantRooms: 12,
      lastMonthBookings: 380,
      lastMonthEarnings: 289000,
      totalRooms: 25,
      allTimeBookings: 1580,
      allTimeEarnings: 1250000
    },
    {
      id: 'HTL004',
      name: 'Elite Stay',
      sector: 'Sector 12',
      todayBookings: 6,
      todayEarnings: 4800,
      todayVacantRooms: 3,
      lastMonthBookings: 220,
      lastMonthEarnings: 167000,
      totalRooms: 12,
      allTimeBookings: 850,
      allTimeEarnings: 645000
    }
  ];

  const periods = ['Last 30 days', 'Last 7 days', 'Today', 'This Month'];

  // Sample day-wise data for the last 30 days
  const generateDayWiseData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayData = {
        date: `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'long' })}`,
        fullDate: date.toISOString().split('T')[0],
        bookings: 0,
        earnings: 0
      };

      // Calculate aggregated data for selected hotels
      selectedHotels.forEach(hotelId => {
        const hotel = hotels.find(h => h.id === hotelId);
        if (hotel) {
          // Generate realistic day-wise data based on hotel performance
          const baseBookings = Math.floor(hotel.todayBookings * (0.7 + Math.random() * 0.6));
          const baseEarnings = Math.floor(hotel.todayEarnings * (0.7 + Math.random() * 0.6));
          
          dayData.bookings += Math.max(0, baseBookings + Math.floor(Math.random() * 5 - 2));
          dayData.earnings += Math.max(0, baseEarnings + Math.floor(Math.random() * 2000 - 1000));
        }
      });

      data.push(dayData);
    }
    
    return data;
  };

  const dayWiseData = generateDayWiseData();

  const toggleHotelSelection = (hotelId: string) => {
    setSelectedHotels(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const getSelectedHotelsData = () => {
    const selected = hotels.filter(hotel => selectedHotels.includes(hotel.id));
    return selected.reduce((acc, hotel) => {
      acc.todayBookings += hotel.todayBookings;
      acc.todayEarnings += hotel.todayEarnings;
      acc.todayVacantRooms += hotel.todayVacantRooms;
      acc.lastMonthBookings += hotel.lastMonthBookings;
      acc.lastMonthEarnings += hotel.lastMonthEarnings;
      acc.totalRooms += hotel.totalRooms;
      acc.allTimeBookings += hotel.allTimeBookings;
      acc.allTimeEarnings += hotel.allTimeEarnings;
      return acc;
    }, {
      todayBookings: 0,
      todayEarnings: 0,
      todayVacantRooms: 0,
      lastMonthBookings: 0,
      lastMonthEarnings: 0,
      totalRooms: 0,
      allTimeBookings: 0,
      allTimeEarnings: 0
    });
  };

  const aggregatedData = getSelectedHotelsData();

  const bookingMetrics = [
    {
      title: "Today's Booking",
      value: aggregatedData.todayBookings.toString(),
      color: 'text-blue-600',
      icon: Calendar
    },
    {
      title: "Today's Earning",
      value: `₹${aggregatedData.todayEarnings.toLocaleString()}`,
      color: 'text-green-600',
      icon: TrendingUp
    },
    {
      title: "Today's Vacant Rooms",
      value: aggregatedData.todayVacantRooms.toString(),
      color: 'text-orange-600',
      icon: Eye
    },
    {
      title: "Last Month Bookings",
      value: aggregatedData.lastMonthBookings.toString(),
      color: 'text-purple-600',
      icon: Calendar
    },
    {
      title: "Last Month Earnings",
      value: `₹${aggregatedData.lastMonthEarnings.toLocaleString()}`,
      color: 'text-green-600',
      icon: TrendingUp
    },
    {
      title: "Total Rooms",
      value: aggregatedData.totalRooms.toString(),
      color: 'text-gray-600',
      icon: Eye
    },
    {
      title: "All Time Booking",
      value: aggregatedData.allTimeBookings.toString(),
      color: 'text-indigo-600',
      icon: Calendar
    },
    {
      title: "All Time Earning",
      value: `₹${aggregatedData.allTimeEarnings.toLocaleString()}`,
      color: 'text-green-600',
      icon: TrendingUp
    }
  ];

  const superOyoTargets = [
    {
      title: 'Check-in denials < 1.5 %',
      value: '0%',
      color: 'text-green-600'
    },
    {
      title: '1 & 2 star ratings < 16 %',
      value: '0%',
      subtitle: 'Feedback count must exceed 3. Get 4 more',
      color: 'text-green-600'
    },
    {
      title: 'Availability > 40 %',
      value: '100%',
      color: 'text-green-600'
    },
    {
      title: 'Property rating > 4',
      value: '3.93',
      color: 'text-orange-600'
    }
  ];

  const formatCurrency = (value) => `₹${value.toLocaleString()}`;

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Hotel Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowHotelSelector(!showHotelSelector)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
            >
              <span className="text-sm font-medium">
                {selectedHotels.length === 1 
                  ? hotels.find(h => h.id === selectedHotels[0])?.name 
                  : `${selectedHotels.length} Hotels Selected`}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {showHotelSelector && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Select Hotels</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="p-3 hover:bg-gray-50 border-b border-gray-100">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedHotels.includes(hotel.id)}
                          onChange={() => toggleHotelSelection(hotel.id)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                          <div className="text-xs text-gray-500">{hotel.id} • {hotel.sector}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Time Period Selector */}
        <div className="flex items-center space-x-1 mb-6">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500 mb-6">{currentDate}</div>

        {/* Booking & Earnings Metrics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking & Revenue Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookingMetrics.map((metric, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm text-gray-600">{metric.title}</h3>
                    <metric.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advanced Analytics Dashboard */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Performance Analytics
                </h2>
                <p className="text-gray-600">Real-time insights for data-driven decisions</p>
              </div>
              <div className="flex space-x-3">
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-blue-200">
                  <div className="text-sm text-gray-500">Total Hotels</div>
                  <div className="text-lg font-bold text-blue-600">{selectedHotels.length}</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-green-200">
                  <div className="text-sm text-gray-500">Avg. Occupancy</div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(((aggregatedData.totalRooms - aggregatedData.todayVacantRooms) / aggregatedData.totalRooms) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Combined Chart View */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Revenue & Booking Trends</h3>
                    <p className="text-sm text-gray-500">Last 30 days performance overview</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Bookings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Earnings</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={dayWiseData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="bookings"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="earnings"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#d1d5db' }}
                    formatter={(value, name) => [
                      name === 'bookings' ? `${value} bookings` : formatCurrency(value),
                      name === 'bookings' ? 'Bookings' : 'Earnings'
                    ]}
                  />
                  <Line 
                    yAxisId="bookings"
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                    fill="url(#bookingGradient)"
                  />
                  <Line 
                    yAxisId="earnings"
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                    fill="url(#earningGradient)"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Booking Analysis */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Booking Distribution
                </h2>
                <p className="text-gray-600">Daily booking patterns and trends</p>
              </div>
              <div className="flex space-x-2">
                <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-purple-200">
                  <span className="text-xs text-purple-600 font-medium">Peak: {Math.max(...dayWiseData.map(d => d.bookings))} bookings</span>
                </div>
                <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-purple-200">
                  <span className="text-xs text-purple-600 font-medium">Avg: {Math.round(dayWiseData.reduce((sum, d) => sum + d.bookings, 0) / dayWiseData.length)} bookings</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Daily Booking Volume</h3>
                    <p className="text-sm text-gray-500">Interactive booking analysis</p>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dayWiseData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                  <XAxis 
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#d1d5db' }}
                    formatter={(value) => [`${value} bookings`, 'Bookings']}
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OYODashboard;