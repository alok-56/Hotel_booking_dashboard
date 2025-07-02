
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Star, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OYODashboardProps {
  hotelInfo: {
    id: string;
    name: string;
    sector: string;
  };
}

const OYODashboard = ({ hotelInfo }: OYODashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [currentDate] = useState('01 Jun-30 Jun');

  const periods = ['Last 30 days', 'Last 7 days', 'Today', 'This Month'];

  const metrics = [
    {
      title: 'OYO Reviews',
      value: '0',
      subtitle: 'Area best- 1',
      location: 'Smriti Villa',
      color: 'text-gray-600'
    },
    {
      title: 'Check-in Issues',
      value: '0',
      subtitle: 'Area best- 1',
      location: 'HOTEL SKYSPACE',
      color: 'text-gray-600'
    },
    {
      title: 'Check-in % (-)',
      value: '-',
      subtitle: 'Area best- 38%',
      location: 'R S Hotels',
      color: 'text-gray-600'
    },
    {
      title: 'DSRN % (+100%)',
      value: '3%',
      subtitle: 'Area best- 125%',
      location: 'Elite Stay',
      color: 'text-green-600'
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

  const recommendations = [
    {
      title: 'REVMAX',
      subtitle: 'Up to 5X more visibility and upto 70% higher ADR',
      color: 'bg-red-50 border-red-200'
    },
    {
      title: 'REVIEW BOOST',
      subtitle: 'Increase high quality reviews of your property',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'DISCOVER OYO',
      subtitle: 'Welcome guests even on low demand days',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'CORPORATE CREDIT',
      subtitle: 'Increase corporate bookings and revenue',
      color: 'bg-gray-50 border-gray-200'
    }
  ];

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
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-orange-600">{hotelInfo.id}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{hotelInfo.id}</p>
                <p className="text-xs text-gray-500">{hotelInfo.name}</p>
              </div>
            </div>
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-600">{metric.title}</h3>
                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className={`text-2xl font-bold mb-2 ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-gray-500">
                  <div>{metric.subtitle}</div>
                  <div>{metric.location}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Urgent Action Alert */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Urgent Action Required! Please review and acknowledge the policy around Booking.com operations to prevent any negative impact on your business
                </h3>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Super OYO Section */}
        <Card className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">
                  Become a <span className="text-red-500">♥ SUPER</span><span className="text-red-600">OYO</span>
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">60 Days left</span>
                <Button variant="outline" className="text-gray-900">
                  View Super OYO's Benefits
                </Button>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              Meet your targets to become a Super OYO to get its benefits and potentially earn higher revenue.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {superOyoTargets.map((target, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {target.title.includes('Check-in denials') && <Calendar className="h-4 w-4" />}
                      {target.title.includes('star ratings') && <Star className="h-4 w-4" />}
                      {target.title.includes('Availability') && <TrendingUp className="h-4 w-4" />}
                      {target.title.includes('Property rating') && <Star className="h-4 w-4" />}
                      <span className="text-sm text-white">{target.title}</span>
                    </div>
                    {target.subtitle && (
                      <p className="text-xs text-orange-300">{target.subtitle}</p>
                    )}
                  </div>
                  <div className={`text-lg font-bold ${target.color === 'text-green-600' ? 'text-green-400' : 'text-orange-400'}`}>
                    {target.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top 5 recommendations for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className={`border-2 ${rec.color} cursor-pointer hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">{rec.title}</h3>
                      <p className="text-xs text-gray-600">{rec.subtitle}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OYODashboard;
