
import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Settings, 
  Users, 
  HelpCircle, 
  FileText, 
  BarChart3, 
  Scale,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'operations', label: 'Operations', icon: Settings, hasSubmenu: true },
    { id: 'guest-directory', label: 'Guest Directory', icon: Users, hasSubmenu: true },
    { id: 'help', label: 'Help/Raise a ticket', icon: HelpCircle },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3, hasSubmenu: true },
    { id: 'settings', label: 'Settings', icon: Settings, hasSubmenu: true },
    { id: 'legal', label: 'Legal', icon: Scale, hasSubmenu: true },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">
            OYO
          </div>
          <span className="font-semibold text-gray-800">OS</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
              activeSection === item.id ? 'bg-gray-50 border-r-2 border-red-600' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className={`h-5 w-5 ${
                activeSection === item.id ? 'text-red-600' : 'text-gray-500'
              }`} />
              <span className={`text-sm ${
                activeSection === item.id ? 'text-red-600 font-medium' : 'text-gray-700'
              }`}>
                {item.label}
              </span>
            </div>
            {item.hasSubmenu && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">MN</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Md Naz...</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
