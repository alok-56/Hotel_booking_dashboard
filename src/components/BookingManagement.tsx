// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   Plus,
//   Filter,
//   MoreHorizontal,
//   Users,
//   Bed,
//   CreditCard,
//   Clock,
//   CheckCircle,
//   Home,
//   Search,
//   DollarSign,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { useToast } from "@/hooks/use-toast";
// import BookingDetailModal from "./BookingDetailModal";
// import EnhancedAddBookingModal from "./EnhancedAddBookingModal";
// import { PageSkeleton, TableSkeleton } from "./SkeletonLoader";
// import {
//   getAllBookings,
//   updateBookingStatus,
// } from "@/api/Services/Booking/booking";
// import { GetRoomnumber } from "@/api/Services/Hotel/hotel";

// interface Booking {
//   id: string;
//   guestName: string;
//   bookingId: string;
//   checkIn: string;
//   checkOut: string;
//   nights: number;
//   rooms: number;
//   amount: number;
//   amountCollected: number;
//   pendingamount: number;
//   status: "upcoming" | "in-house" | "completed";
//   paymentStatus: "paid" | "pending" | "partial";
//   guestCount: number;
//   roomType: string;
//   source: "direct" | "ota";
//   phoneNumber: string;
//   email: string;
//   roomno: any;
//   roomId: any;
//   checkindate: any;
//   checkoutdate: any;
// }

// const BookingManagement = () => {
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState<
//     "upcoming" | "in-house" | "completed"
//   >("upcoming");
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [showBookingDetail, setShowBookingDetail] = useState(false);
//   const [showAddBooking, setShowAddBooking] = useState(false);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // New state for search and collect payment
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showCollectPayment, setShowCollectPayment] = useState(false);
//   const [collectingBooking, setCollectingBooking] = useState<Booking | null>(
//     null
//   );
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
//   const [confirmationDialog, setConfirmationDialog] = useState(false);

//   // New state for assign room modal
//   const [showAssignRoom, setShowAssignRoom] = useState(false);
//   const [assigningBooking, setAssigningBooking] = useState<Booking | null>(
//     null
//   );
//   const [assignRooms, setAssignRooms] = useState<string[]>([]);
//   const [roomConfirmationDialog, setRoomConfirmationDialog] = useState(false);
//   const [roomNumbers, setroomNumbers] = useState<string[]>([]);

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getAllBookings();
//       if (response.status) {
//         const transformedBookings: Booking[] = response.data.map(
//           (booking: any) => ({
//             id: booking._id || booking.id,
//             guestName: booking.userInfo?.[0]?.name || "Unknown Guest",
//             bookingId:
//               `#${booking._id?.slice(-8)?.toUpperCase()}` || "#UNKNOWN",
//             checkIn: new Date(booking.checkInDate).toLocaleDateString(),
//             checkOut: new Date(booking.checkOutDate).toLocaleDateString(),
//             nights: Math.ceil(
//               (new Date(booking.checkOutDate).getTime() -
//                 new Date(booking.checkInDate).getTime()) /
//                 (1000 * 60 * 60 * 24)
//             ),
//             rooms: booking.roomId?.length || 1,
//             addOns: booking.addOns || [],
//             amount: booking.totalAmount || 0,
//             amountCollected: booking.amountPaid || 0,
//             pendingamount: booking.pendingAmount || 0,
//             roomno: booking.RoomNo,
//             status:
//               booking.status === "booked"
//                 ? "upcoming"
//                 : booking.status === "checkin"
//                 ? "in-house"
//                 : booking.status === "checkout"
//                 ? "completed"
//                 : booking.status,
//             paymentStatus: booking.paymentDetails.status || "pending",
//             guestCount: booking.guests?.adults || 1,
//             childrencount: booking.guests?.children || 0,
//             userifo: booking.userInfo || [],
//             roomType: booking.roomType || "Standard",
//             source: booking.source || "direct",
//             phoneNumber: booking.userInfo?.[0]?.phone || "",
//             email: booking.userInfo?.[0]?.email || "",
//             roomId: booking.roomId[0],
//             checkindate: booking.checkInDate,
//             checkoutdate: booking.checkOutDate,
//           })
//         );

