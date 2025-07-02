
import React from 'react';
import { Hotel, Users, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardProps {
  hotels: any[];
  userRole: string;
}

const Dashboard = ({ hotels, userRole }: DashboardProps) => {
  const totalRevenue = hotels.reduce((sum, hotel) => sum + hotel.revenue, 0);
  const totalRooms = hotels.reduce((sum, hotel) => sum + hotel.totalRooms, 0);
  const totalOccupied = hotels.reduce((sum, hotel) => sum + hotel.occupiedRooms, 0);
  const occupancyRate = Math.round((totalOccupied / totalRooms) * 100);

  const stats = [
    {
      title: userRole === 'super-admin' ? 'Total Hotels' : 'My Hotel Properties',
      value: userRole === 'super-admin' ? hotels.length : 1,
      icon: Hotel,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Total Rooms',
      value: userRole === 'super-admin' ? totalRooms : 120,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      change: '+5%'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userRole.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}!
        </h1>
        <p className="text-blue-100">
          {userRole === 'super-admin' 
            ? 'Manage all your hotel properties from this central dashboard'
            : 'Monitor your hotel operations and guest experience'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New booking received', hotel: 'Grand Plaza Hotel', time: '2 min ago', type: 'booking' },
                { action: 'Room 205 checked out', hotel: 'Ocean View Resort', time: '15 min ago', type: 'checkout' },
                { action: 'Kitchen order #1247', hotel: 'Mountain Retreat', time: '1 hour ago', type: 'order' },
                { action: 'Payment received', hotel: 'Grand Plaza Hotel', time: '2 hours ago', type: 'payment' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.hotel}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Today's Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Check-ins Today</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Check-outs Today</p>
                  <p className="text-2xl font-bold text-blue-600">18</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Pending Bookings</p>
                  <p className="text-2xl font-bold text-orange-600">7</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Revenue Today</p>
                  <p className="text-2xl font-bold text-purple-600">₹45,200</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Room Status</p>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Available: 89</span>
                  <span className="text-orange-600">Occupied: 145</span>
                  <span className="text-red-600">Maintenance: 6</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
