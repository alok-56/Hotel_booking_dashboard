import React, { useState, useEffect } from "react";
import { Bed, Plus, Search, Filter, Edit, Eye, Trash2, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "./ui/use-toast";
import {
  createRoom,
  getAllHotels,
  getAllRooms,
  updateRoom,
} from "@/api/Services/Hotel/hotel";

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotelFilter, setSelectedHotelFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    hotelId: "",
    roomType: "",
    description: "",
    price: "",
    maxOccupancy: "",
    bedType: "",
    sizeSqm: "",
    amenities: [],
    refundable: true,
    availability: "",
  });

  // Static room types
  const roomTypes = [
    "Standard Single",
    "Standard Double",
    "Deluxe Single",
    "Deluxe Double",
    "Premium Single",
    "Premium Double",
    "Executive Single",
    "Executive Double",
    "Junior Suite",
    "Executive Suite",
    "Presidential Suite",
    "Family Room",
    "Twin Room",
    "Triple Room",
    "Quadruple Room",
  ];

  // Static amenities options
  const amenitiesOptions = [
    "WiFi",
    "Air Conditioning",
    "Television",
    "Mini Bar",
    "Room Service",
    "Balcony",
    "Ocean View",
    "City View",
    "Garden View",
    "Jacuzzi",
    "Bathtub",
    "Shower",
    "Hair Dryer",
    "Safe",
    "Telephone",
    "Coffee Machine",
    "Tea Maker",
    "Refrigerator",
    "Microwave",
    "Iron & Ironing Board",
    "Laundry Service",
    "Housekeeping",
    "Gym Access",
    "Pool Access",
    "Spa Access",
    "Business Center",
    "Parking",
    "Pet Friendly",
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, selectedHotelFilter]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, hotelsResponse] = await Promise.all([
        getAllRooms(),
        getAllHotels(),
      ]);
      console.log("Rooms:", roomsResponse);
      console.log("Hotels:", hotelsResponse);

      // Ensure we have arrays
      const roomsData = Array.isArray(roomsResponse?.data) ? roomsResponse.data : [];
      const hotelsData = Array.isArray(hotelsResponse?.data) ? hotelsResponse.data : [];
      
      setRooms(roomsData);
      setHotels(hotelsData);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      const errorMessage = err.message || "Failed to fetch data";
      setError(errorMessage);
      setRooms([]);
      setHotels([]);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = [...rooms]; // Create a copy to avoid mutating original array

    // Filter by hotel
    if (selectedHotelFilter && selectedHotelFilter.trim()) {
      filtered = filtered.filter((room) => {
        // Handle both string and object comparisons
        const roomHotelId = typeof room.hotelId === 'object' 
          ? room.hotelId._id || room.hotelId.id 
          : room.hotelId;
        
        return roomHotelId === selectedHotelFilter;
      });
    }

    // Filter by search term with safe property access
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      
      filtered = filtered.filter((room) => {
        // Safe property access with fallbacks
        const roomType = (room.roomType || '').toString().toLowerCase();
        const bedType = (room.bedType || '').toString().toLowerCase();
        const description = (room.description || '').toString().toLowerCase();
        
        // Get hotel name for search
        const hotelName = getHotelName(room.hotelId).toLowerCase();
        
        return (
          roomType.includes(searchLower) ||
          bedType.includes(searchLower) ||
          description.includes(searchLower) ||
          hotelName.includes(searchLower)
        );
      });
    }

    setFilteredRooms(filtered);
  };

  const handleCreateRoom = async () => {
    try {
      const roomData = {
        ...formData,
        price: Number(formData.price),
        maxOccupancy: Number(formData.maxOccupancy),
        sizeSqm: Number(formData.sizeSqm),
        availability: Number(formData.availability),
      };

      const result = await createRoom(roomData);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Room created successfully",
        variant: "default",
      });
      
      await fetchInitialData();
      resetForm();
      setShowModal(false); // Close modal after successful creation
      
    } catch (err) {
      console.error("Room creation error:", err);
      const errorMessage = err.message || "Failed to create room";
      setError(errorMessage);
      
      toast({
        title: "Room Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const roomData = {
        ...formData,
        price: Number(formData.price),
        maxOccupancy: Number(formData.maxOccupancy),
        sizeSqm: Number(formData.sizeSqm),
        availability: Number(formData.availability),
      };

      await updateRoom(selectedRoom._id, roomData);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Room updated successfully",
        variant: "default",
      });
      
      await fetchInitialData();
      resetForm();
      setShowModal(false);
      
    } catch (err) {
      console.error("Room update error:", err);
      const errorMessage = err.message || "Failed to update room";
      setError(errorMessage);
      
      toast({
        title: "Room Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openModal = (mode, room = null) => {
    setModalMode(mode);
    setSelectedRoom(room);
    if (room) {
      setFormData({
        hotelId: room.hotelId || "",
        roomType: room.roomType || "",
        description: room.description || "",
        price: room.price?.toString() || "",
        maxOccupancy: room.maxOccupancy?.toString() || "",
        bedType: room.bedType || "",
        sizeSqm: room.sizeSqm?.toString() || "",
        amenities: room.amenities || [],
        refundable: room.refundable !== undefined ? room.refundable : true,
        availability: room.availability?.toString() || "",
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      hotelId: "",
      roomType: "",
      description: "",
      price: "",
      maxOccupancy: "",
      bedType: "",
      sizeSqm: "",
      amenities: [],
      refundable: true,
      availability: "",
    });
    setSelectedRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAmenitiesChange = (amenity) => {
    setFormData((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity];

      return { ...prev, amenities: newAmenities };
    });
  };

  const getHotelName = (hotelId) => {
    if (!hotelId) return 'Unknown Hotel';
    
    // Handle case where hotelId might be an object with populated hotel data
    if (typeof hotelId === 'object') {
      return hotelId.hotelName || hotelId.name || 'Unknown Hotel';
    }
    
    // Handle case where hotelId is a string ID
    const hotel = hotels.find((h) => h._id === hotelId);
    return hotel ? (hotel.hotelName || hotel.name || 'Unknown Hotel') : 'Unknown Hotel';
  };

  const getStatusBadge = (room) => {
    if (room.availability > 0) {
      return <Badge className="bg-green-100 text-green-800">Available</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Unavailable</Badge>;
    }
  };

  const calculateStats = () => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter((room) => room.availability > 0).length;
    const unavailableRooms = totalRooms - availableRooms;

    return {
      total: totalRooms,
      available: availableRooms,
      unavailable: unavailableRooms,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading rooms...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
        <p className="text-gray-600">
          Manage room availability, pricing, and amenities
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rooms..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            value={selectedHotelFilter}
            onChange={(e) => setSelectedHotelFilter(e.target.value)}
          >
            <option value="">All Hotels</option>
            {hotels &&
              hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.hotelName || hotel.name || 'Unknown Hotel'}
                </option>
              ))}
          </select>
        </div>
        <Button onClick={() => openModal("create")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Room Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total rooms in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Bed className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.available}
            </div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
            <Bed className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.unavailable}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>
            Manage your hotel rooms and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Room Type</th>
                  <th className="text-left py-3 px-4 font-medium">Hotel</th>
                  <th className="text-left py-3 px-4 font-medium">Bed Type</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Price/Night
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Max Occupancy
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Size (sqm)
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Amenities</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms && filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <tr key={room._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{room.roomType || 'N/A'}</td>
                      <td className="py-3 px-4">{getHotelName(room.hotelId)}</td>
                      <td className="py-3 px-4">{room.bedType || 'N/A'}</td>
                      <td className="py-3 px-4">{getStatusBadge(room)}</td>
                      <td className="py-3 px-4">
                        ₹{room.price ? room.price.toLocaleString() : '0'}
                      </td>
                      <td className="py-3 px-4">
                        {room.maxOccupancy || 0} Guest
                        {(room.maxOccupancy || 0) > 1 ? "s" : ""}
                      </td>
                      <td className="py-3 px-4">{room.sizeSqm || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {room.amenities && room.amenities.length > 0 ? (
                            <>
                              {room.amenities.slice(0, 3).map((amenity, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {amenity}
                                </Badge>
                              ))}
                              {room.amenities.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{room.amenities.length - 3}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">No amenities</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal("edit", room)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal("view", room)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-8 px-4 text-center text-gray-500">
                      {rooms.length === 0 ? 'No rooms found' : 'No rooms match your filters'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {modalMode === "create"
                  ? "Add New Room"
                  : modalMode === "edit"
                  ? "Edit Room"
                  : "Room Details"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hotel</label>
                <select
                  name="hotelId"
                  value={formData.hotelId}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  required
                >
                  <option value="">Select Hotel</option>
                  {hotels &&
                    hotels.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.hotelName || hotel.name || 'Unknown Hotel'}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  required
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={modalMode === "view"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Room description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price per Night
                  </label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Max Occupancy
                  </label>
                  <Input
                    name="maxOccupancy"
                    type="number"
                    value={formData.maxOccupancy}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bed Type
                  </label>
                  <Input
                    name="bedType"
                    value={formData.bedType}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    placeholder="King, Queen, Twin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Size (sqm)
                  </label>
                  <Input
                    name="sizeSqm"
                    type="number"
                    value={formData.sizeSqm}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    placeholder="35"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amenities
                </label>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {amenitiesOptions.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenitiesChange(amenity)}
                          disabled={modalMode === "view"}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Available Rooms
                  </label>
                  <Input
                    name="availability"
                    type="number"
                    value={formData.availability}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    placeholder="5"
                  />
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    name="refundable"
                    checked={formData.refundable}
                    onChange={handleInputChange}
                    disabled={modalMode === "view"}
                    className="h-4 w-4"
                  />
                  <label className="text-sm font-medium">Refundable</label>
                </div>
              </div>
            </div>

            {modalMode !== "view" && (
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={
                    modalMode === "create" ? handleCreateRoom : handleUpdateRoom
                  }
                >
                  {modalMode === "create" ? "Create Room" : "Update Room"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsManagement;