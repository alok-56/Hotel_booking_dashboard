import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Calendar,
  User,
  Phone,
  Mail,
  Plus,
  Trash2,
  Home,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { updateBookingDetails } from "@/api/Services/Booking/booking";
import { GetRoomnumber } from "@/api/Services/Hotel/hotel";

// Using the same Button component structure from your original code
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const BookingEditSection = ({ booking, onClose }) => {
  const [editData, setEditData] = useState({
    checkIn: "",
    checkOut: "",
    guestName: "",
    phoneNumber: "",
    email: "",
    roomno: [],
    amount: 0,
    amountCollected: 0,
    pendingamount: 0,
    userifo: [],
  });

  type ErrorsType = {
    checkIn?: string;
    checkOut?: string;
    amount?: string;
    amountCollected?: string;
    [key: string]: string | undefined;
  };

  const [errors, setErrors] = useState<ErrorsType>({});
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  // New state for available room numbers
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomsError, setRoomsError] = useState("");

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setEditData({
        checkIn: booking.checkindate || booking.checkIn || "",
        checkOut: booking.checkoutdate || booking.checkOut || "",
        guestName: booking.guestName || "",
        phoneNumber: booking.phoneNumber || "",
        email: booking.email || "",
        roomno: booking.roomno || [],
        amount: booking.amount || 0,
        amountCollected: booking.amountCollected || 0,
        pendingamount: booking.pendingamount || 0,
        userifo: booking.userifo || [],
      });
    }
  }, [booking]);

  // Fetch available rooms when check-in/check-out dates or booking changes
  useEffect(() => {
    if (booking && editData.checkIn && editData.checkOut) {
      fetchAvailableRooms();
    }
  }, [booking, editData.checkIn, editData.checkOut]);

  const fetchAvailableRooms = async () => {
    if (!booking?.roomId || !editData.checkIn || !editData.checkOut) {
      return;
    }

    setLoading(true);
    setRoomsError("");

    try {
      // Convert roomId array to comma-separated string of IDs
      const roomIds = Array.isArray(booking.roomId)
        ? booking.roomId.map((room) => room._id || room).join(",")
        : booking.roomId;

      const res = await GetRoomnumber(
        roomIds,
        editData.checkIn,
        editData.checkOut
      );

      if (res.status) {
        setAvailableRooms(res.data);
      } else {
        setRoomsError("Failed to fetch available rooms");
        setAvailableRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRoomsError("Error loading available rooms");
      setAvailableRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: ErrorsType = {};

    if (!editData.checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }

    if (!editData.checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }

    if (
      editData.checkIn &&
      editData.checkOut &&
      editData.checkIn >= editData.checkOut
    ) {
      newErrors.checkOut = "Check-out must be after check-in date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setSaveMessage({
        type: "error",
        text: "Please fix the validation errors before saving.",
      });
      return;
    }

    setLoading(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const result = await updateBookingDetails({
        bookingId: booking._id || booking.id,
        checkIn: editData.checkIn,
        checkOut: editData.checkOut,
        guestName: editData.guestName,
        phoneNumber: editData.phoneNumber,
        email: editData.email,
        roomno: editData.roomno.filter((room) => room.trim() !== ""),
        amount: editData.amount,
        amountCollected: editData.amountCollected,
        pendingamount: editData.pendingamount,
        userifo: editData.userifo,
      });

      setSaveMessage({
        type: "success",
        text: "Booking updated successfully!",
      });
    
      onClose();
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: error.message || "Failed to update booking. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleUserInfoChange = (index, field, value) => {
    const updatedUserInfo = [...editData.userifo];
    updatedUserInfo[index] = {
      ...updatedUserInfo[index],
      [field]: value,
    };

    setEditData((prev) => ({
      ...prev,
      userifo: updatedUserInfo,
    }));

    // Clear error when user starts typing
    const errorKey = `user_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const addGuestInfo = () => {
    const newGuest = {
      _id: `temp_${Date.now()}`,
      name: "",
      phone: "",
      email: "",
      age: "",
      gender: "male",
    };

    setEditData((prev) => ({
      ...prev,
      userifo: [...prev.userifo, newGuest],
    }));
  };

  const removeGuestInfo = (index) => {
    setEditData((prev) => ({
      ...prev,
      userifo: prev.userifo.filter((_, i) => i !== index),
    }));
  };

  // Updated room number change handler to work with select dropdown
  const handleRoomNumberChange = (index, value) => {
    const updatedRoomNumbers = [...editData.roomno];
    updatedRoomNumbers[index] = value;
    setEditData((prev) => ({
      ...prev,
      roomno: updatedRoomNumbers,
    }));
  };

  const addRoomNumber = () => {
    setEditData((prev) => ({
      ...prev,
      roomno: [...prev.roomno, ""],
    }));
  };

  const removeRoomNumber = (index) => {
    setEditData((prev) => ({
      ...prev,
      roomno: prev.roomno.filter((_, i) => i !== index),
    }));
  };

  const handleAmountChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    let updatedData = { ...editData, [field]: numValue };

    // Auto-calculate pending amount when amount or amountCollected changes
    if (field === "amount" || field === "amountCollected") {
      const totalAmount = field === "amount" ? numValue : editData.amount;
      const collected =
        field === "amountCollected" ? numValue : editData.amountCollected;
      updatedData.pendingamount = Math.max(0, totalAmount - collected);
    }

    setEditData(updatedData);

    // Clear related errors
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Helper function to format date for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    let date;
    // Handle ISO date format (from checkindate/checkoutdate)
    if (dateString.includes("T")) {
      date = new Date(dateString);
    }
    // Handle DD/MM/YYYY format (from checkIn/checkOut display format)
    else if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      date = new Date(year, month - 1, day);
    }
    // Handle other formats
    else {
      date = new Date(dateString);
    }

    // Return in YYYY-MM-DD format for input[type="date"]
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
    return "";
  };

  // Helper function to get available rooms for selection (excluding already selected ones)
  const getAvailableRoomsForSelection = (currentIndex) => {
    const selectedRooms = editData.roomno
      .filter((room, index) => index !== currentIndex && room.trim() !== "")
      .map((room) => room.trim());

    return availableRooms.filter(
      (room) => !selectedRooms.includes(room.number || room.roomNumber || room)
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Edit Booking Details
          </h3>
        </div>

        <div className="space-y-6">
          {/* Save Message */}
          {saveMessage.text && (
            <div
              className={`p-4 rounded-md border ${
                saveMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {saveMessage.type === "success" ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                <p className="text-sm font-medium">{saveMessage.text}</p>
              </div>
            </div>
          )}

          {/* Stay Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Stay Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(editData.checkIn)}
                  onChange={(e) => handleInputChange("checkIn", e.target.value)}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.checkIn ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.checkIn && (
                  <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(editData.checkOut)}
                  onChange={(e) =>
                    handleInputChange("checkOut", e.target.value)
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.checkOut ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.checkOut && (
                  <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>
                )}
              </div>
            </div>
          </div>

          {/* Room Assignment - Updated with selectable dropdowns */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Room Assignment
              </h4>
              <Button
                onClick={addRoomNumber}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={loading || availableRooms.length === 0}
              >
                <Plus className="h-4 w-4" />
                Add Room
              </Button>
            </div>

            {/* Room loading/error states */}
            {loading && (
              <div className="text-center py-4 text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading available rooms...
                </div>
              </div>
            )}

            {roomsError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm mb-4">
                {roomsError}
                <Button
                  onClick={fetchAvailableRooms}
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-red-700 hover:text-red-800"
                >
                  Retry
                </Button>
              </div>
            )}

            {!loading && !roomsError && availableRooms.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Home className="h-8 w-8 mx-auto mb-2" />
                <p>No available rooms for selected dates</p>
                <p className="text-sm">
                  Please check your check-in and check-out dates
                </p>
              </div>
            )}

            {editData.roomno.length === 0 && availableRooms.length > 0 && (
              <div className="text-center py-6 text-gray-500">
                <Home className="h-8 w-8 mx-auto mb-2" />
                <p>No rooms assigned yet</p>
                <p className="text-sm">
                  Click "Add Room" to assign room numbers
                </p>
              </div>
            )}

            {editData.roomno.length > 0 && (
              <div className="space-y-2">
                {editData.roomno.map((roomNumber, index) => {
                  const availableForThis = getAvailableRoomsForSelection(index);

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <select
                            value={roomNumber}
                            onChange={(e) =>
                              handleRoomNumberChange(index, e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
                            disabled={loading}
                          >
                            <option value="">Select a room...</option>
                            {availableForThis.map((room, roomIndex) => {
                              const roomDisplay =
                                room.number || room.roomNumber || room;
                              const roomValue =
                                room.number || room.roomNumber || room;
                              return (
                                <option key={roomIndex} value={roomValue}>
                                  Room {roomDisplay}
                                  {room.type && ` (${room.type})`}
                                  {room.capacity &&
                                    ` - ${room.capacity} guests`}
                                </option>
                              );
                            })}
                            {/* Show currently selected room even if not in available list */}
                            {roomNumber &&
                              !availableForThis.some(
                                (room) =>
                                  (room.number || room.roomNumber || room) ===
                                  roomNumber
                              ) && (
                                <option value={roomNumber}>
                                  Room {roomNumber} (Currently Selected)
                                </option>
                              )}
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        {availableForThis.length === 0 && roomNumber === "" && (
                          <p className="text-xs text-amber-600 mt-1">
                            No more rooms available for selection
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => removeRoomNumber(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Room Assignment Summary */}
            {editData.roomno.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Selected Rooms:</p>
                <div className="flex flex-wrap gap-2">
                  {editData.roomno
                    .filter((room) => room.trim() !== "")
                    .map((room, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                      >
                        Room {room}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editData.amount}
                  onChange={(e) => handleAmountChange("amount", e.target.value)}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amount ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter total amount"
                  disabled={loading}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Collected (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editData.amountCollected}
                  onChange={(e) =>
                    handleAmountChange("amountCollected", e.target.value)
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amountCollected
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter collected amount"
                  disabled={loading}
                />
                {errors.amountCollected && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.amountCollected}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pending Amount (₹)
                </label>
                <input
                  type="number"
                  value={editData.pendingamount}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                  placeholder="Auto-calculated"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated from total - collected
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-semibold text-lg">
                    ₹{editData.amount || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Collected</p>
                  <p className="font-semibold text-lg text-green-600">
                    ₹{editData.amountCollected || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Pending</p>
                  <p
                    className={`font-semibold text-lg ${
                      editData.pendingamount > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ₹{editData.pendingamount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save/Cancel buttons at bottom */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={loading}
          >
            Cancel Changes
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              "Save All Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingEditSection;