
import React from 'react';
import { MapPin, Users, DollarSign, Star, Settings, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HotelCardProps {
  hotel: {
    id: number;
    name: string;
    location: string;
    totalRooms: number;
    occupiedRooms: number;
    revenue: number;
    rating: number;
    image: string;
  };
  userRole: string;
}

const HotelCard = ({ hotel, userRole }: HotelCardProps) => {
  const occupancyRate = Math.round((hotel.occupiedRooms / hotel.totalRooms) * 100);
  
  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{hotel.rating}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{hotel.location}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{hotel.totalRooms}</div>
            <div className="text-xs text-gray-600">Total Rooms</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{occupancyRate}%</div>
            <div className="text-xs text-gray-600">Occupancy</div>
          </div>
        </div>

        {/* Revenue and Status */}
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
            <div className="text-lg font-bold text-gray-900">₹{hotel.revenue.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Occupied</div>
            <div className="text-lg font-bold text-orange-600">{hotel.occupiedRooms}/{hotel.totalRooms}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-blue-50 hover:border-blue-300"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          {(userRole === 'super-admin' || userRole === 'hotel-admin') && (
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="mt-3 flex items-center justify-center">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            occupancyRate > 80 
              ? 'bg-red-100 text-red-800' 
              : occupancyRate > 60 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              occupancyRate > 80 ? 'bg-red-500' : occupancyRate > 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            {occupancyRate > 80 ? 'High Demand' : occupancyRate > 60 ? 'Moderate' : 'Available'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
