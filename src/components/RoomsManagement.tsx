import React from 'react';
import { Bed, Plus, Search, Filter, Wifi, Coffee, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

const RoomsManagement = () => {
  const rooms = [
    {
      id: 101,
      type: 'Deluxe Single',
      hotel: 'Grand Plaza Hotel',
      status: 'Available',
      price: 2500,
      amenities: ['WiFi', 'AC', 'TV'],
      capacity: 1,
      floor: 1
    },
    {
      id: 201,
      type: 'Premium Double',
      hotel: 'Grand Plaza Hotel',
      status: 'Occupied',
      price: 4500,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
      capacity: 2,
      floor: 2
    },
    {
      id: 301,
      type: 'Executive Suite',
      hotel: 'Ocean View Resort',
      status: 'Maintenance',
      price: 8500,
      amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
      capacity: 4,
      floor: 3
    },
    {
      id: 102,
      type: 'Standard Single',
      hotel: 'Mountain Retreat',
      status: 'Available',
      price: 1800,
      amenities: ['WiFi', 'AC', 'TV'],
      capacity: 1,
      floor: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
        <p className="text-gray-600">Manage room availability, pricing, and amenities</p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search rooms..." className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Room Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,450</div>
            <p className="text-xs text-muted-foreground">Across all hotels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Bed className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">890</div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Bed className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">520</div>
            <p className="text-xs text-muted-foreground">Currently booked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Bed className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">40</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>Manage your hotel rooms and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Room No.</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Hotel</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Price/Night</th>
                  <th className="text-left py-3 px-4 font-medium">Capacity</th>
                  <th className="text-left py-3 px-4 font-medium">Amenities</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{room.id}</td>
                    <td className="py-3 px-4">{room.type}</td>
                    <td className="py-3 px-4">{room.hotel}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(room.status)}>
                        {room.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">₹{room.price.toLocaleString()}</td>
                    <td className="py-3 px-4">{room.capacity} Guest{room.capacity > 1 ? 's' : ''}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
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

export default RoomsManagement;