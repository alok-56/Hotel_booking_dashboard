import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Building,
  ChevronDown,
  Bed,
  Users,
  Home,
  BarChart3,
  Loader2,
  AlertCircle,
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
import { getRoomOccupancyReport } from "@/api/Services/Report/report";
import { getAllHotels } from "@/api/Services/Hotel/hotel"; // Add this import

const RoomOccupancyDashboard = () => {
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [startDate, setStartDate] = useState("2025-07-20");
  const [endDate, setEndDate] = useState("2025-07-25");
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [roomData, setRoomData] = useState({});
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hotels from API
  const fetchHotels = async () => {
    setHotelsLoading(true);
    setError(null);
    try {
      const response = await getAllHotels();
      if (response.status && response.data) {
        // Transform API data to match the expected format
        const transformedHotels = response.data.map(hotel => ({
          id: hotel._id,
          name: hotel.hotelName,
          location: `${hotel.city}, ${hotel.state}`,
          totalRooms: hotel.totalRooms || 100, // Default value if not provided in API
          brand: hotel.brand,
          starRating: hotel.starRating,
          propertyType: hotel.propertyType,
          address: hotel.address,
          country: hotel.country,
        }));
        setHotels(transformedHotels);
        
        // Auto-select the first hotel if available
        if (transformedHotels.length > 0) {
          setSelectedHotels([transformedHotels[0].id]);
        }
      } else {
        setError("Failed to fetch hotels");
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setError("Error loading hotels. Please try again.");
    } finally {
      setHotelsLoading(false);
    }
  };

  // Fetch room occupancy data
  const fetchRoomOccupancyData = async () => {
    if (selectedHotels.length === 0) {
      setError("Please select at least one hotel");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await getRoomOccupancyReport(startDate, endDate);
      if (response.status) {
        console.log(response.data);
        setRoomData(response.data);
      } else {
        setError("Failed to fetch room occupancy data");
      }
    } catch (error) {
      console.error("Error fetching room occupancy data:", error);
      setError("Error loading occupancy data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize hotels when component mounts
  useEffect(() => {
    fetchHotels();
  }, []);

  // Fetch occupancy data when component mounts or dates/hotels change
  useEffect(() => {
    if (startDate && endDate && selectedHotels.length > 0 && !hotelsLoading) {
      fetchRoomOccupancyData();
    }
  }, [startDate, endDate, selectedHotels, hotelsLoading]);

  const generateDateRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }

    return dates;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoomDataForDate = (date) => {
    let totalRooms = 0;
    let soldRooms = 0;
    let availableRooms = 0;
    let totalOccupancy = 0;
    let hotelCount = 0;

    selectedHotels.forEach((hotelId) => {
      if (roomData[hotelId] && roomData[hotelId][date]) {
        const data = roomData[hotelId][date];
        totalRooms += data.totalRooms;
        soldRooms += data.soldRooms;
        availableRooms += data.availableRooms;
        totalOccupancy += data.occupancyRate;
        hotelCount++;
      }
    });

    return {
      totalRooms,
      soldRooms,
      availableRooms,
      avgOccupancyRate:
        hotelCount > 0 ? Math.round(totalOccupancy / hotelCount) : 0,
    };
  };

  const handleHotelToggle = (hotelId) => {
    setSelectedHotels((prev) => {
      const newSelection = prev.includes(hotelId)
        ? prev.filter((id) => id !== hotelId)
        : [...prev, hotelId];
      
      // Ensure at least one hotel is selected
      return newSelection.length === 0 ? prev : newSelection;
    });
  };

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "bg-green-500";
    if (rate >= 70) return "bg-yellow-500";
    if (rate >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTotalStats = () => {
    const dateRange = generateDateRange(startDate, endDate);
    let totalRooms = 0;
    let totalSoldRooms = 0;
    let totalAvailableRooms = 0;
    let totalOccupancy = 0;
    let dateCount = 0;

    dateRange.forEach((date) => {
      const data = getRoomDataForDate(date);
      totalRooms += data.totalRooms;
      totalSoldRooms += data.soldRooms;
      totalAvailableRooms += data.availableRooms;
      totalOccupancy += data.avgOccupancyRate;
      if (data.totalRooms > 0) dateCount++;
    });

    return {
      totalRooms,
      totalSoldRooms,
      totalAvailableRooms,
      avgOccupancy: dateCount > 0 ? Math.round(totalOccupancy / dateCount) : 0,
    };
  };

  const getSelectedHotelsText = () => {
    if (selectedHotels.length === 0) return "No hotels selected";
    if (selectedHotels.length === 1) {
      const hotel = hotels.find((h) => h.id === selectedHotels[0]);
      return hotel ? hotel.name : "1 hotel selected";
    }
    return `${selectedHotels.length} hotels selected`;
  };

  const dateRange = generateDateRange(startDate, endDate);
  const totalStats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hotel Room Occupancy
          </h1>
          <p className="text-gray-600">
            Monitor room availability and occupancy rates across selected properties
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStats.totalRooms}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rooms Sold</p>
                  <p className="text-2xl font-bold text-green-600">{totalStats.totalSoldRooms}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Rooms</p>
                  <p className="text-2xl font-bold text-blue-600">{totalStats.totalAvailableRooms}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bed className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Occupancy</p>
                  <p className="text-2xl font-bold text-purple-600">{totalStats.avgOccupancy}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hotel Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Select Hotels
                  {hotelsLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                </label>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setShowHotelDropdown(!showHotelDropdown)}
                    disabled={hotelsLoading || hotels.length === 0}
                  >
                    <span className="truncate">
                      {hotelsLoading ? "Loading hotels..." : getSelectedHotelsText()}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>

                  {showHotelDropdown && !hotelsLoading && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                      <div className="py-1">
                        {hotels.map((hotel) => (
                          <label
                            key={hotel.id}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedHotels.includes(hotel.id)}
                              onChange={() => handleHotelToggle(hotel.id)}
                              className="mr-3"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {hotel.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {hotel.location} • {hotel.totalRooms} rooms
                                {hotel.starRating && ` • ${hotel.starRating}★`}
                              </div>
                              {hotel.brand && (
                                <div className="text-xs text-gray-400 truncate">
                                  {hotel.brand} • {hotel.propertyType}
                                </div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between">
              <Button 
                variant="outline"
                onClick={fetchHotels}
                disabled={hotelsLoading}
                className="flex items-center gap-2"
              >
                {hotelsLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Hotels...
                  </>
                ) : (
                  <>
                    <Building className="h-4 w-4" />
                    Refresh Hotels
                  </>
                )}
              </Button>
              
              <Button 
                onClick={fetchRoomOccupancyData}
                disabled={loading || selectedHotels.length === 0}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Refresh Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Room Availability Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading room occupancy data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dateRange.map((date) => {
              const data = getRoomDataForDate(date);
              return (
                <Card key={date} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        {getDayName(date)}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-4">
                        {getFormattedDate(date)}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Total Rooms:</span>
                            <span className="font-semibold text-gray-900">
                              {data.totalRooms}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Sold:</span>
                            <span className="font-semibold text-green-600">
                              {data.soldRooms}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Available:</span>
                            <span className="font-semibold text-blue-600">
                              {data.availableRooms}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-600">Occupancy Rate</span>
                            <span className="font-semibold text-gray-900">
                              {data.avgOccupancyRate}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${getOccupancyColor(
                                data.avgOccupancyRate
                              )}`}
                              style={{ width: `${data.avgOccupancyRate}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            {data.avgOccupancyRate >= 90 && "Excellent"}
                            {data.avgOccupancyRate >= 70 && data.avgOccupancyRate < 90 && "Good"}
                            {data.avgOccupancyRate >= 50 && data.avgOccupancyRate < 70 && "Average"}
                            {data.avgOccupancyRate < 50 && "Low"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No Data Message */}
        {!loading && !hotelsLoading && (selectedHotels.length === 0 || dateRange.length === 0) && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Data Available
              </h3>
              <p className="text-gray-600">
                {selectedHotels.length === 0 
                  ? "Please select at least one hotel to view occupancy data."
                  : "Please select a valid date range to view occupancy data."
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* No Hotels Available Message */}
        {!hotelsLoading && hotels.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Building className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Hotels Available
              </h3>
              <p className="text-gray-600">
                Unable to load hotels. Please check your connection and try refreshing.
              </p>
              <Button 
                className="mt-4"
                onClick={fetchHotels}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoomOccupancyDashboard;