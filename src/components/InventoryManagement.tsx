import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Calendar, Building, ChevronDown, TrendingUp, TrendingDown, AlertTriangle, Bed, Users, Home, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const InventoryManagement = () => {
  const [selectedHotels, setSelectedHotels] = useState(['hotel1']);
  const [startDate, setStartDate] = useState('2024-07-14');
  const [endDate, setEndDate] = useState('2024-07-20');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms');

  const hotels = [
    { id: 'hotel1', name: 'Grand Plaza Hotel', location: 'Mumbai', totalRooms: 150 },
    { id: 'hotel2', name: 'Royal Residency', location: 'Delhi', totalRooms: 120 },
    { id: 'hotel3', name: 'Ocean View Resort', location: 'Goa', totalRooms: 200 },
    { id: 'hotel4', name: 'Mountain Lodge', location: 'Shimla', totalRooms: 80 }
  ];

  // Sample room data for different hotels and dates
  const roomData = {
    hotel1: {
      '2024-07-14': { totalRooms: 150, soldRooms: 120, availableRooms: 30, occupancyRate: 80 },
      '2024-07-15': { totalRooms: 150, soldRooms: 135, availableRooms: 15, occupancyRate: 90 },
      '2024-07-16': { totalRooms: 150, soldRooms: 145, availableRooms: 5, occupancyRate: 97 },
      '2024-07-17': { totalRooms: 150, soldRooms: 142, availableRooms: 8, occupancyRate: 95 },
      '2024-07-18': { totalRooms: 150, soldRooms: 138, availableRooms: 12, occupancyRate: 92 },
      '2024-07-19': { totalRooms: 150, soldRooms: 125, availableRooms: 25, occupancyRate: 83 },
      '2024-07-20': { totalRooms: 150, soldRooms: 110, availableRooms: 40, occupancyRate: 73 }
    },
    hotel2: {
      '2024-07-14': { totalRooms: 120, soldRooms: 85, availableRooms: 35, occupancyRate: 71 },
      '2024-07-15': { totalRooms: 120, soldRooms: 95, availableRooms: 25, occupancyRate: 79 },
      '2024-07-16': { totalRooms: 120, soldRooms: 110, availableRooms: 10, occupancyRate: 92 },
      '2024-07-17': { totalRooms: 120, soldRooms: 105, availableRooms: 15, occupancyRate: 88 },
      '2024-07-18': { totalRooms: 120, soldRooms: 100, availableRooms: 20, occupancyRate: 83 },
      '2024-07-19': { totalRooms: 120, soldRooms: 90, availableRooms: 30, occupancyRate: 75 },
      '2024-07-20': { totalRooms: 120, soldRooms: 80, availableRooms: 40, occupancyRate: 67 }
    },
    hotel3: {
      '2024-07-14': { totalRooms: 200, soldRooms: 180, availableRooms: 20, occupancyRate: 90 },
      '2024-07-15': { totalRooms: 200, soldRooms: 190, availableRooms: 10, occupancyRate: 95 },
      '2024-07-16': { totalRooms: 200, soldRooms: 195, availableRooms: 5, occupancyRate: 98 },
      '2024-07-17': { totalRooms: 200, soldRooms: 185, availableRooms: 15, occupancyRate: 93 },
      '2024-07-18': { totalRooms: 200, soldRooms: 175, availableRooms: 25, occupancyRate: 88 },
      '2024-07-19': { totalRooms: 200, soldRooms: 160, availableRooms: 40, occupancyRate: 80 },
      '2024-07-20': { totalRooms: 200, soldRooms: 150, availableRooms: 50, occupancyRate: 75 }
    },
    hotel4: {
      '2024-07-14': { totalRooms: 80, soldRooms: 60, availableRooms: 20, occupancyRate: 75 },
      '2024-07-15': { totalRooms: 80, soldRooms: 70, availableRooms: 10, occupancyRate: 88 },
      '2024-07-16': { totalRooms: 80, soldRooms: 75, availableRooms: 5, occupancyRate: 94 },
      '2024-07-17': { totalRooms: 80, soldRooms: 72, availableRooms: 8, occupancyRate: 90 },
      '2024-07-18': { totalRooms: 80, soldRooms: 68, availableRooms: 12, occupancyRate: 85 },
      '2024-07-19': { totalRooms: 80, soldRooms: 65, availableRooms: 15, occupancyRate: 81 },
      '2024-07-20': { totalRooms: 80, soldRooms: 55, availableRooms: 25, occupancyRate: 69 }
    }
  };

  const inventoryData = {
    hotel1: {
      items: [
        { id: 1, name: 'Premium Towels', category: 'Linens', quantity: 150, minStock: 50, status: 'In Stock', trend: 'up', usage: 45 },
        { id: 2, name: 'Egyptian Cotton Sheets', category: 'Linens', quantity: 200, minStock: 75, status: 'In Stock', trend: 'stable', usage: 32 },
        { id: 3, name: 'Luxury Toiletries Set', category: 'Bathroom', quantity: 25, minStock: 30, status: 'Low Stock', trend: 'down', usage: 78 },
        { id: 4, name: 'Eco-Friendly Cleaning Supplies', category: 'Maintenance', quantity: 80, minStock: 40, status: 'In Stock', trend: 'up', usage: 52 }
      ]
    },
    hotel2: {
      items: [
        { id: 5, name: 'Standard Towels', category: 'Linens', quantity: 120, minStock: 40, status: 'In Stock', trend: 'stable', usage: 38 },
        { id: 6, name: 'Cotton Bed Sheets', category: 'Linens', quantity: 180, minStock: 60, status: 'In Stock', trend: 'up', usage: 42 },
        { id: 7, name: 'Basic Toiletries', category: 'Bathroom', quantity: 15, minStock: 25, status: 'Low Stock', trend: 'down', usage: 85 },
        { id: 8, name: 'Standard Cleaning Kit', category: 'Maintenance', quantity: 60, minStock: 30, status: 'In Stock', trend: 'stable', usage: 48 }
      ]
    }
  };

  const generateDateRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoomDataForDate = (date) => {
    let totalRooms = 0;
    let soldRooms = 0;
    let availableRooms = 0;
    let totalOccupancy = 0;
    let hotelCount = 0;

    selectedHotels.forEach(hotelId => {
      if (roomData[hotelId] && roomData[hotelId][date]) {
        const data = roomData[hotelId][date];
        totalRooms += data.totalRooms;
        soldRooms += data.soldRooms;
        availableRooms += data.availableRooms;
        totalOccupancy += data.occupancyRate;
        hotelCount++;
      }
    });

    return {
      totalRooms,
      soldRooms,
      availableRooms,
      avgOccupancyRate: hotelCount > 0 ? Math.round(totalOccupancy / hotelCount) : 0
    };
  };

  const getInventoryData = () => {
    const combinedItems = [];
    selectedHotels.forEach(hotelId => {
      if (inventoryData[hotelId]) {
        inventoryData[hotelId].items.forEach(item => {
          combinedItems.push({
            ...item,
            hotel: hotels.find(h => h.id === hotelId)?.name
          });
        });
      }
    });
    return combinedItems;
  };

  const dateRange = generateDateRange(startDate, endDate);
  const inventoryItems = getInventoryData();
  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHotelToggle = (hotelId) => {
    setSelectedHotels(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <div className="h-3 w-3 rounded-full bg-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-orange-100 text-orange-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 70) return 'bg-yellow-500';
    if (rate >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Inventory</h1>
          <p className="text-gray-600">Monitor room availability and inventory across selected properties</p>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Hotel Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Select Hotels
                </label>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setShowHotelDropdown(!showHotelDropdown)}
                  >
                    <span className="truncate">
                      {selectedHotels.length === 1 
                        ? hotels.find(h => h.id === selectedHotels[0])?.name
                        : `${selectedHotels.length} hotels selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                  
                  {showHotelDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="py-1">
                        {hotels.map(hotel => (
                          <label key={hotel.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedHotels.includes(hotel.id)}
                              onChange={() => handleHotelToggle(hotel.id)}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium text-sm">{hotel.name}</div>
                              <div className="text-xs text-gray-500">{hotel.location} • {hotel.totalRooms} rooms</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Items
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search inventory items..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'rooms' ? 'default' : 'outline'}
            onClick={() => setActiveTab('rooms')}
            className="flex items-center gap-2"
          >
            <Bed className="h-4 w-4" />
            Room Availability
          </Button>
          <Button
            variant={activeTab === 'inventory' ? 'default' : 'outline'}
            onClick={() => setActiveTab('inventory')}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Inventory Management
          </Button>
        </div>

        {/* Room Availability Tab */}
        {activeTab === 'rooms' && (
          <div>
            {/* Room Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dateRange.map(date => {
                const data = getRoomDataForDate(date);
                return (
                  <Card key={date} className="border-0 shadow-lg">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600 mb-1">{getDayName(date)}</div>
                        <div className="text-lg font-bold text-gray-900 mb-2">{getFormattedDate(date)}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Rooms:</span>
                            <span className="font-medium">{data.totalRooms}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Sold:</span>
                            <span className="font-medium text-green-600">{data.soldRooms}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Available:</span>
                            <span className="font-medium text-blue-600">{data.availableRooms}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Occupancy</span>
                              <span className="font-medium">{data.avgOccupancyRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getOccupancyColor(data.avgOccupancyRate)}`}
                                style={{ width: `${data.avgOccupancyRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

           
          </div>
        )}

        {/* Inventory Management Tab */}
        {activeTab === 'inventory' && (
          <div>
            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filter
                </Button>
                <span className="text-sm text-gray-600">
                  {filteredItems.length} items found
                </span>
              </div>
             
            </div>

            {/* Inventory Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="text-xl">Inventory Items</CardTitle>
                <CardDescription>
                  Showing inventory for selected hotels from {getFormattedDate(startDate)} to {getFormattedDate(endDate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Item Details</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Hotel</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock Level</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Usage</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item, index) => (
                        <tr key={item.id} className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <Package className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">ID: {item.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm font-medium text-gray-900">{item.hotel}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="text-sm">
                                <div className="font-medium">{item.quantity}</div>
                                <div className="text-gray-500">Min: {item.minStock}</div>
                              </div>
                              <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${item.quantity <= item.minStock ? 'bg-red-500' : 'bg-green-500'}`}
                                  style={{ width: `${Math.min((item.quantity / (item.minStock * 2)) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{item.usage}%</div>
                              {getTrendIcon(item.trend)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="text-xs">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs">
                                Reorder
                              </Button>
                            </div>
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card className="mt-6 border-0 shadow-lg border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Stock Alert</h3>
                    <p className="text-gray-600 mb-4">
                      {filteredItems.filter(item => item.status === 'Low Stock').length} items are running low on stock and need immediate attention.
                    </p>
                    <div className="space-y-2">
                      {filteredItems
                        .filter(item => item.status === 'Low Stock')
                        .map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-3">
                              <Package className="h-4 w-4 text-orange-600" />
                              <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-600">{item.hotel} • {item.category}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{item.quantity} left</div>
                                <div className="text-xs text-gray-500">Min: {item.minStock}</div>
                              </div>
                              <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                                Reorder Now
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;