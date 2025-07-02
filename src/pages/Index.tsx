
import React, { useState } from 'react';
import { Hotel, Users, Calendar, DollarSign, BarChart3, Settings } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import Dashboard from '../components/Dashboard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState('super-admin');

  const mockHotels = [
    {
      id: 1,
      name: "Grand Plaza Hotel",
      location: "Mumbai, Maharashtra",
      totalRooms: 120,
      occupiedRooms: 89,
      revenue: 45000,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
    },
    {
      id: 2,
      name: "Ocean View Resort",
      location: "Goa, India",
      totalRooms: 80,
      occupiedRooms: 72,
      revenue: 38000,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840"
    },
    {
      id: 3,
      name: "Mountain Retreat",
      location: "Shimla, Himachal Pradesh",
      totalRooms: 60,
      occupiedRooms: 45,
      revenue: 28000,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HotelPro</h1>
                <p className="text-xs text-gray-500">Multi-Hotel Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={userRole} 
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="super-admin">Super Admin</option>
                <option value="hotel-admin">Hotel Admin</option>
                <option value="receptionist">Receptionist</option>
                <option value="kitchen-staff">Kitchen Staff</option>
              </select>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12">
            {['dashboard', 'hotels', 'bookings', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentView(tab)}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                  currentView === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'dashboard' && <BarChart3 className="h-4 w-4 mr-2" />}
                {tab === 'hotels' && <Hotel className="h-4 w-4 mr-2" />}
                {tab === 'bookings' && <Calendar className="h-4 w-4 mr-2" />}
                {tab === 'reports' && <DollarSign className="h-4 w-4 mr-2" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard hotels={mockHotels} userRole={userRole} />}
        
        {currentView === 'hotels' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Hotel Properties</h2>
              {userRole === 'super-admin' && (
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                  <Hotel className="h-4 w-4 mr-2" />
                  Add Hotel
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} userRole={userRole} />
              ))}
            </div>
          </div>
        )}

        {currentView === 'bookings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Management</h2>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Booking calendar and management interface coming soon!</p>
            </div>
          </div>
        )}

        {currentView === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Advanced reporting dashboard coming soon!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
