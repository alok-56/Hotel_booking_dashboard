import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAllBookingPayments } from '@/api/Services/Booking/booking';

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-300 rounded w-64"></div>
          <div className="h-10 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded w-36"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-300 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <th key={i} className="text-left py-3 px-4">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                    ))}
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

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await getAllBookingPayments();
        
        if (response.status && response.data) {
          const transformedPayments = response.data.map((payment) => ({
            id: payment.merchantTransactionId,
            
            amount: payment.totalAmount,
            date: new Date(payment.transactionTime).toISOString().split('T')[0],
            hotel: payment.hotelId?.hotelName || 'N/A',
            status: payment.status === 'paid' ? 'Completed' : payment.status === 'pending' ? 'Pending' : 'Failed',
            method: payment.paymentMethod,
            customer: payment.bookingId?.userInfo?.[0]?.name || 'N/A',
            totalAmount: payment.totalAmount,
            amountPaid: payment.amountPaid || 0,
            pendingAmount: payment.pendingAmount || 0,
          }));
          
          setPayments(transformedPayments);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const calculateStats = () => {
    // Calculate from raw API data for more accurate stats
    const totalAmount = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalPending = payments.reduce((sum, p) => sum + (p.pendingAmount || 0), 0);
    
    // Legacy calculations for incoming/outgoing (if needed)
    const totalIncoming = payments
      .filter(p => p.type === 'Incoming' && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const totalOutgoing = payments
      .filter(p => p.type === 'Outgoing' && p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const netIncome = totalIncoming - totalOutgoing;
    
    return { 
      totalAmount, 
      totalPaid, 
      totalPending, 
      totalIncoming, 
      totalOutgoing, 
      netIncome 
    };
  };

  const stats = calculateStats();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'Incoming' ? 
      <ArrowDownLeft className="h-4 w-4 text-green-500" /> : 
      <ArrowUpRight className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Payments</div>
            <div className="text-gray-600">{error}</div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
        <p className="text-gray-600">Track incoming and outgoing payments</p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search payments..." className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All bookings value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{stats.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Received payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{stats.totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalAmount > 0 ? Math.round((stats.totalPaid / stats.totalAmount) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Payment collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>
            {payments.length > 0 
              ? `Showing ${payments.length} payment${payments.length !== 1 ? 's' : ''}`
              : 'No payments found'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No payments found</div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record First Payment
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Payment ID</th>
                   
                    <th className="text-left py-3 px-4 font-medium">Customer/Vendor</th>
                    <th className="text-left py-3 px-4 font-medium">Hotel</th>
                    <th className="text-left py-3 px-4 font-medium">Pending Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Method</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{payment.id}</td>
                     
                     
                      <td className="py-3 px-4">{payment.customer}</td>
                      <td className="py-3 px-4">{payment.hotel}</td>
                      <td className="py-3 px-4 font-medium">
                        <span className={ 'text-red-600'}>
                         {payment.pendingAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <span className={ 'text-green-600'}>
                         {payment.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{payment.method}</Badge>
                      </td>
                      <td className="py-3 px-4">{payment.date}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagement;