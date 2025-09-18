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
} from "lucide-react";

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

const BookingEditSection = ({
  booking,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [editData, setEditData] = useState({
    checkIn: "",
    checkOut: "",
    guestName: "",
    guestCount: 1,
    childrencount: 0,
    roomType: "",
    phoneNumber: "",
    email: "",
    rooms: 1,
    roomno: [],
    amount: 0,
    amountCollected: 0,
    pendingamount: 0,
    paymentStatus: "pending",
    userifo: [],
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setEditData({
        checkIn: booking.checkindate || booking.checkIn || "",
        checkOut: booking.checkoutdate || booking.checkOut || "",
        guestName: booking.guestName || "",
        guestCount: booking.guestCount || 1,
        childrencount: booking.childrencount || 0,
        roomType: booking.roomType || "",
        phoneNumber: booking.phoneNumber || "",
        email: booking.email || "",
        rooms: booking.rooms || 1,
        roomno: booking.roomno || [],
        amount: booking.amount || 0,
        amountCollected: booking.amountCollected || 0,
        pendingamount: booking.pendingamount || 0,
        paymentStatus: booking.paymentStatus || "pending",
        userifo: booking.userifo || [],
      });
    }
  }, [booking]);

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

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

    if (!editData.guestName.trim()) {
      newErrors.guestName = "Guest name is required";
    }

    if (editData.guestCount < 1) {
      newErrors.guestCount = "At least 1 guest is required";
    }

    if (editData.childrencount < 0) {
      newErrors.childrencount = "Children count cannot be negative";
    }

    // Validate user info
    editData.userifo.forEach((user, index) => {
      if (!user.name.trim()) {
        newErrors[`user_${index}_name`] = "Name is required";
      }
      if (!user.phone.trim()) {
        newErrors[`user_${index}_phone`] = "Phone is required";
      }
      if (!user.email.trim()) {
        newErrors[`user_${index}_email`] = "Email is required";
      }
      if (!user.age || user.age < 1) {
        newErrors[`user_${index}_age`] = "Valid age is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(editData);
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
          {/* Stay Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Stay Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                {errors.checkOut && (
                  <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  min="1"
                  value={editData.rooms}
                  onChange={(e) =>
                    handleInputChange("rooms", parseInt(e.target.value) || 1)
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.rooms ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.rooms && (
                  <p className="text-red-500 text-xs mt-1">{errors.rooms}</p>
                )}
              </div>
            </div>
          </div>

          {/* Room Assignment */}
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
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add Room
              </Button>
            </div>

            {editData.roomno.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Home className="h-8 w-8 mx-auto mb-2" />
                <p>No rooms assigned yet</p>
                <p className="text-sm">
                  Click "Add Room" to assign room numbers
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {editData.roomno.map((roomNumber, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) =>
                          handleRoomNumberChange(index, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Room ${index + 1} number`}
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      onClick={() => removeRoomNumber(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payment Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status *
                </label>
                <select
                  value={editData.paymentStatus}
                  onChange={(e) =>
                    handleInputChange("paymentStatus", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
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

          {/* Primary Guest Contact */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Primary Guest Contact
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={editData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    className={`w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-8 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guest Count */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Guest Count Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Guest Name *
                </label>
                <input
                  type="text"
                  value={editData.guestName}
                  onChange={(e) =>
                    handleInputChange("guestName", e.target.value)
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.guestName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter guest name"
                  disabled={isLoading}
                />
                {errors.guestName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.guestName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adult Count *
                </label>
                <input
                  type="number"
                  min="1"
                  value={editData.guestCount}
                  onChange={(e) =>
                    handleInputChange(
                      "guestCount",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.guestCount ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.guestCount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.guestCount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={editData.childrencount}
                  onChange={(e) =>
                    handleInputChange(
                      "childrencount",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.childrencount ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                />
                {errors.childrencount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.childrencount}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Guest Details
              </h4>
              <Button
                onClick={addGuestInfo}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add Guest
              </Button>
            </div>

            {editData.userifo.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-8 w-8 mx-auto mb-2" />
                <p>No guest details added yet</p>
                <p className="text-sm">
                  Click "Add Guest" to add guest information
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {editData.userifo.map((user, index) => (
                  <div
                    key={user._id || index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-900">
                        Guest {index + 1}
                      </h5>
                      <Button
                        onClick={() => removeGuestInfo(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) =>
                            handleUserInfoChange(index, "name", e.target.value)
                          }
                          className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`user_${index}_name`]
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter name"
                          disabled={isLoading}
                        />
                        {errors[`user_${index}_name`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`user_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            value={user.phone}
                            onChange={(e) =>
                              handleUserInfoChange(
                                index,
                                "phone",
                                e.target.value
                              )
                            }
                            className={`w-full pl-8 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors[`user_${index}_phone`]
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter phone"
                            disabled={isLoading}
                          />
                        </div>
                        {errors[`user_${index}_phone`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`user_${index}_phone`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                              handleUserInfoChange(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                            className={`w-full pl-8 p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors[`user_${index}_email`]
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter email"
                            disabled={isLoading}
                          />
                        </div>
                        {errors[`user_${index}_email`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`user_${index}_email`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={user.age}
                          onChange={(e) =>
                            handleUserInfoChange(index, "age", e.target.value)
                          }
                          className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`user_${index}_age`]
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter age"
                          disabled={isLoading}
                        />
                        {errors[`user_${index}_age`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors[`user_${index}_age`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={user.gender}
                          onChange={(e) =>
                            handleUserInfoChange(
                              index,
                              "gender",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isLoading}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save/Cancel buttons at bottom */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
          <Button onClick={onCancel} variant="outline" disabled={isLoading}>
            Cancel Changes
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingEditSection;
