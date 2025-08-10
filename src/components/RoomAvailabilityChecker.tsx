// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { CheckCircle, XCircle, AlertCircle, Bed } from 'lucide-react';
// import { searchRooms } from '@/api/Services/Hotel/hotel';
// import { useToast } from '@/hooks/use-toast';

// interface RoomAvailability {
//   _id: string;
//   roomType: string;
//   totalAvailable: number;
//   currentlyBooked: number;
//   availableUnits: number;
//   price: number;
//   amenities: string[];
// }

// interface RoomAvailabilityCheckerProps {
//   hotelId: string;
//   checkInDate: string;
//   checkOutDate: string;
//   onRoomSelect: (roomType: string, price: number,_id:string) => void;
//   selectedRoomType?: string;
// }

// const RoomAvailabilityChecker: React.FC<RoomAvailabilityCheckerProps> = ({
//   hotelId,
//   checkInDate,
//   checkOutDate,
//   onRoomSelect,
//   selectedRoomType
// }) => {
//   const { toast } = useToast();
//   const [availability, setAvailability] = useState<RoomAvailability[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (hotelId && checkInDate && checkOutDate) {
//       checkAvailability();
//     }
//   }, [hotelId, checkInDate, checkOutDate]);

//   const checkAvailability = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await searchRooms(hotelId, checkInDate, checkOutDate);
      
//       if (response.success) {
//         setAvailability(response.data || []);
//         if (response.data?.length === 0) {
//           toast({
//             title: "No Rooms Available",
//             description: "No rooms are available for the selected dates",
//             variant: "destructive",
//           });
//         }
//       } else {
//         throw new Error(response.message || 'Failed to check availability');
//       }
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to check room availability';
//       setError(errorMessage);
//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAvailabilityIcon = (availableUnits: number) => {
//     if (availableUnits > 5) {
//       return <CheckCircle className="h-5 w-5 text-green-500" />;
//     } else if (availableUnits > 0) {
//       return <AlertCircle className="h-5 w-5 text-yellow-500" />;
//     } else {
//       return <XCircle className="h-5 w-5 text-red-500" />;
//     }
//   };

//   const getAvailabilityStatus = (availableUnits: number) => {
//     if (availableUnits > 5) {
//       return { text: "Available", color: "bg-green-100 text-green-800" };
//     } else if (availableUnits > 0) {
//       return { text: "Limited", color: "bg-yellow-100 text-yellow-800" };
//     } else {
//       return { text: "Sold Out", color: "bg-red-100 text-red-800" };
//     }
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Bed className="h-5 w-5 mr-2" />
//             Checking Room Availability...
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {Array.from({ length: 3 }).map((_, index) => (
//               <div key={index} className="animate-pulse">
//                 <div className="h-20 bg-gray-200 rounded-lg"></div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center text-red-600">
//             <XCircle className="h-5 w-5 mr-2" />
//             Availability Check Failed
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-red-600 mb-4">{error}</p>
//           <Button onClick={checkAvailability} variant="outline">
//             Retry
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center">
//           <Bed className="h-5 w-5 mr-2" />
//           Room Availability
//         </CardTitle>
//         <p className="text-sm text-gray-600">
//           {new Date(checkInDate).toLocaleDateString()} - {new Date(checkOutDate).toLocaleDateString()}
//         </p>
//       </CardHeader>
//       <CardContent>
//         {availability.length === 0 ? (
//           <div className="text-center py-8">
//             <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Available</h3>
//             <p className="text-gray-600">No rooms are available for the selected dates. Please try different dates.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {availability.map((room, index) => {
//               const status = getAvailabilityStatus(room.availableUnits);
//               const isSelected = selectedRoomType === room.roomType;
//               {console.log(room)}
              
//               return (
//                 <div
//                   key={index}
//                   className={`border rounded-lg p-4 transition-all duration-200 ${
//                     isSelected 
//                       ? 'border-blue-500 bg-blue-50' 
//                       : room.availableUnits > 0 
//                         ? 'border-gray-200 hover:border-gray-300 cursor-pointer' 
//                         : 'border-gray-200 opacity-60'
//                   }`}
//                   onClick={() => room.availableUnits > 0 && onRoomSelect(room.roomType, room.price,room._id)}
//                 >
//                   <div className="flex justify-between items-start mb-3">
//                     <div className="flex items-center space-x-2">
//                       {getAvailabilityIcon(room.availableUnits)}
//                       <h3 className="font-medium text-lg">{room.roomType}</h3>
//                     </div>
//                     <Badge className={status.color}>
//                       {status.text}
//                     </Badge>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4 mb-3">
//                     <div>
//                       <p className="text-sm text-gray-600">Price per night</p>
//                       <p className="text-xl font-bold text-green-600">₹{room.price.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Available units</p>
//                       <p className="text-lg font-medium">{room.availableUnits} / {room.totalAvailable}</p>
//                     </div>
//                   </div>
                  
//                   {room.amenities && room.amenities.length > 0 && (
//                     <div className="mb-3">
//                       <p className="text-sm text-gray-600 mb-2">Amenities</p>
//                       <div className="flex flex-wrap gap-1">
//                         {room.amenities.slice(0, 4).map((amenity, amenityIndex) => (
//                           <Badge key={amenityIndex} variant="outline" className="text-xs">
//                             {amenity}
//                           </Badge>
//                         ))}
//                         {room.amenities.length > 4 && (
//                           <Badge variant="outline" className="text-xs">
//                             +{room.amenities.length - 4} more
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   )}
                  
//                   {room.availableUnits > 0 && (
//                     <Button
//                       className={`w-full ${isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
//                       variant={isSelected ? "default" : "outline"}
//                       disabled={room.availableUnits === 0}
//                     >
//                       {isSelected ? 'Selected' : 'Select Room'}
//                     </Button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
        
//         <div className="mt-4">
//           <Button onClick={checkAvailability} variant="outline" className="w-full">
//             Refresh Availability
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default RoomAvailabilityChecker;


import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Bed, Plus, Minus, Edit3, Check, X } from 'lucide-react';
import { searchRooms } from '@/api/Services/Hotel/hotel';
import { useToast } from '@/hooks/use-toast';

