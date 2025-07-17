
import React, { useState } from 'react';
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
  ChevronRight,
  ChevronDown,
  Package,
  Building,
  Bed,
  UtensilsCrossed,
  Receipt,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems = [
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'booking', label: 'Booking', icon: Calendar },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { 
      id: 'hotel', 
      label: 'Hotel', 
      icon: Building, 
      hasSubmenu: true,
      submenu: [
        { id: 'hotels', label: 'Hotels', icon: Building },
        { id: 'rooms', label: 'Rooms', icon: Bed },
        { id: 'menu', label: 'Menu', icon: UtensilsCrossed }
      ]
    },
    { id: 'guest-directory', label: 'Guest Directory', icon: Users },
    { id: 'expense', label: 'Expense', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3, 
      hasSubmenu: true,
      submenu: [
        { id: 'booking-report', label: 'Booking', icon: Calendar },
        { id: 'earning-report', label: 'Earning', icon: DollarSign },
        { id: 'room-wise-earning', label: 'Room wise earning', icon: TrendingUp }
      ]
    },
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
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  toggleSubmenu(item.id);
                } else {
                  onSectionChange(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeSection === item.id || (item.submenu && item.submenu.some(sub => activeSection === sub.id)) 
                  ? 'bg-gray-50 border-r-2 border-red-600' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${
                  activeSection === item.id || (item.submenu && item.submenu.some(sub => activeSection === sub.id))
                    ? 'text-red-600' : 'text-gray-500'
                }`} />
                <span className={`text-sm ${
                  activeSection === item.id || (item.submenu && item.submenu.some(sub => activeSection === sub.id))
                    ? 'text-red-600 font-medium' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
              </div>
              {item.hasSubmenu && (
                expandedMenus.includes(item.id) 
                  ? <ChevronDown className="h-4 w-4 text-gray-400" />
                  : <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
            
            {/* Submenu */}
            {item.hasSubmenu && expandedMenus.includes(item.id) && item.submenu && (
              <div className="bg-gray-25 border-l-2 border-gray-100 ml-4">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onSectionChange(subItem.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                      activeSection === subItem.id ? 'bg-gray-100 text-red-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    <subItem.icon className={`h-4 w-4 ${
                      activeSection === subItem.id ? 'text-red-600' : 'text-gray-400'
                    }`} />
                    <span className="text-sm">{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
