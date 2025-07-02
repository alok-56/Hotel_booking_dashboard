
import React, { useState } from 'react';
import { Users, Search, Filter, Phone, Mail, Calendar, MapPin, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GuestDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  const guests = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      checkIn: '2025-01-15',
      checkOut: '2025-01-18',
      room: '201',
      status: 'checked-in',
      visits: 3,
      preference: 'Non-smoking',
      address: 'Mumbai, Maharashtra',
      totalSpent: 45000
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      checkIn: '2025-01-16',
      checkOut: '2025-01-19',
      room: '305',
      status: 'checked-in',
      visits: 1,
      preference: 'High floor',
      address: 'Delhi, India',
      totalSpent: 12000
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+91 76543 21098',
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
      room: '102',
      status: 'checked-out',
      visits: 5,
      preference: 'Early check-in',
      address: 'Ahmedabad, Gujarat',
      totalSpent: 78000
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 65432 10987',
      checkIn: '2025-01-20',
      checkOut: '2025-01-23',
      room: '420',
      status: 'upcoming',
      visits: 2,
      preference: 'Twin beds',
      address: 'Hyderabad, Telangana',
      totalSpent: 32000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return 'text-green-600 bg-green-100';
      case 'checked-out': return 'text-gray-600 bg-gray-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guest Directory</h1>
            <p className="text-gray-600">Manage guest information and communication</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Guests</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Currently Checked In</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Repeat Guests</p>
                  <p className="text-2xl font-bold text-gray-900">342</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">VIP Guests</p>
                  <p className="text-2xl font-bold text-gray-900">28</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search guests by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Guest List */}
            <div className="space-y-4">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedGuest(guest)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {guest.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {guest.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {guest.phone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {guest.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Room {guest.room}</p>
                          <p className="text-xs text-gray-600">{guest.checkIn} - {guest.checkOut}</p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(guest.status)}`}>
                            {guest.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <p className="text-sm text-gray-600">{guest.visits} visits • ₹{guest.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {guest.preference && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Preference: {guest.preference}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuestDirectory;
