
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import OYODashboard from '../components/OYODashboard';
import HotelCard from '../components/HotelCard';
import Dashboard from '../components/Dashboard';
import BookingManagement from '../components/BookingManagement';
import PricingManagement from '../components/PricingManagement';
import OperationsManagement from '../components/OperationsManagement';
import GuestDirectory from '../components/GuestDirectory';
import HelpSupport from '../components/HelpSupport';
import EarningsOverview from '../components/EarningsOverview';
import ReportsAnalytics from '../components/ReportsAnalytics';
import SettingsPanel from '../components/SettingsPanel';
import LegalCompliance from '../components/LegalCompliance';
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
        return <PricingManagement />;
      case 'operations':
        return <OperationsManagement hotels={mockHotels} userRole={userRole} />;
      case 'guest-directory':
        return <GuestDirectory />;
      case 'help':
        return <HelpSupport />;
      case 'earnings':
        return <EarningsOverview />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <SettingsPanel />;
      case 'legal':
        return <LegalCompliance />;
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
