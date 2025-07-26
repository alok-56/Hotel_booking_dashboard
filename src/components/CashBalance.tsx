import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Building,
  TrendingUp,
  TrendingDown,
  Eye,
  Wallet,
  CreditCard,
  Banknote,
  X,
  Calendar,
  FileText,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getHotelCash } from "@/api/Services/Hotel/hotel"; // Updated import
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CashDetail {
  _id: string;
  type: "expense" | "booking";
  amount: number;
  remarks: string;
  createdAt: string;
}

interface CashBalanceData {
  hotelId: string;
  hotelName: string;
  bookingCash: number;
  expenseCash: number;
  availableCash: number;
  cashDetails: CashDetail[];
}

const CashBalance = () => {
  const [cashData, setCashData] = useState<CashBalanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<CashBalanceData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchCashBalanceData();
  }, []);

  const fetchCashBalanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hotel cash data using the new API
      const response = await getHotelCash();

      if (response.success && response.data) {
        setCashData(response.data);
      } else {
        setError(response.message || "Failed to fetch cash balance data");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch cash balance data"
      );
      console.error("Error fetching cash balance:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalAvailableCash = () => {
    return cashData.reduce((sum, hotel) => sum + hotel.availableCash, 0);
  };

  const getTotalBookingCash = () => {
    return cashData.reduce((sum, hotel) => sum + hotel.bookingCash, 0);
  };

  const getTotalExpenseCash = () => {
    return cashData.reduce((sum, hotel) => sum + hotel.expenseCash, 0);
  };

  const getPositiveBalanceHotels = () => {
    return cashData.filter(hotel => hotel.availableCash > 0).length;
  };

  const handleViewDetails = (hotel: CashBalanceData) => {
    setSelectedHotel(hotel);
    setIsDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Cash Balance
            </div>
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
            <p className="text-gray-600">
              Monitor cash flow and balance for each hotel
            </p>
          </div>
          <Button onClick={fetchCashBalanceData} variant="outline">
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Available Cash
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getTotalAvailableCash() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(getTotalAvailableCash())}
              </div>
              <p className="text-xs text-muted-foreground">Net cash available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Booking Cash
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(getTotalBookingCash())}
              </div>
              <p className="text-xs text-muted-foreground">Revenue from bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expense Cash
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(getTotalExpenseCash())}
              </div>
              <p className="text-xs text-muted-foreground">
                Cash used for expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Hotels
              </CardTitle>
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
            <Card
              key={hotel.hotelId}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{hotel.hotelName}</span>
                  <Building className="h-5 w-5 text-gray-400" />
                </CardTitle>
                <CardDescription>
                  Hotel ID: {hotel.hotelId.slice(-8)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Available Cash */}
                  <div className={`p-4 rounded-lg ${hotel.availableCash >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${hotel.availableCash >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        Available Cash
                      </span>
                      <Banknote className={`h-4 w-4 ${hotel.availableCash >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div className={`text-2xl font-bold mt-1 ${hotel.availableCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(hotel.availableCash)}
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Cash:</span>
                      <span className="font-medium text-blue-600">
                        {formatCurrency(hotel.bookingCash)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expense Cash:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(hotel.expenseCash)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span className="text-gray-900">Net Balance:</span>
                      <span className={hotel.availableCash >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(hotel.availableCash)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewDetails(hotel)}
                  >
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

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {selectedHotel?.hotelName} - Cash Details
            </DialogTitle>
            <DialogDescription>
              Detailed cash flow history and transactions
            </DialogDescription>
          </DialogHeader>

          {selectedHotel && (
            <div className="space-y-6">
              {/* Summary Cards in Modal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Available Cash</p>
                        <p className={`text-2xl font-bold ${selectedHotel.availableCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(selectedHotel.availableCash)}
                        </p>
                      </div>
                      <Wallet className={`h-8 w-8 ${selectedHotel.availableCash >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Booking Cash</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(selectedHotel.bookingCash)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Expense Cash</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(selectedHotel.expenseCash)}
                        </p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Transaction History ({selectedHotel.cashDetails.length})
                </h3>

                {selectedHotel.cashDetails.length > 0 ? (
                  <div className="space-y-3">
                    {selectedHotel.cashDetails
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((detail) => (
                      <Card key={detail._id} className="border-l-4 border-l-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-full ${
                                  detail.type === 'expense' 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {detail.type === 'expense' ? (
                                    <TrendingDown className="h-4 w-4" />
                                  ) : (
                                    <TrendingUp className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium capitalize">
                                    {detail.type}
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(detail.createdAt)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="ml-11">
                                <p className="text-sm text-gray-700 mb-2">
                                  <span className="font-medium">Remarks:</span> {detail.remarks}
                                </p>
                                <p className={`text-lg font-bold ${
                                  detail.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                                }`}>
                                  {detail.type === 'expense' ? '-' : '+'}{formatCurrency(detail.amount)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <FileText className="h-12 w-12 mx-auto" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No Transaction History
                      </h4>
                      <p className="text-gray-600">
                        No cash transactions recorded for this hotel yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashBalance;