import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Star, Calendar, TrendingUp, Search, Check, ChevronDown, BarChart3, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAllHotels } from '@/api/Services/Hotel/hotel';
import { getDailyBookingsChart, getDashboardCounts, getRevenueVsBookingChart } from '@/api/Services/Report/report';

interface Hotel {
  _id: string;
  hotelName: string;
  city: string;
  state: string;
  address: string;
  starRating: number;
  facilities: string[];
  // Add any additional fields you need for calculations
  todayBookings?: number;
  todayEarnings?: number;
  todayVacantRooms?: number;
  lastMonthBookings?: number;
  lastMonthEarnings?: number;
  totalRooms?: number;
  allTimeBookings?: number;
  allTimeEarnings?: number;
}

interface DashboardCounts {
  todayBookings: number;
  todayEarnings: number;
  todayVacantRooms: number;
  lastMonthBookings: number;
  lastMonthEarnings: number;
  totalRooms: number;
  allTimeBookings: number;
  allTimeEarnings: number;
  selectedHotelsCount: number;
  totalHotelsCount: number;
}

const OYODashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [showHotelSelector, setShowHotelSelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  
  // API Data State
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts | null>(null);
  const [revenueBookingData, setRevenueBookingData] = useState<any[]>([]);
  const [dailyBookingsData, setDailyBookingsData] = useState<any[]>([]);
  const [chartSummary, setChartSummary] = useState<any>(null);
  const [bookingAnalytics, setBookingAnalytics] = useState<any>(null);

  // Period mapping for API calls
  const periodMapping = {
    'Today': 'today',
    'Last 7 days': 'last_7_days',
    'Last 15 days': 'last_15_days',
    'Last 30 days': 'last_30_days'
  };

  // Updated periods array to match API requirements
  const periods = ['Today', 'Last 7 days', 'Last 15 days', 'Last 30 days'];

  // Helper function to get API period value
  const getApiPeriod = (displayPeriod: string) => {
    return periodMapping[displayPeriod] || 'last_30_days';
  };

  // Fetch hotels from API
  const fetchHotels = async () => {
    setHotelsLoading(true);
    try {
      const response = await getAllHotels();
      if (response.status) {
        setHotels(response.data);
        // Auto-select first hotel if none selected
        if (selectedHotels.length === 0 && response.data.length > 0) {
          setSelectedHotels([response.data[0]._id]);
        }
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      // Fallback to empty array on error
      setHotels([]);
    } finally {
      setHotelsLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (selectedHotels.length === 0) return;
    
    setLoading(true);
    try {
      const apiPeriod = getApiPeriod(selectedPeriod);
      console.log('Fetching data with period:', apiPeriod); // Debug log
      
      // Fetch dashboard counts
      const counts = await getDashboardCounts(selectedHotels);
      if (counts && counts.success) {
        setDashboardCounts(counts.data);
      }

      // Fetch revenue vs booking chart data
      const revenueData = await getRevenueVsBookingChart(apiPeriod, selectedHotels);
      if (revenueData && revenueData.success && revenueData.data && revenueData.data.chartData) {
        setRevenueBookingData(revenueData.data.chartData);
        setChartSummary(revenueData.data.summary);
      }

      // Fetch daily bookings chart data
      const bookingsData = await getDailyBookingsChart(apiPeriod, selectedHotels);
      if (bookingsData && bookingsData.success && bookingsData.data && bookingsData.data.bookingData) {
        setDailyBookingsData(bookingsData.data.bookingData);
        setBookingAnalytics(bookingsData.data.analytics);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Reset data on error
      setRevenueBookingData([]);
      setDailyBookingsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels when component mounts
  useEffect(() => {
    fetchHotels();
  }, []);

  // Fetch dashboard data when hotels or period changes
  useEffect(() => {
    if (selectedHotels.length > 0) {
      fetchDashboardData();
    }
  }, [selectedHotels, selectedPeriod]);

  const toggleHotelSelection = (hotelId: string) => {
    setSelectedHotels(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  // Use API data if available, otherwise show zeros
  const getDisplayData = () => {
    if (dashboardCounts) {
      return dashboardCounts;
    }
    
    // Fallback data when no API data is available
    return {
      todayBookings: 0,
      todayEarnings: 0,
      todayVacantRooms: 0,
      lastMonthBookings: 0,
      lastMonthEarnings: 0,
      totalRooms: 0,
      allTimeBookings: 0,
      allTimeEarnings: 0,
      selectedHotelsCount: selectedHotels.length,
      totalHotelsCount: hotels.length
    };
  };

  const displayData = getDisplayData();

  const bookingMetrics = [
    {
      title: "Today's Booking",
      value: displayData.todayBookings?.toString() || '0',
      color: 'text-blue-600',
      icon: Calendar
    },
    {
      title: "Today's Earning",
      value: `₹${displayData.todayEarnings?.toLocaleString() || '0'}`,
      color: 'text-green-600',
      icon: TrendingUp
    },
    {
      title: "Today's Vacant Rooms",
      value: displayData.todayVacantRooms?.toString() || '0',
      color: 'text-orange-600',
      icon: Eye
    },
    {
      title: "Last Month Bookings",
      value: displayData.lastMonthBookings?.toString() || '0',
      color: 'text-purple-600',
      icon: Calendar
    },
    {
      title: "Last Month Earnings",
      value: `₹${displayData.lastMonthEarnings?.toLocaleString() || '0'}`,
      color: 'text-green-600',
      icon: TrendingUp
    },
    {
      title: "Total Rooms types",
      value: displayData.totalRooms?.toString() || '0',
      color: 'text-gray-600',
      icon: Eye
    },
    {
      title: "All Time Booking",
      value: displayData.allTimeBookings?.toString() || '0',
      color: 'text-indigo-600',
      icon: Calendar
    },
    {
      title: "All Time Earning",
      value: `₹${displayData.allTimeEarnings?.toLocaleString() || '0'}`,
      color: 'text-green-600',
      icon: TrendingUp
    }
  ];

  const formatCurrency = (value) => `₹${value.toLocaleString()}`;

  const occupancyRate = displayData.totalRooms > 0 
    ? Math.round(((displayData.totalRooms - displayData.todayVacantRooms) / displayData.totalRooms) * 100)
    : 0;

  const getSelectedHotelNames = () => {
    if (selectedHotels.length === 0) return 'No Hotels Selected';
    if (selectedHotels.length === 1) {
      const hotel = hotels.find(h => h._id === selectedHotels[0]);
      return hotel?.hotelName || 'Unknown Hotel';
    }
    return `${selectedHotels.length} Hotels Selected`;
  };

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
              disabled={loading || hotelsLoading}
            >
              <span className="text-sm font-medium">
                {hotelsLoading ? 'Loading Hotels...' : getSelectedHotelNames()}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            
            {showHotelSelector && !hotelsLoading && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Select Hotels</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {hotels.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p>No hotels available</p>
                    </div>
                  ) : (
                    hotels.map((hotel) => (
                      <div key={hotel._id} className="p-3 hover:bg-gray-50 border-b border-gray-100">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedHotels.includes(hotel._id)}
                            onChange={() => toggleHotelSelection(hotel._id)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{hotel.hotelName}</div>
                            <div className="text-xs text-gray-500">
                              {hotel.city}, {hotel.state} • {hotel.starRating}★
                            </div>
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading && (
          <div className="fixed top-0 right-0 m-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Loading data...</span>
            </div>
          </div>
        )}

        {/* Show message when no hotels are selected */}
        {selectedHotels.length === 0 && !hotelsLoading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please select at least one hotel to view dashboard data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Time Period Selector */}
        <div className="flex items-center space-x-1 mb-6">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              disabled={loading || selectedHotels.length === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 disabled:opacity-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>


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
                  <div className="text-sm text-gray-500">Selected Hotels</div>
                  <div className="text-lg font-bold text-blue-600">{selectedHotels.length}</div>
                </div>
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-green-200">
                  <div className="text-sm text-gray-500">Avg. Occupancy</div>
                  <div className="text-lg font-bold text-green-600">
                    {occupancyRate}%
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
                    <p className="text-sm text-gray-500">{selectedPeriod} performance overview</p>
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
                  {chartSummary && (
                    <div className="flex space-x-2 ml-4">
                      <div className="bg-blue-50 rounded-lg px-2 py-1 border border-blue-200">
                        <span className="text-xs text-blue-600 font-medium">
                          Peak Day: {chartSummary.peakDay} ({chartSummary.peakBookings} bookings)
                        </span>
                      </div>
                      <div className="bg-green-50 rounded-lg px-2 py-1 border border-green-200">
                        <span className="text-xs text-green-600 font-medium">
                          Total: ₹{chartSummary.totalEarnings?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <RechartsLineChart data={revenueBookingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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

              {revenueBookingData.length === 0 && !loading && selectedHotels.length > 0 && (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No data available for the selected period</p>
                  </div>
                </div>
              )}
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
              {dailyBookingsData.length > 0 && bookingAnalytics && (
                <div className="flex space-x-2">
                  <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-purple-200">
                    <span className="text-xs text-purple-600 font-medium">
                      Peak: {bookingAnalytics.peakBookings} bookings ({bookingAnalytics.peakBookingDay})
                    </span>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-purple-200">
                    <span className="text-xs text-purple-600 font-medium">
                      Avg: {Math.round(bookingAnalytics.averageBookingsPerDay)} bookings/day
                    </span>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-1 shadow-sm border border-purple-200">
                    <span className="text-xs text-purple-600 font-medium">
                      Total: {bookingAnalytics.totalBookings} bookings
                    </span>
                  </div>
                </div>
              )}
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
                <BarChart data={dailyBookingsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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

              {dailyBookingsData.length === 0 && !loading && selectedHotels.length > 0 && (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No booking data available for the selected period</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OYODashboard;