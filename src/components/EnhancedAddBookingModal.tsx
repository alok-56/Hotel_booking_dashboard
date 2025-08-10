import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  ChevronDown,
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getAllHotels } from "@/api/Services/Hotel/hotel";
import RoomAvailabilityChecker from "./RoomAvailabilityChecker";
import BookingCheckout from "./BookingCheckout";
import { FormSkeleton } from "./SkeletonLoader";

interface Hotel {
  _id: string;
  hotelName: string;
  address: string;
  city: string;
  state: string;
}

interface UserInfo {
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
}

interface AddBookingModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const EnhancedAddBookingModal: React.FC<AddBookingModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Form data
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([
    {
      name: "",
      phone: "",
      email: "",
      age: 18,
      gender: "male",
    },
  ]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState([]);
  const [selectedRoomPrice, setSelectedRoomPrice] = useState(0);
  const [notes, setNotes] = useState("");
  const [bookingSource, setBookingSource] = useState("");
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const response = await getAllHotels();
      if (response.status) {
        setHotels(response.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load hotels",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load hotels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      return Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    return 0;
  };

  const addUserInfo = () => {
    setUserInfo([
      ...userInfo,
      {
        name: "",
        phone: "",
        email: "",
        age: 18,
        gender: "male",
      },
    ]);
  };

  const removeUserInfo = (index: number) => {
    if (userInfo.length > 1) {
      setUserInfo(userInfo.filter((_, i) => i !== index));
    }
  };

  const updateUserInfo = (index: number, field: keyof UserInfo, value: any) => {
    const updated = [...userInfo];
    updated[index] = { ...updated[index], [field]: value };
    setUserInfo(updated);
  };

  const validateStep1 = () => {
    if (!selectedHotel || !checkInDate || !checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please select hotel and dates",
        variant: "destructive",
      });
      return false;
    }

    if (checkInDate >= checkOutDate) {
      toast({
        title: "Invalid Dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!selectedRoomType || selectedRoomPrice === 0 || !selectedRoomId) {
      toast({
        title: "Missing Information",
        description: "Please select a room",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const firstUser = userInfo[0];
    if (!firstUser.name || !firstUser.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide guest name and phone number",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  interface SelectedRoom {
    _id: string;
    roomType: string;
    customPrice: number;
    quantity: number;
  }

  const handleRoomSelect = (selectedRooms: SelectedRoom[]) => {
    console.log("Selected Rooms:", selectedRooms);

    if (selectedRooms.length > 0) {
      const totalPrice = selectedRooms.reduce(
        (total, room) => total + room.customPrice * room.quantity,
        0
      );
      const roomTypes = selectedRooms
        .map((room) => `${room.roomType} (${room.quantity})`)
        .join(", ");

      const roomIds = selectedRooms.map((room) => room._id);
      setSelectedRoomType(roomTypes);
      setSelectedRoomPrice(totalPrice);
      setSelectedRoomId(roomIds);

      console.log(totalPrice);
    } else {
      setSelectedRoomType("");
      setSelectedRoomPrice(0);
      setSelectedRoomId([]);
    }
  };

  const handleBookingSuccess = () => {
    onSuccess?.();
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Select Hotel & Dates";
      case 2:
        return "Choose Room";
      case 3:
        return "Guest Information";
      case 4:
        return "Review & Payment";
      default:
        return "Add Booking";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl h-full max-h-[95vh] overflow-y-auto">
          <div className="p-6">
            <FormSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl h-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getStepTitle()}
              </h2>
              <div className="flex items-center mt-2 space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep
                        ? "bg-blue-600 text-white"
                        : step < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Hotel & Dates */}
          {/* {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="hotel">Select Hotel</Label>
                <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel._id} value={hotel._id}>
                        {hotel.hotelName} - {hotel.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate
                          ? format(checkInDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate
                          ? format(checkOutDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => {
                          const minCheckout = checkInDate
                            ? new Date(checkInDate)
                            : new Date();
                          minCheckout.setHours(0, 0, 0, 0);
                          return date <= minCheckout;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Adults</Label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium">
                      {adults}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdults(adults + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Children</Label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium">
                      {children}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setChildren(children + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {checkInDate && checkOutDate && (
                <div className="text-sm text-gray-600">
                  Duration: {calculateNights()} night
                  {calculateNights() !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )} */}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="hotel">Select Hotel</Label>
                <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.map((hotel) => (
                      <SelectItem key={hotel._id} value={hotel._id}>
                        {hotel.hotelName} - {hotel.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bookingSource">Booking Source</Label>
                  <Select
                    value={bookingSource}
                    onValueChange={setBookingSource}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select booking source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walkin">Walk in</SelectItem>
                      <SelectItem value="website">Our Website</SelectItem>
                      <SelectItem value="booking.com">Booking.com</SelectItem>
                      <SelectItem value="agoda">Agoda</SelectItem>
                      <SelectItem value="expedia">Expedia</SelectItem>
                      <SelectItem value="makemytrip">MakeMyTrip</SelectItem>
                      <SelectItem value="oyo">Oyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bookingId">Booking ID</Label>
                  <Input
                    id="bookingId"
                    type="text"
                    placeholder="Enter booking ID"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    disabled={
                      bookingSource === "website" || bookingSource === "walkin"
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate
                          ? format(checkInDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !checkOutDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate
                          ? format(checkOutDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => {
                          const minCheckout = checkInDate
                            ? new Date(checkInDate)
                            : new Date();
                          minCheckout.setHours(0, 0, 0, 0);
                          return date <= minCheckout;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Adults</Label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium">
                      {adults}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdults(adults + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Children</Label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium">
                      {children}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setChildren(children + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {checkInDate && checkOutDate && (
                <div className="text-sm text-gray-600">
                  Duration: {calculateNights()} night
                  {calculateNights() !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Room Selection */}
          {currentStep === 2 &&
            selectedHotel &&
            checkInDate &&
            checkOutDate && (
              <RoomAvailabilityChecker
                hotelId={selectedHotel}
                checkInDate={checkInDate.toISOString()}
                checkOutDate={checkOutDate.toISOString()}
                onRoomSelect={handleRoomSelect}
              />
            )}

          {/* Step 3: Guest Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Guest Details</h3>
                <Button onClick={addUserInfo} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </Button>
              </div>

              {userInfo.map((user, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      {index === 0 ? "Primary Guest" : `Guest ${index + 1}`}
                    </h4>
                    {index > 0 && (
                      <Button
                        onClick={() => removeUserInfo(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        value={user.name}
                        onChange={(e) =>
                          updateUserInfo(index, "name", e.target.value)
                        }
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <Label>Phone Number *</Label>
                      <Input
                        value={user.phone}
                        onChange={(e) =>
                          updateUserInfo(index, "phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          updateUserInfo(index, "email", e.target.value)
                        }
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <Label>Age</Label>
                      <Input
                        type="number"
                        value={user.age}
                        onChange={(e) =>
                          updateUserInfo(
                            index,
                            "age",
                            parseInt(e.target.value) || 18
                          )
                        }
                        min="1"
                        max="120"
                      />
                    </div>

                    <div>
                      <Label>Gender</Label>
                      <Select
                        value={user.gender}
                        onValueChange={(value) =>
                          updateUserInfo(index, "gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <Label>Special Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Checkout */}
          {currentStep === 4 && (
            <BookingCheckout
              bookingData={{
                hotelId: selectedHotel,
                roomId: selectedRoomId,
                checkInDate: checkInDate!.toISOString(),
                checkOutDate: checkOutDate!.toISOString(),
                userInfo,
                guests: { adults, children },
                roomPrice: selectedRoomPrice,
                nights: calculateNights(),
                bookingSource: bookingSource,
                bookingId: bookingId,
              }}
              onSuccess={handleBookingSuccess}
              onCancel={onClose}
            />
          )}
        </div>

        {/* Footer */}
        {currentStep < 4 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()
                }
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </Button>
              <Button onClick={handleNext}>
                {currentStep === 3 ? "Review Booking" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAddBookingModal;
