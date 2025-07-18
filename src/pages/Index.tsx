import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import OYODashboard from '../components/OYODashboard';
import BookingManagement from '../components/BookingManagement';
import InventoryManagement from '../components/InventoryManagement';
import HotelsManagement from '../components/HotelsManagement';
import RoomsManagement from '../components/RoomsManagement';
import MenuManagement from '../components/MenuManagement';
import GuestDirectory from '../components/GuestDirectory';
import ExpenseManagement from '../components/ExpenseManagement';
import PaymentsManagement from '../components/PaymentsManagement';
import BookingReport from '../components/BookingReport';
import EarningReport from '../components/EarningReport';
import RoomWiseEarningReport from '../components/RoomWiseEarningReport';

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
      case 'booking':
        return <BookingManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'hotels':
        return <HotelsManagement />;
      case 'rooms':
        return <RoomsManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'guest-directory':
        return <GuestDirectory />;
      case 'expense':
        return <ExpenseManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'booking-report':
        return <BookingReport />;
      case 'earning-report':
        return <EarningReport />;
      case 'room-wise-earning':
        return <RoomWiseEarningReport />;
      default:
        return <OYODashboard hotelInfo={hotelInfo} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Index;
