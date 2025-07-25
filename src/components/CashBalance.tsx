import React, { useState, useEffect } from 'react';
import { DollarSign, Building, TrendingUp, TrendingDown, Eye, Wallet, CreditCard, Banknote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllHotels } from '@/api/Services/Hotel/hotel';
import { getAllBookingPayments } from '@/api/Services/Booking/booking';
import { Skeleton } from "@/components/ui/skeleton";

interface CashBalanceData {
  hotelId: string;
  hotelName: string;
  cashBalance: number;
  totalIncome: number;
  totalExpenses: number;
  pendingPayments: number;
  lastUpdated: string;
}

const CashBalance = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [cashData, setCashData] = useState<CashBalanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCashBalanceData();
  }, []);

  const fetchCashBalanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hotels and payments data
      const [hotelsResponse, paymentsResponse] = await Promise.all([
        getAllHotels(),
        getAllBookingPayments()
      ]);

      if (hotelsResponse.status && hotelsResponse.data) {
        const hotelsList = hotelsResponse.data;
        setHotels(hotelsList);

        // Process cash balance for each hotel
        const cashBalances: CashBalanceData[] = hotelsList.map((hotel: any) => {
          // Filter payments for this hotel
          const hotelPayments = paymentsResponse.data?.filter(
            (payment: any) => payment.hotelId?._id === hotel._id
          ) || [];

          // Calculate totals
          const totalIncome = hotelPayments.reduce((sum: number, payment: any) => 
            sum + (payment.amountPaid || 0), 0);
          const pendingPayments = hotelPayments.reduce((sum: number, payment: any) => 
            sum + (payment.pendingAmount || 0), 0);
          
          // Mock expenses for now (in real scenario, you'd have an expenses API)
          const totalExpenses = Math.floor(totalIncome * 0.3); // Assume 30% expenses
          const cashBalance = totalIncome - totalExpenses;

          return {
            hotelId: hotel._id,
            hotelName: hotel.hotelName,
            cashBalance,
            totalIncome,
            totalExpenses,
            pendingPayments,
            lastUpdated: new Date().toISOString()
          };
        });

        setCashData(cashBalances);
      } else {
        setError('Failed to fetch hotel data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cash balance data');
      console.error('Error fetching cash balance:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalCashBalance = () => {
    return cashData.reduce((sum, hotel) => sum + hotel.cashBalance, 0);
  };

  const getTotalIncome = () => {
    return cashData.reduce((sum, hotel) => sum + hotel.totalIncome, 0);
  };

  const getTotalPending = () => {
    return cashData.reduce((sum, hotel) => sum + hotel.pendingPayments, 0);
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hotel Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Cash Balance</div>
            <div className="text-gray-600">{error}</div>
            <Button onClick={fetchCashBalanceData} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cash Balance</h1>
            <p className="text-gray-600">Monitor cash flow and balance for each hotel</p>
          </div>
          <Button onClick={fetchCashBalanceData} variant="outline">
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cash Balance</CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(getTotalCashBalance())}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all hotels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(getTotalIncome())}
              </div>
              <p className="text-xs text-muted-foreground">
                Revenue collected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(getTotalPending())}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting collection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Hotels</CardTitle>
              <Building className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {cashData.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Properties monitored
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Cash Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cashData.map((hotel) => (
            <Card key={hotel.hotelId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{hotel.hotelName}</span>
                  <Building className="h-5 w-5 text-gray-400" />
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date(hotel.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cash Balance */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Cash Balance</span>
                      <Banknote className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      {formatCurrency(hotel.cashBalance)}
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Income:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(hotel.totalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Expenses:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(hotel.totalExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending Payments:</span>
                      <span className="font-medium text-orange-600">
                        {formatCurrency(hotel.pendingPayments)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Data Message */}
        {cashData.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Wallet className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Cash Balance Data
              </h3>
              <p className="text-gray-600">
                No hotel cash balance data available at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CashBalance;