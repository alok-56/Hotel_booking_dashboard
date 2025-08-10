import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Building,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllBookingPayments } from "@/api/Services/Booking/booking";
import { getAllHotels } from "@/api/Services/Hotel/hotel";
import * as XLSX from "xlsx";

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

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span>Show</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="h-8 w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>entries</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 py-1 text-sm text-gray-500">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allPayments, setAllPayments] = useState([]); // Store all payments for export

  // Export functionality
  const handleExportData = async () => {
    try {
      // Get all payments for export
      const exportResponse = await getAllBookingPayments(1, 10000); // Large limit to get all data

      let exportData = [];
      if (exportResponse.status && exportResponse.data) {
        exportData = exportResponse.data.map((payment) => ({
          "Payment ID": payment.merchantTransactionId,
          Customer: payment.bookingId?.userInfo?.[0]?.name || "N/A",
          Hotel: payment.hotelId?.hotelName || "N/A",
          "Total Amount": payment.bookingId?.totalAmount || 0,
          "Room Amount": payment.totalAmount || 0,
          "Add-on Amount":
            (payment.bookingId?.totalAmount || 0) - (payment.totalAmount || 0),
          "Amount Paid": payment.bookingId?.amountPaid || 0,
          "Pending Amount": payment.pendingAmount || 0,
          "Payment Method": payment.paymentMethod || "N/A",
          Status:
            payment.status === "paid"
              ? "Completed"
              : payment.status === "pending"
              ? "Pending"
              : "Failed",
          Date: new Date(payment.transactionTime).toLocaleDateString(),
          "Transaction Time": new Date(
            payment.transactionTime
          ).toLocaleString(),
        }));
      }

      // Apply current filters to export data
      const filteredExportData = exportData.filter((payment) => {
        const matchesSearch =
          searchTerm === "" ||
          payment["Customer"]
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment["Payment ID"]
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment["Hotel"].toLowerCase().includes(searchTerm.toLowerCase());

        const matchesHotel =
          selectedHotel === "all" ||
          exportResponse.data.find(
            (p) => p.merchantTransactionId === payment["Payment ID"]
          )?.hotelId?._id === selectedHotel;

        return matchesSearch && matchesHotel;
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(filteredExportData);

      // Auto-size columns
      const colWidths = [];
      Object.keys(filteredExportData[0] || {}).forEach((key, index) => {
        const maxLength = Math.max(
          key.length,
          ...filteredExportData.map((row) => String(row[key] || "").length)
        );
        colWidths[index] = { wch: Math.min(maxLength + 2, 50) };
      });
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Payments");

      // Generate filename with current date
      const now = new Date();
      const filename = `payments_export_${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.xlsx`;

      // Download the file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error("Export failed:", error);
      // You might want to show a toast notification here
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Call API with pagination parameters
        const [paymentsResponse, hotelsResponse] = await Promise.all([
          getAllBookingPayments(currentPage, itemsPerPage),
          getAllHotels(),
        ]);

        if (paymentsResponse.status && paymentsResponse.data) {
          const transformedPayments = paymentsResponse.data.map((payment) => ({
            id: payment.merchantTransactionId,
            hotelId: payment.hotelId?._id || "",
            amount: payment.totalAmount,
            date: new Date(payment.transactionTime).toISOString().split("T")[0],
            hotel: payment.hotelId?.hotelName || "N/A",
            status:
              payment.status === "paid"
                ? "Completed"
                : payment.status === "pending"
                ? "Pending"
                : "Failed",
            method: payment.paymentMethod,
            customer: payment.bookingId?.userInfo?.[0]?.name || "N/A",
            totalAmount: payment.bookingId.totalAmount,
            amountPaid: payment.bookingId.amountPaid || 0,
            pendingAmount: payment.pendingAmount || 0,
            addon: payment.bookingId.totalAmount - payment.totalAmount,
          }));

          setPayments(transformedPayments);
          setAllPayments(transformedPayments); // Store for potential export use

          // Set pagination data from API response
          // Adjust based on your actual API response structure
          if (paymentsResponse.pagination) {
            setTotalItems(paymentsResponse.pagination.totalItems || 0);
            setTotalPages(paymentsResponse.pagination.totalPages || 0);
          } else if (paymentsResponse.total) {
            // Alternative structure if your API returns total differently
            setTotalItems(paymentsResponse.total || 0);
            setTotalPages(
              Math.ceil((paymentsResponse.total || 0) / itemsPerPage)
            );
          } else {
            // Fallback - calculate based on returned data length
            // This assumes if less than itemsPerPage returned, it's the last page
            const isLastPage = paymentsResponse.data.length < itemsPerPage;
            const calculatedTotal = isLastPage
              ? (currentPage - 1) * itemsPerPage + paymentsResponse.data.length
              : Math.max(
                  currentPage * itemsPerPage,
                  paymentsResponse.data.length
                );
            setTotalItems(calculatedTotal);
            setTotalPages(Math.ceil(calculatedTotal / itemsPerPage));
          }
        }

        if (hotelsResponse.status && hotelsResponse.data) {
          setHotels(hotelsResponse.data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedHotel, searchTerm]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      searchTerm === "" ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.hotel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHotel =
      selectedHotel === "all" || payment.hotelId === selectedHotel;

    return matchesSearch && matchesHotel;
  });

  const calculateStats = () => {
    // Calculate from filtered data
    const totalAmount = filteredPayments.reduce(
      (sum, p) => sum + (p.totalAmount || 0),
      0
    );
    const totalPaid = filteredPayments.reduce(
      (sum, p) => sum + (p.amountPaid || 0),
      0
    );
    const totalPending = filteredPayments.reduce(
      (sum, p) => sum + (p.pendingAmount || 0),
      0
    );

    // Legacy calculations for incoming/outgoing (if needed)
    const totalIncoming = filteredPayments
      .filter((p) => p.type === "Incoming" && p.status === "Completed")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOutgoing = filteredPayments
      .filter((p) => p.type === "Outgoing" && p.status === "Completed")
      .reduce((sum, p) => sum + p.amount, 0);

    const netIncome = totalIncoming - totalOutgoing;

    return {
      totalAmount,
      totalPaid,
      totalPending,
      totalIncoming,
      totalOutgoing,
      netIncome,
    };
  };

  const stats = calculateStats();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    return type === "Incoming" ? (
      <ArrowDownLeft className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Payments
            </div>
            <div className="text-gray-600">{error}</div>
            <Button onClick={() => window.location.reload()} className="mt-4">
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
        <h1 className="text-2xl font-bold text-gray-900">
          Payments Management
        </h1>
        <p className="text-gray-600">Track incoming and outgoing payments</p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedHotel} onValueChange={setSelectedHotel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Hotel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hotels</SelectItem>
              {hotels.map((hotel) => (
                <SelectItem key={hotel._id} value={hotel._id}>
                  {hotel.hotelName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{stats.totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All bookings value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{stats.totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Received payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ₹{stats.totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Collection Rate
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalAmount > 0
                ? Math.round((stats.totalPaid / stats.totalAmount) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Payment collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No payments found</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Payment ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Customer/Vendor
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Hotel</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Pending Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Room Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Add on Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        Method
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">{payment.id}</td>
                        <td className="py-3 px-4">{payment.customer}</td>
                        <td className="py-3 px-4">{payment.hotel}</td>
                        <td className="py-3 px-4 font-medium">
                          <span className="text-red-600">
                            ₹{payment.pendingAmount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <span className="text-green-600">
                            ₹{payment.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <span className="text-green-600">
                            ₹{payment.addon}
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

              {/* Pagination */}
              <div className="mt-6 pt-4 border-t">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagement;
