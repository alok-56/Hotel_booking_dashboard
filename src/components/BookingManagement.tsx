
import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Users, 
  Bed, 
  CreditCard,
  Clock,
  CheckCircle,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingDetailModal from './BookingDetailModal';
import AddBookingModal from './AddBookingModal';

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

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'in-house' | 'completed'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);

  const mockBookings: Booking[] = [
    {
      id: '1',
      guestName: 'Mohan Kumar',
      bookingId: '#STA66344',
      checkIn: '12 Jul 2025',
      checkOut: '13 Jul 2025',
      nights: 1,
      rooms: 1,
      amount: 1347,
      amountCollected: 0,
      status: 'upcoming',
      paymentStatus: 'pending',
      guestCount: 2,
      roomType: 'Classic',
      source: 'direct',
      phoneNumber: '+91 9876543210',
      email: 'mohan@example.com'
    },
    {
      id: '2',
      guestName: 'Subhajit Sarkar',
      bookingId: '#KJBA8288',
      checkIn: '12 Jul 2025',
      checkOut: '13 Jul 2025',
      nights: 1,
      rooms: 1,
      amount: 1347,
      amountCollected: 84,
      status: 'upcoming',
      paymentStatus: 'partial',
      guestCount: 2,
      roomType: 'Classic',
      source: 'ota',
      phoneNumber: '+91 9876543211',
      email: 'subhajit@example.com'
    },
    {
      id: '3',
      guestName: 'Priya Sharma',
      bookingId: '#ABC12345',
      checkIn: '10 Jul 2025',
      checkOut: '12 Jul 2025',
      nights: 2,
      rooms: 1,
      amount: 2694,
      amountCollected: 2694,
      status: 'in-house',
      paymentStatus: 'paid',
      guestCount: 3,
      roomType: 'Deluxe',
      source: 'direct',
      phoneNumber: '+91 9876543212',
      email: 'priya@example.com'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'in-house': return <Home className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBookings = mockBookings.filter(booking => booking.status === activeTab);
  const upcomingCount = mockBookings.filter(b => b.status === 'upcoming').length;

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingDetail(true);
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowAddBooking(true)}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
              { key: 'in-house', label: 'In-house', count: 0 },
              { key: 'completed', label: 'Completed', count: 0 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name & Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stay Nights
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleBookingClick(booking)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{booking.guestName}</div>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          booking.source === 'direct' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.bookingId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{booking.nights} Night</div>
                    <div className="text-sm text-gray-500">{booking.checkIn}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.rooms} Room
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">₹{booking.amount}</div>
                    {booking.amountCollected > 0 && (
                      <div className="text-sm text-gray-500">
                        Amount collected: ₹{booking.amountCollected}
                      </div>
                    )}
                    {booking.paymentStatus === 'partial' && (
                      <div className="text-sm text-gray-500">
                        Collect at hotel: ₹{booking.amount - booking.amountCollected}
                      </div>
                    )}
                    {booking.paymentStatus === 'pending' && (
                      <div className="text-sm text-blue-600">Pay at hotel</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(booking.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {booking.status === 'in-house' ? 'Check-in' : booking.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No {activeTab} bookings found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showBookingDetail && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowBookingDetail(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {showAddBooking && (
        <AddBookingModal
          onClose={() => setShowAddBooking(false)}
        />
      )}
    </div>
  );
};

export default BookingManagement;