//         setBookings(transformedBookings);
//       } else {
//         throw new Error(response.message || "Failed to load bookings");
//       }
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to load bookings";
//       setError(errorMessage);
//       setBookings([]);
//       toast({
//         title: "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
//     try {
//       await updateBookingStatus(bookingId, newStatus, "", "");
//       toast({
//         title: "Status Updated",
//         description: `Booking status updated to ${newStatus}`,
//       });
//       loadBookings();
//       setShowBookingDetail(false);
//     } catch (error) {
//       toast({
//         title: "Update Failed",
//         description:
//           error instanceof Error
//             ? error.message
//             : "Failed to update booking status",
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "upcoming":
//         return <Clock className="h-4 w-4 text-blue-600" />;
//       case "in-house":
//         return <Home className="h-4 w-4 text-green-600" />;
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-gray-600" />;
//       default:
//         return null;
//     }
//   };

//   const getPaymentStatusColor = (status: string) => {
//     switch (status) {
//       case "paid":
//         return "text-green-600 bg-green-100";
//       case "partial":
//         return "text-orange-600 bg-orange-100";
//       case "pending":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   // Static room numbers for now

//   const paymentMethods = [ "Cash" , "GooglePay" , "PhonePe" , "Card" , "UPI" , "NetBanking"];

//   const filteredBookings = bookings
//     .filter((booking) => booking.status === activeTab)
//     .filter(
//       (booking) =>
//         searchTerm === "" ||
//         booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         booking.phoneNumber.includes(searchTerm) ||
//         booking.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
//   const inHouseCount = bookings.filter((b) => b.status === "in-house").length;
//   const completedCount = bookings.filter(
//     (b) => b.status === "completed"
//   ).length;

//   const handleBookingClick = (booking: Booking) => {
//     setSelectedBooking(booking);
//     setShowBookingDetail(true);
//   };

//   const handleBookingSuccess = () => {
//     loadBookings();
//     setShowAddBooking(false);
//   };

