import React, { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Download,
  X,
  FileText,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { getBookingSummaryReport } from "@/api/Services/Report/report";
import { getAllHotels } from "@/api/Services/Hotel/hotel";
import * as XLSX from "xlsx";

const BookingReport = () => {
  const [reportData, setReportData] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedHotel, setSelectedHotel] = useState("all");

  // Custom date range states
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    from: "",
    to: "",
  });
  const [tempDateRange, setTempDateRange] = useState({
    from: "",
    to: "",
  });

  // Export states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

  // Date range calculations
  const getDateRange = (period, customDateRange = {}) => {
    const now = new Date();
    let from, to;

    switch (period) {
      case "today": {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0); // today at 12:00 AM

        const end = new Date(now);
        end.setHours(23, 59, 59, 999); // today at 11:59:59 PM

        from = start.toISOString();
        to = end.toISOString();
        break;
      }

      case "week": {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        from = start.toISOString();
        to = end.toISOString();
        break;
      }

      case "month": {
        const start = new Date(now);
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        from = start.toISOString();
        to = end.toISOString();
        break;
      }

      case "custom":
        return customDateRange;

      default: {
        const start = new Date(now);
        start.setMonth(start.getMonth() - 6);
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        from = start.toISOString();
        to = end.toISOString();
      }
    }

    return { from, to };
  };

  // Handle custom date period selection
  const handleCustomPeriodClick = () => {
    setTempDateRange(customDateRange);
    setShowCustomDateModal(true);
  };

  // Apply custom date range
  const applyCustomDateRange = () => {
    // Validate dates
    if (!tempDateRange.from || !tempDateRange.to) {
      alert("Please select both start and end dates");
      return;
    }

    if (new Date(tempDateRange.from) > new Date(tempDateRange.to)) {
      alert("Start date cannot be after end date");
      return;
    }

    setCustomDateRange(tempDateRange);
    setSelectedPeriod("custom");
    setShowCustomDateModal(false);
  };

  // Cancel custom date selection
  const cancelCustomDateRange = () => {
    setTempDateRange(customDateRange);
    setShowCustomDateModal(false);
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const { from, to } = getDateRange(selectedPeriod);

      const [reportResponse, hotelsResponse] = await Promise.all([
        getBookingSummaryReport({
          from,
          to,
          hotelId: selectedHotel,
          limit: 10,
        }),
        getAllHotels(),
      ]);

      if (reportResponse.success) {
        setReportData(reportResponse.data);
      }

      if (hotelsResponse.status) {
        setHotels([
          { _id: "all", hotelName: "All Hotels" },
          ...hotelsResponse.data,
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, selectedHotel, customDateRange]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status styling
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "checkin":
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "checkout":
      case "checked-out":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate max values for chart scaling
  const getChartHeight = (value, maxValue, chartHeight = 200) => {
    if (maxValue === 0) return 20;
    return Math.max((value / maxValue) * chartHeight, 20);
  };

  // Get period display text
  const getPeriodDisplayText = () => {
    if (
      selectedPeriod === "custom" &&
      customDateRange.from &&
      customDateRange.to
    ) {
      return `${formatDate(customDateRange.from)} - ${formatDate(
        customDateRange.to
      )}`;
    }
    return "";
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateCSV = () => {
    const { summary, monthlyTrends, recentBookings } = reportData;

    // Comprehensive CSV data for CEO presentation
    const csvData = [
      ["BOOKING SUMMARY REPORT - EXECUTIVE OVERVIEW"],
      [""],
      [
        "Report Generated On:",
        new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
          " at " +
          new Date().toLocaleTimeString("en-IN"),
      ],
      [
        "Reporting Period:",
        selectedPeriod === "custom"
          ? getPeriodDisplayText()
          : selectedPeriod.toUpperCase(),
      ],
      [
        "Hotel Filter:",
        hotels.find((h) => h._id === selectedHotel)?.hotelName || "All Hotels",
      ],
      [""],
      ["=== KEY PERFORMANCE METRICS ==="],
      ["Metric", "Current Value", "Growth %", "Status"],
      [
        "Total Bookings",
        summary.totalBookings.toLocaleString(),
        `${summary.totalBookingsGrowth > 0 ? "+" : ""}${
          summary.totalBookingsGrowth
        }%`,
        summary.totalBookingsGrowth > 0
          ? "Growing"
          : summary.totalBookingsGrowth < 0
          ? "Declining"
          : "Stable",
      ],
      [
        "Confirmed Bookings",
        summary.confirmedBookings.toLocaleString(),
        `${summary.confirmationRate}% rate`,
        summary.confirmationRate > 80
          ? "Excellent"
          : summary.confirmationRate > 60
          ? "Good"
          : "Needs Attention",
      ],
      [
        "Cancelled Bookings",
        summary.cancelledBookings.toLocaleString(),
        `${summary.cancellationRate}% rate`,
        summary.cancellationRate < 10
          ? "Excellent"
          : summary.cancellationRate < 20
          ? "Acceptable"
          : "High Risk",
      ],
      [
        "Average Booking Value",
        formatCurrency(summary.avgBookingValue),
        `${summary.avgBookingValueGrowth > 0 ? "+" : ""}${
          summary.avgBookingValueGrowth
        }%`,
        summary.avgBookingValueGrowth > 0 ? "Improving" : "Declining",
      ],
      [
        "Total Revenue (Estimated)",
        formatCurrency(summary.totalBookings * summary.avgBookingValue),
        "",
        "",
      ],
      [""],
      ["=== MONTHLY PERFORMANCE TRENDS ==="],
      [
        "Month",
        "Total Bookings",
        "Revenue Generated",
        "Month-over-Month Growth",
      ],
    ];

    // Add monthly trends with growth calculation
    monthlyTrends.forEach((trend, index) => {
      const prevMonth = monthlyTrends[index - 1];
      const bookingGrowth = prevMonth
        ? (
            ((trend.bookings - prevMonth.bookings) / prevMonth.bookings) *
            100
          ).toFixed(1)
        : "N/A";

      csvData.push([
        trend.month,
        trend.bookings.toLocaleString(),
        formatCurrency(trend.revenue),
        prevMonth ? `${bookingGrowth}%` : "Baseline",
      ]);
    });

    csvData.push(
      [""],
      ["=== DETAILED BOOKING TRANSACTIONS ==="],
      [
        "Booking ID",
        "Guest Name",
        "Contact Number",
        "Hotel Name",
        "Location",
        "Check-in Date",
        "Check-out Date",
        "Nights",
        "Booking Amount",
        "Payment Status",
        "Booking Status",
        "Revenue Impact",
      ]
    );

    // Add all booking details with enhanced data
    recentBookings.forEach((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      const revenueImpact =
        booking.status.toLowerCase() === "cancelled"
          ? "Lost Revenue"
          : booking.status.toLowerCase() === "confirmed"
          ? "Confirmed Revenue"
          : "Pending Revenue";

      csvData.push([
        booking.bookingReference,
        booking.guest.name,
        booking.guest.phone,
        booking.hotel.name,
        booking.hotel.location,
        formatDate(booking.checkIn),
        formatDate(booking.checkOut),
        nights,
        formatCurrency(booking.amount),
        booking.paymentStatus || "Not Specified",
        booking.status.toUpperCase(),
        revenueImpact,
      ]);
    });

    // Add summary at the end
    csvData.push(
      [""],
      ["=== EXECUTIVE SUMMARY ==="],
      ["Total Transactions Analyzed:", recentBookings.length],
      [
        "Confirmed Revenue:",
        formatCurrency(
          recentBookings
            .filter((b) => b.status.toLowerCase() === "confirmed")
            .reduce((sum, b) => sum + b.amount, 0)
        ),
      ],
      [
        "Potential Lost Revenue:",
        formatCurrency(
          recentBookings
            .filter((b) => b.status.toLowerCase() === "cancelled")
            .reduce((sum, b) => sum + b.amount, 0)
        ),
      ],
      [
        "Average Transaction Value:",
        formatCurrency(
          recentBookings.reduce((sum, b) => sum + b.amount, 0) /
            recentBookings.length
        ),
      ],
      [""],
      ["Report compiled for executive review and strategic decision making"]
    );

    const csvContent = csvData
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  };

  // Replace the generateExcel function with this enhanced version
  const generateExcel = () => {
    const { summary, monthlyTrends, recentBookings } = reportData;
    const wb = XLSX.utils.book_new();

    // Executive Summary Sheet
    const executiveSummary = [
      ["EXECUTIVE BOOKING REPORT"],
      [""],
      [
        "Report Date:",
        new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      ],
      [
        "Reporting Period:",
        selectedPeriod === "custom"
          ? getPeriodDisplayText()
          : selectedPeriod.toUpperCase(),
      ],
      [
        "Hotel Scope:",
        hotels.find((h) => h._id === selectedHotel)?.hotelName || "All Hotels",
      ],
      [""],
      ["KEY PERFORMANCE INDICATORS"],
      ["Metric", "Value", "Growth Rate", "Performance Rating"],
      [
        "Total Bookings",
        summary.totalBookings,
        `${summary.totalBookingsGrowth}%`,
        summary.totalBookingsGrowth > 0 ? "↗ Growing" : "↘ Declining",
      ],
      [
        "Confirmation Rate",
        `${summary.confirmationRate}%`,
        "",
        summary.confirmationRate > 80 ? "★★★ Excellent" : "★★ Good",
      ],
      [
        "Cancellation Rate",
        `${summary.cancellationRate}%`,
        "",
        summary.cancellationRate < 10 ? "★★★ Low Risk" : "⚠ Monitor",
      ],
      [
        "Avg Booking Value",
        summary.avgBookingValue,
        `${summary.avgBookingValueGrowth}%`,
        summary.avgBookingValueGrowth > 0 ? "↗ Improving" : "↘ Declining",
      ],
      [
        "Estimated Total Revenue",
        summary.totalBookings * summary.avgBookingValue,
        "",
        "",
      ],
      [""],
      ["STRATEGIC INSIGHTS"],
      [
        "Business Health Score:",
        summary.confirmationRate > 80 && summary.cancellationRate < 15
          ? "HEALTHY"
          : "REQUIRES ATTENTION",
      ],
      [
        "Revenue Trend:",
        summary.avgBookingValueGrowth > 0
          ? "POSITIVE GROWTH"
          : "DECLINING - ACTION NEEDED",
      ],
      [
        "Market Position:",
        summary.totalBookingsGrowth > 10
          ? "EXPANDING"
          : summary.totalBookingsGrowth > 0
          ? "STABLE GROWTH"
          : "MARKET CONTRACTION",
      ],
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(executiveSummary);

    // Style the header rows
    summaryWS["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];

    XLSX.utils.book_append_sheet(wb, summaryWS, "Executive Summary");

    // Performance Trends Sheet
    const performanceData = [
      ["MONTHLY PERFORMANCE ANALYSIS"],
      [""],
      [
        "Month",
        "Bookings",
        "Revenue",
        "Booking Growth %",
        "Revenue Growth %",
        "Performance Status",
      ],
    ];

    monthlyTrends.forEach((trend, index) => {
      const prevMonth = monthlyTrends[index - 1];
      const bookingGrowth = prevMonth
        ? (
            ((trend.bookings - prevMonth.bookings) / prevMonth.bookings) *
            100
          ).toFixed(1)
        : 0;
      const revenueGrowth = prevMonth
        ? (
            ((trend.revenue - prevMonth.revenue) / prevMonth.revenue) *
            100
          ).toFixed(1)
        : 0;
      const status =
        parseFloat(bookingGrowth as string) > 5
          ? "Strong Growth"
          : parseFloat(bookingGrowth as string) > 0
          ? "Growth"
          : "Decline";

      performanceData.push([
        trend.month,
        trend.bookings,
        trend.revenue,
        prevMonth ? `${bookingGrowth}%` : "Baseline",
        prevMonth ? `${revenueGrowth}%` : "Baseline",
        status,
      ]);
    });

    const trendsWS = XLSX.utils.aoa_to_sheet(performanceData);
    trendsWS["!cols"] = [
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(wb, trendsWS, "Performance Trends");

    // Detailed Transactions Sheet
    const transactionData = [
      ["DETAILED BOOKING TRANSACTIONS"],
      [""],
      [
        "Booking Reference",
        "Guest Name",
        "Contact",
        "Hotel",
        "Location",
        "Check-in",
        "Check-out",
        "Duration (Nights)",
        "Amount",
        "Status",
        "Revenue Category",
        "Business Impact",
      ],
    ];

    recentBookings.forEach((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );

      let revenueCategory, businessImpact;
      switch (booking.status.toLowerCase()) {
        case "confirmed":
          revenueCategory = "Confirmed Revenue";
          businessImpact = "Positive";
          break;
        case "cancelled":
          revenueCategory = "Lost Revenue";
          businessImpact = "Negative";
          break;
        default:
          revenueCategory = "Pending Revenue";
          businessImpact = "Uncertain";
      }

      transactionData.push([
        booking.bookingReference,
        booking.guest.name,
        booking.guest.phone,
        booking.hotel.name,
        booking.hotel.location,
        booking.checkIn,
        booking.checkOut,
        nights,
        booking.amount,
        booking.status.toUpperCase(),
        revenueCategory,
        businessImpact,
      ]);
    });

    // Add summary rows
    const confirmedRevenue = recentBookings
      .filter((b) => b.status.toLowerCase() === "confirmed")
      .reduce((sum, b) => sum + b.amount, 0);
    const lostRevenue = recentBookings
      .filter((b) => b.status.toLowerCase() === "cancelled")
      .reduce((sum, b) => sum + b.amount, 0);

    transactionData.push(
      [""],
      ["TRANSACTION SUMMARY"],
      ["Total Transactions:", recentBookings.length],
      ["Confirmed Revenue:", confirmedRevenue],
      ["Lost Revenue:", lostRevenue],
      ["Revenue at Risk:", confirmedRevenue + lostRevenue],
      [
        "Success Rate:",
        `${(
          (confirmedRevenue / (confirmedRevenue + lostRevenue)) *
          100
        ).toFixed(1)}%`,
      ]
    );

    const bookingsWS = XLSX.utils.aoa_to_sheet(transactionData);
    bookingsWS["!cols"] = [
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, bookingsWS, "Detailed Transactions");

    return wb;
  };

  // Updated handleExport function (replace the existing one)
  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    const hotelName =
      hotels
        .find((h) => h._id === selectedHotel)
        ?.hotelName?.replace(/\s+/g, "-") || "AllHotels";
    const periodText =
      selectedPeriod === "custom" ? "Custom-Range" : selectedPeriod;

    let filename;

    switch (exportFormat) {
      case "csv":
        const csvContent = generateCSV();
        filename = `Executive-Booking-Report-${hotelName}-${periodText}-${timestamp}.csv`;
        downloadFile(csvContent, filename, "text/csv;charset=utf-8;");
        break;

      case "excel":
        const workbook = generateExcel();
        filename = `Executive-Booking-Report-${hotelName}-${periodText}-${timestamp}.xlsx`;
        XLSX.writeFile(workbook, filename);
        break;

      default:
        // Default to CSV if somehow an invalid format is selected
        const defaultContent = generateCSV();
        filename = `Executive-Booking-Report-${hotelName}-${periodText}-${timestamp}.csv`;
        downloadFile(defaultContent, filename, "text/csv;charset=utf-8;");
    }

    setShowExportModal(false);

    // Show success message (optional)
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error loading report data</div>
        </div>
      </div>
    );
  }

  const { summary, monthlyTrends, recentBookings } = reportData;
  const maxBookings = Math.max(...monthlyTrends.map((d) => d.bookings), 1);
  const maxRevenue = Math.max(...monthlyTrends.map((d) => d.revenue), 1);

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Booking Reports</h1>
        <p className="text-gray-600">Analyze booking trends and performance</p>
        {selectedPeriod === "custom" && getPeriodDisplayText() && (
          <p className="text-sm text-blue-600 mt-1">
            Custom Range: {getPeriodDisplayText()}
          </p>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <Button
            variant={selectedPeriod === "today" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("today")}
          >
            Today
          </Button>
          <Button
            variant={selectedPeriod === "week" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("week")}
          >
            This Week
          </Button>
          <Button
            variant={selectedPeriod === "month" ? "default" : "outline"}
            onClick={() => setSelectedPeriod("month")}
          >
            This Month
          </Button>
          <Button
            variant={selectedPeriod === "custom" ? "default" : "outline"}
            onClick={handleCustomPeriodClick}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Custom Range
          </Button>
        </div>
        <div className="flex space-x-2">
          <select
            style={{ width: "200px" }}
            className="px-3 py-2 border rounded-md"
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
          >
            {hotels &&
              hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.hotelName}
                </option>
              ))}
          </select>
          <Button onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Select Custom Date Range
              </h3>
              <button
                onClick={cancelCustomDateRange}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={tempDateRange.from}
                  onChange={(e) =>
                    setTempDateRange((prev) => ({
                      ...prev,
                      from: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  max={
                    tempDateRange.to || new Date().toISOString().split("T")[0]
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={tempDateRange.to}
                  onChange={(e) =>
                    setTempDateRange((prev) => ({
                      ...prev,
                      to: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={tempDateRange.from}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={cancelCustomDateRange}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={applyCustomDateRange} className="flex-1">
                Apply Range
              </Button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Export Executive Report</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Export Format
                </label>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportFormat === "csv"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setExportFormat("csv")}
                  >
                    <input
                      type="radio"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-blue-600"
                    />
                    <FileSpreadsheet className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        CSV Report
                      </div>
                      <div className="text-sm text-gray-600">
                        Comprehensive data export for Excel analysis
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Perfect for pivot tables and detailed analysis
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportFormat === "excel"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setExportFormat("excel")}
                  >
                    <input
                      type="radio"
                      value="excel"
                      checked={exportFormat === "excel"}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-blue-600"
                    />
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        Excel Workbook
                      </div>
                      <div className="text-sm text-gray-600">
                        Multi-sheet executive presentation format
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Organized sheets with executive summary
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Executive Report Includes:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Key Performance Indicators & Growth Metrics</li>
                  <li>• Monthly Performance Trends & Analysis</li>
                  <li>• Complete Booking Transaction Details</li>
                  <li>• Revenue Analysis & Business Impact Assessment</li>
                  <li>• Strategic Insights & Performance Ratings</li>
                  <li>• Executive Summary for Decision Making</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-400">
                <div className="text-xs text-gray-600">
                  <strong>Report Period:</strong>{" "}
                  {selectedPeriod === "custom"
                    ? getPeriodDisplayText()
                    : selectedPeriod}{" "}
                  <br />
                  <strong>Hotel Filter:</strong>{" "}
                  {hotels.find((h) => h._id === selectedHotel)?.hotelName ||
                    "All Hotels"}{" "}
                  <br />
                  <strong>Total Records:</strong> {recentBookings.length}{" "}
                  transactions
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowExportModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalBookings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalBookingsGrowth > 0 ? "+" : ""}
              {summary.totalBookingsGrowth}% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary.confirmedBookings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.confirmationRate}% confirmation rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <Calendar className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {summary.cancelledBookings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.cancellationRate}% cancellation rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Booking Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.avgBookingValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.avgBookingValueGrowth > 0 ? "+" : ""}
              {summary.avgBookingValueGrowth}% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Booking Trends</CardTitle>
            <CardDescription>Booking count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyTrends.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 w-full rounded-t transition-all duration-300"
                    style={{
                      height: `${getChartHeight(data.bookings, maxBookings)}px`,
                    }}
                  ></div>
                  <span className="text-xs mt-2 font-medium">{data.month}</span>
                  <span className="text-xs text-gray-500">{data.bookings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Revenue generated from bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyTrends.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-green-500 w-full rounded-t transition-all duration-300"
                    style={{
                      height: `${getChartHeight(data.revenue, maxRevenue)}px`,
                    }}
                  ></div>
                  <span className="text-xs mt-2 font-medium">{data.month}</span>
                  <span className="text-xs text-gray-500">
                    {formatCurrency(data.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">
                    Booking Reference
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Guest</th>
                  <th className="text-left py-3 px-4 font-medium">Hotel</th>
                  <th className="text-left py-3 px-4 font-medium">Check-in</th>
                  <th className="text-left py-3 px-4 font-medium">Check-out</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-sm">
                      {booking.bookingReference}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{booking.guest.name}</div>
                        <div className="text-xs text-gray-500">
                          {booking.guest.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{booking.hotel.name}</div>
                        <div className="text-xs text-gray-500">
                          {booking.hotel.location}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(booking.checkIn)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatDate(booking.checkOut)}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatCurrency(booking.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings found for the selected period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingReport;
