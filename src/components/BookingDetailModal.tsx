
import React, { useState } from 'react';
import { X, ArrowLeft, Edit, Plus, MoreVertical, Printer, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  guestName: string;
  bookingId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  amount: number;
  amountCollected: number;
  status: 'upcoming' | 'in-house' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'partial';
  guestCount: number;
  roomType: string;
  source: 'direct' | 'ota';
  phoneNumber: string;
  email: string;
}

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose }) => {
  const [activeSection, setActiveSection] = useState('details');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {booking.guestName} +{booking.guestCount - 1}
                </h2>
                <div className="flex items-center mt-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                    {booking.status === 'upcoming' ? 'Upcoming' : booking.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="bg-gray-900 text-white hover:bg-gray-800">
                Check-in
              </Button>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded font-medium">
                {booking.bookingId}
              </span>
              <span className="text-sm text-gray-500">Direct</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stay Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Stay details</h3>
                <Button variant="outline" size="sm">
                  Modify
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Check-in</label>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {booking.checkIn}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Checkout</label>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {booking.checkOut}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Room details</h3>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Room 1</h4>
                  <Button variant="outline" size="sm">
                    Assign
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{booking.roomType}</p>
                
                <div className="flex space-x-4 text-sm text-gray-500">
                  <button className="hover:text-gray-700">Change occupancy</button>
                  <button className="hover:text-gray-700">Change room category</button>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Guest details</h3>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{booking.guestName}, +{booking.guestCount - 1}</p>
                <p className="text-sm text-gray-600">{booking.guestCount} Adults, 0 Kid</p>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Print Guest Card
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bill Summary */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Bill summary</h3>
                  <Button variant="outline" size="sm">
                    Add bill
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total bill</span>
                    <span className="text-sm font-medium">₹{booking.amount}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Inc. of convenience fee (₹80.00)
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{booking.roomType}</span>
                    <span className="text-sm">₹{booking.amount - 80}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.nights} Night X ₹{Math.floor((booking.amount - 80) / booking.nights)}
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View bill
                  </button>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
                  <Button variant="outline" size="sm">
                    Collect
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment collected</span>
                    <span className="text-sm font-medium">₹{booking.amountCollected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Balance to collect</span>
                    <span className="text-sm font-medium">₹{booking.amount - booking.amountCollected}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GSTN Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">GSTN details</h3>
                <Button variant="outline" size="sm">
                  Add
                </Button>
              </div>
              <p className="text-sm text-gray-500">Add GST details here</p>
            </div>
          </div>

          {/* No-show */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">No-show</h3>
                <Button variant="outline" size="sm">
                  No-show
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
