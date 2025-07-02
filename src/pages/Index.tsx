import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import OYODashboard from '../components/OYODashboard';
import HotelCard from '../components/HotelCard';
import Dashboard from '../components/Dashboard';
import BookingManagement from '../components/BookingManagement';
import { Hotel, Calendar, BarChart3, DollarSign, Users, HelpCircle, FileText, Settings, Scale } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('growth');
  const [userRole] = useState('super-admin');

  const hotelInfo = {
    id: 'KOL1560',
    name: 'Hotel Brill Sector 2',
    sector: 'Sector 2'
  };

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

  const renderContent = () => {
    switch (activeSection) {
      case 'growth':
        return <OYODashboard hotelInfo={hotelInfo} />;
      case 'bookings':
        return <BookingManagement />;
      case 'pricing':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Pricing Management</h2>
              </div>
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Dynamic pricing and rate management</p>
              </div>
            </div>
          </div>
        );
      case 'operations':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div>
              <div className="flex items-center mb-6">
                <Settings className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Hotel Operations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} userRole={userRole} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'guest-directory':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Guest Directory</h2>
              </div>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Guest information and communication</p>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <HelpCircle className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
              </div>
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Get help or raise a support ticket</p>
              </div>
            </div>
          </div>
        );
      case 'earnings':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Earnings Overview</h2>
              </div>
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Revenue and earnings analytics</p>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              </div>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Detailed reports and analytics dashboard</p>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-gray-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              </div>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">System settings and configuration</p>
              </div>
            </div>
          </div>
        );
      case 'legal':
        return (
          <div className="flex-1 bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Legal</h2>
              </div>
              <div className="text-center py-12">
                <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Legal documents and compliance</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard hotels={mockHotels} userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      {renderContent()}
    </div>
  );
};

export default Index;
