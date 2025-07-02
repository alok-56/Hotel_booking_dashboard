
import React, { useState } from 'react';
import { X, Plus, Minus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddBookingModalProps {
  onClose: () => void;
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({ onClose }) => {
  const [guestName, setGuestName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [roomType, setRoomType] = useState('Classic');
  const [roomPrice, setRoomPrice] = useState(3085);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [notes, setNotes] = useState('');

  const totalCharges = roomPrice * numberOfRooms;

  const handleCreateBooking = () => {
    // Handle booking creation logic here
    console.log('Creating booking:', {
      guestName,
      phoneNumber,
      email,
      checkInDate,
      checkOutDate,
      roomType,
      numberOfRooms,
      adults,
      kids,
      totalCharges,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add booking</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-1">1 Guest · 1 Night · 1 Room</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Guest Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number*
                </label>
                <div className="flex">
                  <select className="border border-gray-300 rounded-l-md px-3 py-2 text-sm bg-white">
                    <option>+91</option>
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Name*
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter guest name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Stay details
              <span className="text-sm font-normal text-gray-500 ml-2">15 rooms available</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground"
                      )}
                    >
                      {checkInDate ? format(checkInDate, "d MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Checkout
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground"
                      )}
                    >
                      {checkOutDate ? format(checkOutDate, "d MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Room Selection */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Classic Room (₹3,085)</h4>
                  <p className="text-sm text-gray-600">1 Room · 1 Guest</p>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type*
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Classic">Classic</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Price/Night*
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={roomPrice}
                      onChange={(e) => setRoomPrice(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-2 text-sm text-gray-500">
                      <div>Min ₹2,131.73</div>
                      <div>Max ₹9,255</div>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                    View Price Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. of rooms
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNumberOfRooms(Math.max(1, numberOfRooms - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm">{numberOfRooms}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNumberOfRooms(numberOfRooms + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Room selection limit is 15</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults per room
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm">{adults}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdults(adults + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">5+ years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kids
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setKids(Math.max(0, kids - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm">{kids}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setKids(kids + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">0 to 5 years</p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Add Room
              </Button>
            </div>
          </div>

          {/* Notes/To-Do */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes/To-Do</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add notes here"
            />
            <Button variant="outline" className="w-full mt-2">
              Add Note
            </Button>
          </div>

          {/* Price Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price summary</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Net Booking Value</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Charges</span>
                  <span className="text-lg font-semibold text-gray-900">₹{totalCharges}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Charges</div>
              <div className="text-lg font-semibold text-gray-900">₹{totalCharges}</div>
            </div>
            <Button
              onClick={handleCreateBooking}
              className="bg-gray-300 text-gray-500 cursor-not-allowed"
              disabled
            >
              Create Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookingModal;
