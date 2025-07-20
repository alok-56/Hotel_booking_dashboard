import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import LoginPage from '../components/LoginPage';
import OYODashboard from '../components/OYODashboard';
import BookingManagement from '../components/BookingManagement';
import InventoryManagement from '../components/InventoryManagement';
import HotelsManagement from '../components/HotelsManagement';
import RoomsManagement from '../components/RoomsManagement';
import MenuManagement from '../components/MenuManagement';
import GuestDirectory from '../components/GuestDirectory';
import AdminManagement from '../components/AdminManagement';
import QueryManagement from '../components/QueryManagement';
import B2BManagement from '../components/B2BManagement';
import ExpenseManagement from '../components/ExpenseManagement';
import PaymentsManagement from '../components/PaymentsManagement';
import BookingReport from '../components/BookingReport';
import EarningReport from '../components/EarningReport';


const Index = () => {
  const [activeSection, setActiveSection] = useState('growth');
  const [userRole] = useState('super-admin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveSection('growth');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'growth':
        return <OYODashboard />;
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
      case 'admin-management':
        return <AdminManagement />;
      case 'query':
        return <QueryManagement />;
      case 'b2b':
        return <B2BManagement />;
      case 'expense':
        return <ExpenseManagement />;
      case 'payments':
        return <PaymentsManagement />;
      case 'booking-report':
        return <BookingReport />;
      case 'earning-report':
        return <EarningReport />;
     
      default:
        return <OYODashboard />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} onLogout={handleLogout} />
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default Index;