//   const handleCollectPayment = async (booking: Booking) => {
//     try {
//       setLoading(true);
//       let res = await GetRoomnumber(
//         booking.roomId._id,
//         booking.checkindate,
//         booking.checkoutdate
//       );
//       if (res.status) {
//         setroomNumbers(res.data);
//         setCollectingBooking(booking);
//         setShowCollectPayment(true);
//         setPaymentMethod("");
//         setSelectedRooms([]);
//       }
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmPayment = async () => {
//     if (!collectingBooking || !paymentMethod) {
//       toast({
//         title: "Missing Information",
//         description: "Please select payment method and room numbers",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       await updateBookingStatus(
//         collectingBooking.id,
//         "collectPayment",
//         paymentMethod,
//         selectedRooms.join(",")
//       );

//       toast({
//         title: "Payment Collected",
//         description: `Payment collected successfully for ${collectingBooking.guestName}`,
//       });

//       loadBookings();
//       setShowCollectPayment(false);
//       setCollectingBooking(null);
//       setConfirmationDialog(false);
//     } catch (error) {
//       toast({
//         title: "Payment Failed",
//         description:
//           error instanceof Error ? error.message : "Failed to collect payment",
//         variant: "destructive",
//       });
//     }
//   };

//   // New assign room functions
//   const handleAssignRoom = async (booking: Booking) => {
//     try {
//       setLoading(true);
//       let res = await GetRoomnumber(
//         booking.roomId._id,
//         booking.checkindate,
//         booking.checkoutdate
//       );
//       if (res.status) {
//         setroomNumbers(res.data);
//         setAssigningBooking(booking);
//         setShowAssignRoom(true);
//         setAssignRooms([]);
//       }
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmRoomAssignment = async () => {
//     if (!assigningBooking || assignRooms.length === 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please select at least one room",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (assignRooms.length !== assigningBooking.rooms) {
//       toast({
//         title: "Room Count Mismatch",
//         description: `Please select exactly ${assigningBooking.rooms} room(s) for this booking`,
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       let res = await updateBookingStatus(
//         assigningBooking.id,
//         "assignRoom",
//         "",
//         assignRooms.join(",")
//       );

//       if (res.status) {
//         toast({
//           title: "Rooms Assigned",
//           description: `Rooms ${assignRooms.join(
//             ", "
//           )} assigned successfully to ${assigningBooking.guestName}`,
//         });
//       }

//       loadBookings();
//       setShowAssignRoom(false);
//       setAssigningBooking(null);
//       setRoomConfirmationDialog(false);
//       setAssignRooms([]);
//     } catch (error) {
//       toast({
//         title: "Assignment Failed",
//         description:
//           error instanceof Error ? error.message : "Failed to assign rooms",
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return <PageSkeleton />;
//   }

//   return (
//     <div className="flex-1 bg-gray-50 p-6">
//       <div className="bg-white rounded-lg shadow">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
//             <div className="flex items-center space-x-3">
//               <Button
//                 onClick={() => setShowAddBooking(true)}
//                 className="bg-black text-white hover:bg-gray-800"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 New Booking
//               </Button>
//               {/* <Button variant="outline" size="icon">
//                 <Calendar className="h-4 w-4" />
//               </Button>
//               <Button variant="outline" size="icon">
//                 <Filter className="h-4 w-4" />
//               </Button>
//               <Button variant="outline" size="icon">
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button> */}
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="mt-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 type="text"
//                 placeholder="Search by guest name, booking ID, phone, or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 w-full max-w-md"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <nav className="flex space-x-8 px-6">
//             {[
//               { key: "upcoming", label: "Upcoming", count: upcomingCount },
//               { key: "in-house", label: "In-house", count: inHouseCount },
//               { key: "completed", label: "Completed", count: completedCount },
//             ].map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key as any)}
//                 className={`py-4 px-2 border-b-2 font-medium text-sm ${
//                   activeTab === tab.key
//                     ? "border-red-600 text-red-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//               >
//                 {tab.label} ({tab.count})
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name & Booking ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Stay Nights
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Rooms
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payments
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>

//                 {activeTab !== "completed" && (
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredBookings.map((booking) => (
//                 <tr
//                   key={booking.id}
//                   className="hover:bg-gray-50 cursor-pointer"
//                   onClick={() => handleBookingClick(booking)}
//                 >
//                   <td className="px-6 py-4">
//                     <div>
//                       <div className="font-medium text-gray-900">
//                         {booking.guestName}
//                       </div>
//                       <div className="flex items-center mt-1">
//                         <span
//                           className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                             booking.source === "direct"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {booking.bookingId}
//                         </span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900">
//                       {booking.nights} Night
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {booking.checkIn}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {booking.rooms} Room{booking.rooms > 1 ? "s" : ""}{" "}
//                     {booking.roomno && booking.roomno.length > 0
//                       ? `, ${booking.roomno.join(",")}`
//                       : ""}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">
//                       ₹{booking.amount}
//                     </div>
//                     {booking.amountCollected > 0 && (
//                       <div className="text-sm text-gray-500">
//                         Amount collected: ₹{booking.amountCollected}
//                       </div>
//                     )}
//                     {booking.paymentStatus === "pending" && (
//                       <div className="text-sm text-gray-500">
//                         Collect at hotel: ₹
//                         {booking.amount - booking.amountCollected}
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       {getStatusIcon(booking.status)}
//                       <span className="ml-2 text-sm text-gray-900 capitalize">
//                         {booking.status === "in-house"
//                           ? "Check-in"
//                           : booking.status}
//                       </span>
//                     </div>
//                   </td>
//                   {activeTab !== "completed" && (
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         {booking.pendingamount > 0 && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleCollectPayment(booking);
//                             }}
//                             className="text-green-600 border-green-600 hover:bg-green-50"
//                           >
//                             <DollarSign className="h-4 w-4 mr-1" />
//                             Collect ₹{booking.pendingamount}
//                           </Button>
//                         )}

//                         {booking.status === "upcoming" &&
//                           booking.paymentStatus === "paid" &&
//                           booking.roomno.length === 0 && (
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleAssignRoom(booking);
//                               }}
//                               className="text-blue-600 border-blue-600 hover:bg-blue-50"
//                             >
//                               <Bed className="h-4 w-4 mr-1" />
//                               Assign Room
//                             </Button>
//                           )}
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredBookings.length === 0 && (
//           <div className="text-center py-12">
//             <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No {activeTab} bookings found</p>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showBookingDetail && selectedBooking && (
//         <BookingDetailModal
//           booking={selectedBooking}
//           loadBookings={loadBookings}
//           handleStatusUpdate={handleStatusUpdate}
//           onClose={() => {
//             setShowBookingDetail(false);
//             setSelectedBooking(null);
//           }}
//         />
//       )}

//       {showAddBooking && (
//         <EnhancedAddBookingModal
//           onClose={() => setShowAddBooking(false)}
//           onSuccess={handleBookingSuccess}
//         />
//       )}

//       {/* Collect Payment Modal */}
//       {showCollectPayment && collectingBooking && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">
//               Collect Payment for {collectingBooking?.guestName}
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Pending Amount: ₹{collectingBooking?.pendingamount}
//                 </label>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payment Method *
//                 </label>
//                 <Select value={paymentMethod} onValueChange={setPaymentMethod}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select payment method" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {paymentMethods && paymentMethods.map((method) => (
//                       <SelectItem key={method} value={method}>
//                         {method}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {collectingBooking.status === "in-house" ? null : (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Booking requires: {collectingBooking.rooms} room
//                     {collectingBooking.rooms > 1 ? "s" : ""}
//                   </label>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Rooms *
//                     </label>
//                     <Select
//                       value=""
//                       onValueChange={(value) => {
//                         if (
//                           value &&
//                           !selectedRooms.includes(value) &&
//                           selectedRooms.length < collectingBooking.rooms
//                         ) {
//                           setSelectedRooms([...selectedRooms, value]);
//                         }
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select room numbers" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {roomNumbers && roomNumbers
//                           .filter((room) => !selectedRooms.includes(room))
//                           .map((room) => (
//                             <SelectItem key={room} value={room}>
//                               Room {room}
//                             </SelectItem>
//                           ))}
//                       </SelectContent>
//                     </Select>

//                     {selectedRooms.length > 0 && (
//                       <div className="mt-2 flex flex-wrap gap-1">
//                         {selectedRooms.map((room, index) => (
//                           <span
//                             key={index}
//                             className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
//                           >
//                             Room {room}
//                             <button
//                               onClick={() =>
//                                 setSelectedRooms(
//                                   selectedRooms.filter((r) => r !== room)
//                                 )
//                               }
//                               className="ml-1 text-blue-600 hover:text-blue-800"
//                             >
//                               ×
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                     )}

//                     <div className="mt-2 text-sm text-gray-500">
//                       Selected: {selectedRooms.length} /{" "}
//                       {collectingBooking.rooms} rooms
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end space-x-3 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowCollectPayment(false);
//                   setCollectingBooking(null);
//                 }}
//               >
//                 Cancel
//               </Button>

//               <AlertDialog
//                 open={confirmationDialog}
//                 onOpenChange={setConfirmationDialog}
//               >
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     onClick={() => setConfirmationDialog(true)}
//                     disabled={
//                       !paymentMethod || collectingBooking.status === "in-house"
//                         ? null
//                         : selectedRooms.length === 0
//                     }
//                   >
//                     Collect Payment
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       Confirm Payment Collection
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       Are you sure you want to collect ₹
//                       {collectingBooking.pendingamount} from{" "}
//                       {collectingBooking.guestName} via {paymentMethod}?
//                       <br />
//                       Assigned rooms: {selectedRooms.join(", ")}
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction onClick={handleConfirmPayment}>
//                       Confirm Collection
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Assign Room Modal */}
//       {showAssignRoom && assigningBooking && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">
//               Assign Rooms for {assigningBooking.guestName}
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Booking requires: {assigningBooking.rooms} room
//                   {assigningBooking.rooms > 1 ? "s" : ""}
//                 </label>
//                 <label className="block text-sm text-gray-500 mb-2">
//                   Check-in: {assigningBooking.checkIn} | Check-out:{" "}
//                   {assigningBooking.checkOut}
//                 </label>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Rooms *
//                 </label>
//                 <Select
//                   value=""
//                   onValueChange={(value) => {
//                     if (
//                       value &&
//                       !assignRooms.includes(value) &&
//                       assignRooms.length < assigningBooking.rooms
//                     ) {
//                       setAssignRooms([...assignRooms, value]);
//                     }
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select room numbers" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {roomNumbers
//                       .filter((room) => !assignRooms.includes(room))
//                       .map((room) => (
//                         <SelectItem key={room} value={room}>
//                           Room {room}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>

//                 {assignRooms.length > 0 && (
//                   <div className="mt-2 flex flex-wrap gap-1">
//                     {assignRooms.map((room, index) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
//                       >
//                         Room {room}
//                         <button
//                           onClick={() =>
//                             setAssignRooms(
//                               assignRooms.filter((r) => r !== room)
//                             )
//                           }
//                           className="ml-1 text-blue-600 hover:text-blue-800"
//                         >
//                           ×
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 <div className="mt-2 text-sm text-gray-500">
//                   Selected: {assignRooms.length} / {assigningBooking.rooms}{" "}
//                   rooms
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowAssignRoom(false);
//                   setAssigningBooking(null);
//                   setAssignRooms([]);
//                 }}
//               >
//                 Cancel
//               </Button>

//               <AlertDialog
//                 open={roomConfirmationDialog}
//                 onOpenChange={setRoomConfirmationDialog}
//               >
//                 <AlertDialogTrigger asChild>
//                   <Button
//                     onClick={() => setRoomConfirmationDialog(true)}
//                     disabled={assignRooms.length !== assigningBooking.rooms}
//                   >
//                     Assign Rooms
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>Confirm Room Assignment</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       Are you sure you want to assign rooms{" "}
//                       {assignRooms.join(", ")} to {assigningBooking.guestName}?
//                       <br />
//                       Booking ID: {assigningBooking.bookingId}
//                       <br />
//                       Stay Period: {assigningBooking.checkIn} -{" "}
//                       {assigningBooking.checkOut}
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction onClick={handleConfirmRoomAssignment}>
//                       Confirm Assignment
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingManagement;

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Filter,
  MoreHorizontal,
  Users,
  Bed,
  CreditCard,
  Clock,
  CheckCircle,
  Home,
  Search,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import BookingDetailModal from "./BookingDetailModal";
import EnhancedAddBookingModal from "./EnhancedAddBookingModal";
import { PageSkeleton, TableSkeleton } from "./SkeletonLoader";
import {
  getAllBookings,
  updateBookingStatus,
} from "@/api/Services/Booking/booking";
import { GetRoomnumber } from "@/api/Services/Hotel/hotel";

interface Booking {
  id: string;
  guestName: string;
  bookingId: string;
  actualBookingId?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  amount: number;
  amountCollected: number;
  pendingamount: number;
  status: "upcoming" | "in-house" | "completed";
  paymentStatus: "paid" | "pending" | "partial";
  guestCount: number;
  roomType: string;
  source: any;
  phoneNumber: string;
  email: string;
  roomno: any;
  roomId: any;
  checkindate: any;
  checkoutdate: any;
}

const BookingManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "in-house" | "completed"
  >("upcoming");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectingAmount, setCollectingAmount] = useState("");

  // New state for search and collect payment
  const [searchTerm, setSearchTerm] = useState("");
  const [showCollectPayment, setShowCollectPayment] = useState(false);
  const [collectingBooking, setCollectingBooking] = useState<Booking | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  // New state for assign room modal
  const [showAssignRoom, setShowAssignRoom] = useState(false);
  const [assigningBooking, setAssigningBooking] = useState<Booking | null>(
    null
  );
  const [assignRooms, setAssignRooms] = useState<string[]>([]);
  const [roomConfirmationDialog, setRoomConfirmationDialog] = useState(false);
  const [roomNumbers, setroomNumbers] = useState<string[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBookings();
      if (response.status) {
        const transformedBookings: Booking[] = response.data.map(
          (booking: any) => ({
            id: booking._id || booking.id,
            guestName: booking.userInfo?.[0]?.name || "Unknown Guest",
            bookingId:
              `#${booking._id?.slice(-8)?.toUpperCase()}` || "#UNKNOWN",
            actualBookingId: booking.bookingId,
            source: booking.bookingsource,
            checkIn: new Date(booking.checkInDate).toLocaleDateString(),
            checkOut: new Date(booking.checkOutDate).toLocaleDateString(),
            nights: Math.ceil(
              (new Date(booking.checkOutDate).getTime() -
                new Date(booking.checkInDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            rooms: booking.roomId?.length || 1,
            addOns: booking.addOns || [],
            amount: booking.totalAmount || 0,
            amountCollected: booking.amountPaid || 0,
            pendingamount: booking.pendingAmount || 0,
            roomno: booking.RoomNo,
            status:
              booking.status === "booked"
                ? "upcoming"
                : booking.status === "checkin"
                ? "in-house"
                : booking.status === "checkout"
                ? "completed"
                : booking.status,
            paymentStatus: booking.paymentDetails.status || "pending",
            guestCount: booking.guests?.adults || 1,
            childrencount: booking.guests?.children || 0,
            userifo: booking.userInfo || [],
            roomType: booking.roomType || "Standard",
            phoneNumber: booking.userInfo?.[0]?.phone || "",
            email: booking.userInfo?.[0]?.email || "",
            roomId: booking.roomId,
            checkindate: booking.checkInDate,
            checkoutdate: booking.checkOutDate,
            hotelId:booking?.hotelId
          })
        );

        setBookings(transformedBookings);
      } else {
        throw new Error(response.message || "Failed to load bookings");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load bookings";
      setError(errorMessage);
      setBookings([]);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus, "", "");
      toast({
        title: "Status Updated",
        description: `Booking status updated to ${newStatus}`,
      });
      loadBookings();
      setShowBookingDetail(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "in-house":
        return <Home className="h-4 w-4 text-green-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "partial":
        return "text-orange-600 bg-orange-100";
      case "pending":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Payment methods array
  const paymentMethods = [
    "Cash",
    "GooglePay",
    "PhonePe",
    "Card",
    "UPI",
    "NetBanking",
    "Paytm",
    "Cheque",
  ];

  // Filter valid room numbers to prevent empty string values
  const getValidRoomNumbers = (rooms: string[]) => {
    return rooms.filter((room) => room && room.toString().trim() !== "");
  };

  const filteredBookings = bookings
    .filter((booking) => booking.status === activeTab)
    .filter(
      (booking) =>
        searchTerm === "" ||
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phoneNumber.includes(searchTerm) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.actualBookingId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const inHouseCount = bookings.filter((b) => b.status === "in-house").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingDetail(true);
  };

  const handleBookingSuccess = () => {
    loadBookings();
    setShowAddBooking(false);
  };

  const handleCollectPayment = async (booking: Booking) => {
    try {
      setLoading(true);
      let res = await GetRoomnumber(
        booking.roomId.map((b: any) => b._id).join(","),
        booking.checkindate,
        booking.checkoutdate
      );
      if (res.status) {
        setroomNumbers(getValidRoomNumbers(res.data || []));
        setCollectingBooking(booking);
        setShowCollectPayment(true);
        setPaymentMethod("");
        setSelectedRooms(booking.roomno || []);
      }
    } catch (error) {
      console.error("Error getting room numbers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!collectingBooking || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please select payment method and room numbers",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateBookingStatus(
        collectingBooking.id,
        "collectPayment",
        paymentMethod,
        selectedRooms.join(","),
        collectingAmount
      );

      toast({
        title: "Payment Collected",
        description: `Payment collected successfully for ${collectingBooking.guestName}`,
      });

      loadBookings();
      setShowCollectPayment(false);
      setCollectingBooking(null);
      setConfirmationDialog(false);
      setCollectingAmount("");
    } catch (error) {
      toast({
        title: "Payment Failed",
        description:
          error instanceof Error ? error.message : "Failed to collect payment",
        variant: "destructive",
      });
    }
  };

  // New assign room functions
  const handleAssignRoom = async (booking: Booking) => {
    try {
      console.log(booking.roomId);
      setLoading(true);
      let res = await GetRoomnumber(
        booking.roomId.map((b: any) => b._id).join(","),
        booking.checkindate,
        booking.checkoutdate
      );
      if (res.status) {
        setroomNumbers(getValidRoomNumbers(res.data || []));
        setAssigningBooking(booking);
        setShowAssignRoom(true);
        setAssignRooms([]);
      }
    } catch (error) {
      console.error("Error getting room numbers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRoomAssignment = async () => {
    if (!assigningBooking || assignRooms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one room",
        variant: "destructive",
      });
      return;
    }

    if (assignRooms.length !== assigningBooking.rooms) {
      toast({
        title: "Room Count Mismatch",
        description: `Please select exactly ${assigningBooking.rooms} room(s) for this booking`,
        variant: "destructive",
      });
      return;
    }

    try {
      let res = await updateBookingStatus(
        assigningBooking.id,
        "assignRoom",
        "",
        assignRooms.join(",")
      );

      if (res.status) {
        toast({
          title: "Rooms Assigned",
          description: `Rooms ${assignRooms.join(
            ", "
          )} assigned successfully to ${assigningBooking.guestName}`,
        });
      }

      loadBookings();
      setShowAssignRoom(false);
      setAssigningBooking(null);
      setRoomConfirmationDialog(false);
      setAssignRooms([]);
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description:
          error instanceof Error ? error.message : "Failed to assign rooms",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowAddBooking(true)}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by guest name, booking ID, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: "upcoming", label: "Upcoming", count: upcomingCount },
              { key: "in-house", label: "In-house", count: inHouseCount },
              { key: "completed", label: "Completed", count: completedCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name & Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stay Nights
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>

                {activeTab !== "completed" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleBookingClick(booking)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.guestName}
                        {`${booking.source ? ` (${booking.source})` : ""}`}
                      </div>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            booking.source === "direct"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.actualBookingId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {booking.nights} Night
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.checkIn} - {booking.checkOut}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.rooms} Room{booking.rooms > 1 ? "s" : ""}{" "}
                    {booking.roomno && booking.roomno.length > 0
                      ? `, ${booking.roomno.join(",")}`
                      : ""}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{booking.amount}
                    </div>
                    {booking.amountCollected > 0 && (
                      <div className="text-sm text-gray-500">
                        Amount collected: ₹{booking.amountCollected}
                      </div>
                    )}
                    {booking.paymentStatus === "pending" && (
                      <div className="text-sm text-gray-500">
                        Collect at hotel: ₹
                        {booking.amount - booking.amountCollected}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(booking.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {booking.status === "in-house"
                          ? "Check-in"
                          : booking.status}
                      </span>
                    </div>
                  </td>
                  {activeTab !== "completed" && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {booking.pendingamount > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCollectPayment(booking);
                            }}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Collect ₹{booking.pendingamount}
                          </Button>
                        )}

                        {booking.status === "upcoming" &&
                          booking.paymentStatus === "paid" &&
                          booking.roomno.length === 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignRoom(booking);
                              }}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Bed className="h-4 w-4 mr-1" />
                              Assign Room
                            </Button>
                          )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No {activeTab} bookings found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showBookingDetail && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          loadBookings={loadBookings}
          handleStatusUpdate={handleStatusUpdate}
          onClose={() => {
            setShowBookingDetail(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {showAddBooking && (
        <EnhancedAddBookingModal
          onClose={() => setShowAddBooking(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Collect Payment Modal */}
      {showCollectPayment && collectingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Collect Payment for {collectingBooking.guestName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pending Amount: ₹{collectingBooking.pendingamount}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount to Collect *
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={collectingAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only positive numbers and not more than pending amount
                    if (
                      value === "" ||
                      (parseFloat(value) >= 0 &&
                        parseFloat(value) <= collectingBooking.pendingamount)
                    ) {
                      setCollectingAmount(value);
                    }
                  }}
                  min="0"
                  max={collectingBooking.pendingamount}
                  step="0.01"
                  className={`w-full ${
                    collectingAmount &&
                    (parseFloat(collectingAmount) <= 0 ||
                      parseFloat(collectingAmount) >
                        collectingBooking.pendingamount)
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {collectingBooking.status === "in-house" ? null : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking requires: {collectingBooking.rooms} room
                    {collectingBooking.rooms > 1 ? "s" : ""}
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Rooms *
                    </label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (
                          value &&
                          !selectedRooms.includes(value) &&
                          selectedRooms.length < collectingBooking.rooms
                        ) {
                          setSelectedRooms([...selectedRooms, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room numbers" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomNumbers
                          .filter((room) => !selectedRooms.includes(room))
                          .map((room) => (
                            <SelectItem key={room} value={room}>
                              Room {room}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {selectedRooms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedRooms.map((room, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            Room {room}
                            <button
                              onClick={() =>
                                setSelectedRooms(
                                  selectedRooms.filter((r) => r !== room)
                                )
                              }
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 text-sm text-gray-500">
                      Selected: {selectedRooms.length} /{" "}
                      {collectingBooking.rooms} rooms
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCollectPayment(false);
                  setCollectingBooking(null);
                }}
              >
                Cancel
              </Button>

              <AlertDialog
                open={confirmationDialog}
                onOpenChange={setConfirmationDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={() => setConfirmationDialog(true)}
                    disabled={
                      !paymentMethod || collectingBooking.status === "in-house"
                        ? null
                        : selectedRooms.length === 0
                    }
                  >
                    Collect Payment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirm Payment Collection
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to collect ₹
                      {collectingBooking.pendingamount} from{" "}
                      {collectingBooking.guestName} via {paymentMethod}?
                      <br />
                      Assigned rooms: {selectedRooms.join(", ")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmPayment}>
                      Confirm Collection
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}

      {/* Assign Room Modal */}
      {showAssignRoom && assigningBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Assign Rooms for {assigningBooking.guestName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking requires: {assigningBooking.rooms} room
                  {assigningBooking.rooms > 1 ? "s" : ""}
                </label>
                <label className="block text-sm text-gray-500 mb-2">
                  Check-in: {assigningBooking.checkIn} | Check-out:{" "}
                  {assigningBooking.checkOut}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Rooms *
                </label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (
                      value &&
                      !assignRooms.includes(value) &&
                      assignRooms.length < assigningBooking.rooms
                    ) {
                      setAssignRooms([...assignRooms, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room numbers" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomNumbers
                      .filter((room) => !assignRooms.includes(room))
                      .map((room) => (
                        <SelectItem key={room} value={room}>
                          Room {room}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {assignRooms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {assignRooms.map((room, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        Room {room}
                        <button
                          onClick={() =>
                            setAssignRooms(
                              assignRooms.filter((r) => r !== room)
                            )
                          }
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-sm text-gray-500">
                  Selected: {assignRooms.length} / {assigningBooking.rooms}{" "}
                  rooms
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignRoom(false);
                  setAssigningBooking(null);
                  setAssignRooms([]);
                }}
              >
                Cancel
              </Button>

              <AlertDialog
                open={roomConfirmationDialog}
                onOpenChange={setRoomConfirmationDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={() => setRoomConfirmationDialog(true)}
                    disabled={assignRooms.length !== assigningBooking.rooms}
                  >
                    Assign Rooms
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Room Assignment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to assign rooms{" "}
                      {assignRooms.join(", ")} to {assigningBooking.guestName}?
                      <br />
                      This will update the booking with the selected room
                      numbers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmRoomAssignment}>
                      Confirm Assignment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
