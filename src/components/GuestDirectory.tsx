import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Plus,
  X,
  Building,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGuestStatusHistory } from "@/api/Services/Booking/booking";
import { getAllHotels } from "@/api/Services/Hotel/hotel";

const GuestDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");

  // Date filter states
  const now = new Date();

  // Start time: today at 11:00 PM
  const start = new Date(now);
  start.setHours(23, 0, 0, 0);

  // End time: tomorrow at 10:59:59 PM
  const end = new Date(start);
  end.setDate(end.getDate() + 1); 
  end.setHours(22, 59, 59, 999);

  // Save to state
  const [startDate, setStartDate] = useState(start.toISOString());
  const [endDate, setEndDate] = useState(end.toISOString());

  // Fetch guests data
  const fetchGuests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getGuestStatusHistory(startDate, endDate);

      if (response.status) {
        setGuests(response?.data?.reverse() || []);
      } else {
        setGuests([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch guest data");
      console.error("Error fetching guests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotels data
  const fetchHotels = async () => {
    try {
      const response = await getAllHotels();
      if (response.status && response.data) {
        setHotels(response.data);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  // Fetch guests data on component mount and when date filters change
  useEffect(() => {
    fetchGuests();
    fetchHotels();
  }, [startDate, endDate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "checkin":
        return "text-green-600 bg-green-100";
      case "checkout":
        return "text-red-600 bg-gray-100";
      case "booked":
        return "text-blue-600 bg-blue-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredGuests =
    guests &&
    guests.filter((guest) => {
      const matchesSearch =
        guest?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest?.phone?.includes(searchTerm);

      // Updated filter logic to handle "all" value
      const matchesHotel =
        selectedHotel === "all" || guest?.hotelId === selectedHotel;

      return matchesSearch && matchesHotel;
    });

  // Calculate stats from actual data
  const stats = {
    total: guests.length,
    checkedIn: guests.filter((g) => g?.status?.toLowerCase() === "checkin")
      .length,
    booked: guests.filter((g) => g?.status?.toLowerCase() === "booked").length,
  };

  const handleDateFilter = () => {
    fetchGuests();
    setShowFilters(false);
  };

  const resetDateFilters = () => {
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const defaultEndDate = new Date().toISOString().split("T")[0];

    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Guest List Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
                        <div className="flex items-center space-x-4">
                          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Guest Directory
            </h1>
            <p className="text-gray-600">
              Manage guest information and communication
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-1">
                Using fallback data due to API error: {error}
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Guests Activity
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Currently Checked In
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.checkedIn}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Booked Guests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.booked}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search guests by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="min-w-[200px]">
              <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                <SelectTrigger>
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

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Date Filter
            </button>
          </div>

          {/* Date Filter Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Filter by Date Range
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleDateFilter}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Apply Filter
                  </button>
                  <button
                    onClick={resetDateFilters}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Current range: {startDate} to {endDate}
                </span>
              </div>
            </div>
          )}

          {/* Guest List */}
          <div className="space-y-4">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No guests found matching your search."
                  : "No guest data available for the selected date range."}
              </div>
            ) : (
              filteredGuests.map((guest) => (
                <div
                  key={guest.id || guest._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedGuest(guest)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {guest?.name?.charAt(0) || "G"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {guest?.name || "Unknown Guest"}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {guest?.email || "No email"}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {guest?.phone || "No phone"}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {guest?.address || "No address"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-xs text-gray-600">
                            {guest?.timestamp || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              guest?.status
                            )}`}
                          >
                            {guest?.status?.replace("-", " ").toUpperCase() ||
                              "UNKNOWN"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <p className="text-sm text-gray-600">
                          visits • ₹{(guest?.totalSpent || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {guest?.preference && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Preference: {guest.preference}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDirectory;