interface RoomAvailability {
  _id: string;
  roomType: string;
  totalAvailable: number;
  currentlyBooked: number;
  availableUnits: number;
  price: number;
  amenities: string[];
  maxcapacity: number;
}

interface SelectedRoom {
  _id: string;
  roomType: string;
  quantity: number;
  originalPrice: number;
  customPrice: number;
}

interface RoomAvailabilityCheckerProps {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  onRoomSelect: (selectedRooms: SelectedRoom[]) => void;
  selectedRooms?: SelectedRoom[];
}

const RoomAvailabilityChecker: React.FC<RoomAvailabilityCheckerProps> = ({
  hotelId,
  checkInDate,
  checkOutDate,
  onRoomSelect,
  selectedRooms = []
}) => {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localSelectedRooms, setLocalSelectedRooms] = useState<SelectedRoom[]>([]);
  const [editingPrice, setEditingPrice] = useState<{roomId: string, tempPrice: string} | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize local state only once
  useEffect(() => {
    if (!hasInitialized) {
      setLocalSelectedRooms(selectedRooms);
      setHasInitialized(true);
    }
  }, [selectedRooms, hasInitialized]);

  // Check availability when props change
  useEffect(() => {
    if (hotelId && checkInDate && checkOutDate) {
      fetchRoomAvailability();
    }
  }, [hotelId, checkInDate, checkOutDate]);

  const fetchRoomAvailability = async () => {
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

  const getSelectedRoom = (roomId: string): SelectedRoom | undefined => {
    return localSelectedRooms.find(room => room._id === roomId);
  };

  const addRoom = (room: RoomAvailability) => {
    const newRoom: SelectedRoom = {
      _id: room._id,
      roomType: room.roomType,
      quantity: 1,
      originalPrice: room.price,
      customPrice: room.price
    };
    
    const updatedRooms = [...localSelectedRooms, newRoom];
    setLocalSelectedRooms(updatedRooms);
    onRoomSelect(updatedRooms);
    
    toast({
      title: "Room Added",
      description: `${room.roomType} added to selection`,
    });
  };

  const updateQuantity = (roomId: string, newQuantity: number, maxAvailable: number) => {
    if (newQuantity <= 0) {
      const updatedRooms = localSelectedRooms.filter(r => r._id !== roomId);
      setLocalSelectedRooms(updatedRooms);
      onRoomSelect(updatedRooms);
      return;
    }

    if (newQuantity > maxAvailable) {
      toast({
        title: "Quantity Limit",
        description: `Maximum ${maxAvailable} rooms available`,
        variant: "destructive",
      });
      return;
    }

    const updatedRooms = localSelectedRooms.map(room =>
      room._id === roomId ? { ...room, quantity: newQuantity } : room
    );
    
    setLocalSelectedRooms(updatedRooms);
    onRoomSelect(updatedRooms);
  };

  const updatePrice = (roomId: string, newPrice: number) => {
    const updatedRooms = localSelectedRooms.map(room =>
      room._id === roomId ? { ...room, customPrice: newPrice } : room
    );
    
    setLocalSelectedRooms(updatedRooms);
    onRoomSelect(updatedRooms);
  };

  const startPriceEdit = (roomId: string, currentPrice: number) => {
    setEditingPrice({
      roomId,
      tempPrice: currentPrice.toString()
    });
  };

  const savePriceEdit = () => {
    if (!editingPrice) return;
    
    const newPrice = parseFloat(editingPrice.tempPrice);
    if (isNaN(newPrice) || newPrice < 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    updatePrice(editingPrice.roomId, newPrice);
    setEditingPrice(null);
    
    toast({
      title: "Price Updated",
      description: `Price updated to ₹${newPrice.toLocaleString()}`,
    });
  };

  const cancelPriceEdit = () => {
    setEditingPrice(null);
  };

  const getTotalRoomsSelected = () => {
    return localSelectedRooms.reduce((total, room) => total + room.quantity, 0);
  };

  const getTotalAmount = () => {
    return localSelectedRooms.reduce((total, room) => total + (room.customPrice * room.quantity), 0);
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
          <Button onClick={fetchRoomAvailability} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bed className="h-5 w-5 mr-2" />
              Room Availability
            </div>
            {localSelectedRooms.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">{getTotalRoomsSelected()} room(s) selected</p>
                <p className="text-lg font-bold text-green-600">₹{getTotalAmount().toLocaleString()}</p>
              </div>
            )}
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
              {availability.map((room) => {
                const status = getAvailabilityStatus(room.availableUnits);
                const selectedRoom = getSelectedRoom(room._id);
                const isSelected = selectedRoom !== undefined;
                
                return (
                  <div
                    key={room._id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : room.availableUnits > 0 
                          ? 'border-gray-200 hover:border-gray-300' 
                          : 'border-gray-200 opacity-60'
                    }`}
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
                       <div>
                        <p className="text-sm text-gray-600">Maximun capacity</p>
                        <p className="text-xl font-bold text-red-600">{room.maxcapacity.toLocaleString()}</p>
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
                      <div className="space-y-3">
                        {/* Add Room Button for unselected rooms */}
                        {!isSelected ? (
                          <Button
                            className="w-full"
                            onClick={() => addRoom(room)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Room
                          </Button>
                        ) : (
                          <>
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                              <span className="text-sm font-medium">Quantity:</span>
                              <div className="flex items-center space-x-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(room._id, selectedRoom!.quantity - 1, room.availableUnits)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-bold text-lg">
                                  {selectedRoom?.quantity || 0}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(room._id, selectedRoom!.quantity + 1, room.availableUnits)}
                                  disabled={selectedRoom?.quantity === room.availableUnits}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Price Editor */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Custom Price per night:</span>
                                {editingPrice?.roomId === room._id ? (
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="number"
                                      value={editingPrice.tempPrice}
                                      onChange={(e) => setEditingPrice({
                                        roomId: room._id,
                                        tempPrice: e.target.value
                                      })}
                                      className="w-24 h-8 px-2 border border-gray-300 rounded text-center"
                                      min="0"
                                      step="1"
                                    />
                                    <Button size="sm" onClick={savePriceEdit}>
                                      <Check className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={cancelPriceEdit}>
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-green-600">
                                      ₹{selectedRoom?.customPrice.toLocaleString()}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => startPriceEdit(room._id, selectedRoom?.customPrice || room.price)}
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Room Subtotal */}
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Subtotal for this room:</span>
                                <span className="text-lg font-bold text-blue-600">
                                  ₹{((selectedRoom?.customPrice || 0) * (selectedRoom?.quantity || 0)).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {selectedRoom?.quantity} × ₹{selectedRoom?.customPrice.toLocaleString()}
                              </p>
                            </div>

                            {/* Remove Room Button */}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateQuantity(room._id, 0, room.availableUnits)}
                              className="w-full"
                            >
                              Remove All
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-6">
            <Button onClick={fetchRoomAvailability} variant="outline" className="w-full">
              Refresh Availability
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Rooms Summary */}
      {localSelectedRooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Booking Summary</span>
              <Badge variant="secondary">{getTotalRoomsSelected()} rooms</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {localSelectedRooms.map((room) => (
                <div key={room._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-base">{room.roomType}</p>
                    <p className="text-sm text-gray-600">
                      {room.quantity} room{room.quantity > 1 ? 's' : ''} × ₹{room.customPrice.toLocaleString()}/night
                    </p>
                    {room.customPrice !== room.originalPrice && (
                      <p className="text-xs text-orange-600">
                        (Original: ₹{room.originalPrice.toLocaleString()})
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      ₹{(room.customPrice * room.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">Total Amount:</p>
                    <p className="text-sm text-gray-600">
                      {getTotalRoomsSelected()} room{getTotalRoomsSelected() > 1 ? 's' : ''} selected
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{getTotalAmount().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoomAvailabilityChecker;