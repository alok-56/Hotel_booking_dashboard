import React from 'react';
import { Calendar, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const BookingReport = () => {
  const bookingData = [
    { month: 'Jan', bookings: 450, revenue: 2250000 },
    { month: 'Feb', bookings: 520, revenue: 2600000 },
    { month: 'Mar', bookings: 480, revenue: 2400000 },
    { month: 'Apr', bookings: 680, revenue: 3400000 },
    { month: 'May', bookings: 750, revenue: 3750000 },
    { month: 'Jun', bookings: 820, revenue: 4100000 }
  ];

  const recentBookings = [
    { id: 'BK001', guest: 'John Doe', hotel: 'Grand Plaza Hotel', checkIn: '2024-01-15', checkOut: '2024-01-18', amount: 15000, status: 'Confirmed' },
    { id: 'BK002', guest: 'Sarah Smith', hotel: 'Ocean View Resort', checkIn: '2024-01-16', checkOut: '2024-01-20', amount: 28000, status: 'Checked-in' },
    { id: 'BK003', guest: 'Mike Johnson', hotel: 'Mountain Retreat', checkIn: '2024-01-17', checkOut: '2024-01-19', amount: 12000, status: 'Pending' }
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Reports</h1>
        <p className="text-gray-600">Analyze booking trends and performance</p>
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

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,180</div>
            <p className="text-xs text-muted-foreground">95% confirmation rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">65</div>
            <p className="text-xs text-muted-foreground">5% cancellation rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹18,500</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Booking Trends</CardTitle>
            <CardDescription>Booking count over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {bookingData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-blue-500 w-full rounded-t"
                    style={{ height: `${(data.bookings / 1000) * 200}px` }}
                  ></div>
                  <span className="text-xs mt-2">{data.month}</span>
                  <span className="text-xs text-gray-500">{data.bookings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Revenue generated from bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {bookingData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-green-500 w-full rounded-t"
                    style={{ height: `${(data.revenue / 5000000) * 200}px` }}
                  ></div>
                  <span className="text-xs mt-2">{data.month}</span>
                  <span className="text-xs text-gray-500">₹{(data.revenue / 100000).toFixed(1)}L</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Booking ID</th>
                  <th className="text-left py-3 px-4 font-medium">Guest</th>
                  <th className="text-left py-3 px-4 font-medium">Hotel</th>
                  <th className="text-left py-3 px-4 font-medium">Check-in</th>
                  <th className="text-left py-3 px-4 font-medium">Check-out</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{booking.id}</td>
                    <td className="py-3 px-4">{booking.guest}</td>
                    <td className="py-3 px-4">{booking.hotel}</td>
                    <td className="py-3 px-4">{booking.checkIn}</td>
                    <td className="py-3 px-4">{booking.checkOut}</td>
                    <td className="py-3 px-4 font-medium">₹{booking.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'Checked-in' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
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

export default BookingReport;