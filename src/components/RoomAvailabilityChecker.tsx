import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Bed } from 'lucide-react';
import { searchRooms } from '@/api/Services/Hotel/hotel';
import { useToast } from '@/hooks/use-toast';

interface RoomAvailability {
  roomType: string;
  totalAvailable: number;
  currentlyBooked: number;
  availableUnits: number;
  price: number;
  amenities: string[];
}

interface RoomAvailabilityCheckerProps {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  onRoomSelect: (roomType: string, price: number) => void;
  selectedRoomType?: string;
}

const RoomAvailabilityChecker: React.FC<RoomAvailabilityCheckerProps> = ({
  hotelId,
  checkInDate,
  checkOutDate,
  onRoomSelect,
  selectedRoomType
}) => {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hotelId && checkInDate && checkOutDate) {
      checkAvailability();
    }
  }, [hotelId, checkInDate, checkOutDate]);

  const checkAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await searchRooms(hotelId, checkInDate, checkOutDate);
      
      if (response.success) {
        setAvailability(response.data || []);
        if (response.data?.length === 0) {
          toast({
            title: "No Rooms Available",
            description: "No rooms are available for the selected dates",
            variant: "destructive",
          });
        }
      } else {
        throw new Error(response.message || 'Failed to check availability');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check room availability';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityIcon = (availableUnits: number) => {
    if (availableUnits > 5) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (availableUnits > 0) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getAvailabilityStatus = (availableUnits: number) => {
    if (availableUnits > 5) {
      return { text: "Available", color: "bg-green-100 text-green-800" };
    } else if (availableUnits > 0) {
      return { text: "Limited", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { text: "Sold Out", color: "bg-red-100 text-red-800" };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bed className="h-5 w-5 mr-2" />
            Checking Room Availability...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <XCircle className="h-5 w-5 mr-2" />
            Availability Check Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={checkAvailability} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bed className="h-5 w-5 mr-2" />
          Room Availability
        </CardTitle>
        <p className="text-sm text-gray-600">
          {new Date(checkInDate).toLocaleDateString()} - {new Date(checkOutDate).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        {availability.length === 0 ? (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Available</h3>
            <p className="text-gray-600">No rooms are available for the selected dates. Please try different dates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availability.map((room, index) => {
              const status = getAvailabilityStatus(room.availableUnits);
              const isSelected = selectedRoomType === room.roomType;
              
              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : room.availableUnits > 0 
                        ? 'border-gray-200 hover:border-gray-300 cursor-pointer' 
                        : 'border-gray-200 opacity-60'
                  }`}
                  onClick={() => room.availableUnits > 0 && onRoomSelect(room.roomType, room.price)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      {getAvailabilityIcon(room.availableUnits)}
                      <h3 className="font-medium text-lg">{room.roomType}</h3>
                    </div>
                    <Badge className={status.color}>
                      {status.text}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Price per night</p>
                      <p className="text-xl font-bold text-green-600">₹{room.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Available units</p>
                      <p className="text-lg font-medium">{room.availableUnits} / {room.totalAvailable}</p>
                    </div>
                  </div>
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 4).map((amenity, amenityIndex) => (
                          <Badge key={amenityIndex} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {room.availableUnits > 0 && (
                    <Button
                      className={`w-full ${isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      variant={isSelected ? "default" : "outline"}
                      disabled={room.availableUnits === 0}
                    >
                      {isSelected ? 'Selected' : 'Select Room'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-4">
          <Button onClick={checkAvailability} variant="outline" className="w-full">
            Refresh Availability
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomAvailabilityChecker;