// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Trash2,
//   Plus,
//   Minus,
//   Receipt,
//   CreditCard,
//   Banknote,
//   Smartphone,
//   CreditCard as CardIcon,
// } from "lucide-react";
// import { getAllMenus } from "@/api/Services/Hotel/hotel";
// import { createOfflineBooking } from "@/api/Services/Booking/booking";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface AddOn {
//   serviceName: string;
//   cost: number;
//   status: "active" | "inactive";
//   quantity?: number;
// }

// interface MenuItem {
//   _id: string;
//   menuname: string;
//   price: number;
//   category: string;
//   isavailable: boolean;
// }

// interface BookingData {
//   hotelId: string;
//   roomId: string[];
//   checkInDate: string;
//   checkOutDate: string;
//   userInfo: Array<{
//     name: string;
//     phone: string;
//     email: string;
//     age: number;
//     gender: string;
//   }>;
//   guests: {
//     adults: number;
//     children: number;
//   };
//   roomPrice: number;
//   nights: number;
// }

// interface BookingCheckoutProps {
//   bookingData: BookingData;
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// const BookingCheckout: React.FC<BookingCheckoutProps> = ({
//   bookingData,
//   onSuccess,
//   onCancel,
// }) => {
//   const { toast } = useToast();
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
//   const [couponCode, setCouponCode] = useState("");
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [menuLoading, setMenuLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending">(
//     "Pending"
//   );
//   const [paymentMethod, setPaymentMethod] = useState<
//     "Cash" | "GooglePay" | "PhonePe" | "Card" | "UPI" | "NetBanking"
//   >("Cash");

//   useEffect(() => {
//     loadMenuItems();
//   }, []);

//   const loadMenuItems = async () => {
//     try {
//       setMenuLoading(true);
//       const response = await getAllMenus();
//       if (response.success) {
//         setMenuItems(response.data || []);
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load menu items",
//         variant: "destructive",
//       });
//     } finally {
//       setMenuLoading(false);
//     }
//   };

//   const addMenuItemAsAddOn = (menuItem: MenuItem) => {
//     const existingAddOn = selectedAddOns.find(
//       (addon) => addon.serviceName === menuItem.menuname
//     );

//     if (existingAddOn) {
//       setSelectedAddOns((prev) =>
//         prev.map((addon) =>
//           addon.serviceName === menuItem.menuname
//             ? { ...addon, quantity: (addon.quantity || 1) + 1 }
//             : addon
//         )
//       );
//     } else {
//       setSelectedAddOns((prev) => [
//         ...prev,
//         {
//           serviceName: menuItem.menuname,
//           cost: menuItem.price,
//           status: "active",
//           quantity: 1,
//         },
//       ]);
//     }
//   };

//   const updateAddOnQuantity = (serviceName: string, increment: boolean) => {
//     setSelectedAddOns((prev) =>
//       prev
//         .map((addon) => {
//           if (addon.serviceName === serviceName) {
//             const newQuantity = (addon.quantity || 1) + (increment ? 1 : -1);
//             return newQuantity > 0
//               ? { ...addon, quantity: newQuantity }
//               : addon;
//           }
//           return addon;
//         })
//         .filter((addon) => (addon.quantity || 1) > 0)
//     );
//   };

//   const removeAddOn = (serviceName: string) => {
//     setSelectedAddOns((prev) =>
//       prev.filter((addon) => addon.serviceName !== serviceName)
//     );
//   };

//   const applyCoupon = () => {
//     if (couponCode.toLowerCase() === "summer25") {
//       setDiscountAmount(300);
//       toast({
//         title: "Coupon Applied",
//         description: "₹300 discount applied successfully!",
//       });
//     } else if (couponCode.toLowerCase() === "welcome10") {
//       setDiscountAmount(500);
//       toast({
//         title: "Coupon Applied",
//         description: "₹500 discount applied successfully!",
//       });
//     } else {
//       toast({
//         title: "Invalid Coupon",
//         description: "Please enter a valid coupon code",
//         variant: "destructive",
//       });
//     }
//   };

//   const calculateTotals = () => {
//     const baseAmount = bookingData.roomPrice * bookingData.nights;
//     const addOnsTotal = selectedAddOns.reduce(
//       (total, addon) => total + addon.cost * (addon.quantity || 1),
//       0
//     );
//     const subtotal = baseAmount + addOnsTotal;
//     const taxAmount = 0;
//     const totalAmount = subtotal + taxAmount - discountAmount;

//     return {
//       baseAmount,
//       addOnsTotal,
//       subtotal,
//       taxAmount,
//       discountAmount,
//       totalAmount: Math.max(0, totalAmount),
//       pendingAmount: paymentStatus === "Paid" ? 0 : Math.max(0, totalAmount),
//     };
//   };

//   const handleBookingCreation = async () => {
//     try {
//       setLoading(true);
//       const totals = calculateTotals();

//       const payload = {
//         hotelId: bookingData.hotelId,
//         roomId: bookingData.roomId,
//         checkInDate: bookingData.checkInDate,
//         checkOutDate: bookingData.checkOutDate,
//         userInfo: bookingData.userInfo,
//         guests: bookingData.guests,
//         addOns: selectedAddOns.map((addon) => ({
//           serviceName: addon.serviceName,
//           cost: addon.cost * (addon.quantity || 1),
//           status: addon.status,
//         })),
//         couponCode: couponCode || undefined,
//         discountAmount: totals.discountAmount,
//         taxAmount: totals.taxAmount,
//         totalAmount: totals.totalAmount,
//         pendingAmount: totals.pendingAmount,
//         paymentstatus: paymentStatus,
//         paymentMethod: paymentStatus === "Paid" ? paymentMethod : undefined,
//       };

//       const response = await createOfflineBooking(payload);

//       if (response.status) {
//         toast({
//           title: "Booking Created",
//           description: "Booking has been created successfully!",
//         });
//         onSuccess();
//       } else {
//         throw new Error(response.message || "Booking failed");
//       }
//     } catch (error) {
//       toast({
//         title: "Booking Failed",
//         description:
//           error instanceof Error ? error.message : "Failed to create booking",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPaymentMethodIcon = (method: string) => {
//     switch (method) {
//       case "Cash":
//         return <Banknote className="h-4 w-4" />;
//       case "GooglePay":
//         return <Smartphone className="h-4 w-4" />;
//       case "PhonePe":
//         return <Smartphone className="h-4 w-4" />;
//       case "Card":
//         return <CardIcon className="h-4 w-4" />;
//       case "UPI":
//         return <Smartphone className="h-4 w-4" />;
//       case "NetBanking":
//         return <CreditCard className="h-4 w-4" />;
//       default:
//         return <CreditCard className="h-4 w-4" />;
//     }
//   };

//   const totals = calculateTotals();

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Add-ons Selection */}
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Plus className="h-5 w-5 mr-2" />
//               Available Add-ons
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {menuLoading ? (
//               <div className="space-y-3">
//                 {Array.from({ length: 5 }).map((_, index) => (
//                   <div key={index} className="animate-pulse">
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {menuItems
//                   .filter((item) => item.isavailable)
//                   .map((item) => (
//                     <div
//                       key={item._id}
//                       className="flex justify-between items-center p-3 border rounded-lg"
//                     >
//                       <div>
//                         <h4 className="font-medium">{item.menuname}</h4>
//                         <p className="text-sm text-gray-600">₹{item.price}</p>
//                         <Badge variant="outline" className="text-xs">
//                           {item.category}
//                         </Badge>
//                       </div>
//                       <Button
//                         size="sm"
//                         onClick={() => addMenuItemAsAddOn(item)}
//                       >
//                         Add
//                       </Button>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Selected Add-ons */}
//         {selectedAddOns.length > 0 && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Selected Add-ons</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {selectedAddOns.map((addon, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
//                   >
//                     <div>
//                       <h4 className="font-medium">{addon.serviceName}</h4>
//                       <p className="text-sm text-gray-600">
//                         ₹{addon.cost} × {addon.quantity || 1}
//                       </p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() =>
//                           updateAddOnQuantity(addon.serviceName, false)
//                         }
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-8 text-center">
//                         {addon.quantity || 1}
//                       </span>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() =>
//                           updateAddOnQuantity(addon.serviceName, true)
//                         }
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="destructive"
//                         onClick={() => removeAddOn(addon.serviceName)}
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Coupon Code */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Coupon Code</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex space-x-2">
//               <Input
//                 placeholder="Enter coupon code"
//                 value={couponCode}
//                 onChange={(e) => setCouponCode(e.target.value)}
//               />
//               <Button onClick={applyCoupon} variant="outline">
//                 Apply
//               </Button>
//             </div>
//             {discountAmount > 0 && (
//               <p className="text-sm text-green-600 mt-2">
//                 Discount applied: ₹{discountAmount}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Booking Summary */}
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Receipt className="h-5 w-5 mr-2" />
//               Booking Summary
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Booking Details */}
//             <div className="space-y-2">
//               <h4 className="font-medium">Stay Details</h4>
//               <div className="text-sm text-gray-600">
//                 <p>
//                   Check-in:{" "}
//                   {new Date(bookingData.checkInDate).toLocaleDateString()}
//                 </p>
//                 <p>
//                   Check-out:{" "}
//                   {new Date(bookingData.checkOutDate).toLocaleDateString()}
//                 </p>
//                 <p>Nights: {bookingData.nights}</p>
//                 <p>
//                   Guests: {bookingData.guests.adults} Adults,{" "}
//                   {bookingData.guests.children} Children
//                 </p>
//               </div>
//             </div>

//             <Separator />

//             {/* Cost Breakdown */}
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span>Room charges ({bookingData.nights} nights)</span>
//                 <span>₹{totals.baseAmount.toLocaleString()}</span>
//               </div>

//               {selectedAddOns.length > 0 && (
//                 <div className="space-y-1">
//                   <div className="flex justify-between font-medium">
//                     <span>Add-ons</span>
//                     <span>₹{totals.addOnsTotal.toLocaleString()}</span>
//                   </div>
//                   {selectedAddOns.map((addon, index) => (
//                     <div
//                       key={index}
//                       className="flex justify-between text-sm text-gray-600 ml-4"
//                     >
//                       <span>
//                         {addon.serviceName} × {addon.quantity || 1}
//                       </span>
//                       <span>
//                         ₹{(addon.cost * (addon.quantity || 1)).toLocaleString()}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{totals.subtotal.toLocaleString()}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Tax</span>
//                 <span>₹{totals.taxAmount.toLocaleString()}</span>
//               </div>

//               {totals.discountAmount > 0 && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Discount</span>
//                   <span>-₹{totals.discountAmount.toLocaleString()}</span>
//                 </div>
//               )}

//               <Separator />

//               <div className="flex justify-between text-lg font-bold">
//                 <span>Total Amount</span>
//                 <span>₹{totals.totalAmount.toLocaleString()}</span>
//               </div>

//               {/* Payment Status Selection */}
//               <div className="flex items-center space-x-2">
//                 <span>Payment Status</span>
//                 <Select
//                   value={paymentStatus}
//                   onValueChange={(value) =>
//                     setPaymentStatus(value as "Paid" | "Pending")
//                   }
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Pending">
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
//                         Pending
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="Paid">
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//                         Paid
//                       </div>
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Payment Method Selection - Only show when Paid is selected */}
//               {paymentStatus === "Paid" && (
//                 <div className="space-y-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">Payment Method</span>
//                     <Select
//                       value={paymentMethod}
//                       onValueChange={(value) =>
//                         setPaymentMethod(
//                           value as
//                             | "Cash"
//                             | "GooglePay"
//                             | "PhonePe"
//                             | "Card"
//                             | "UPI"
//                             | "NetBanking"
//                         )
//                       }
//                     >
//                       <SelectTrigger className="w-40">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Cash">
//                           <div className="flex items-center">
//                             <Banknote className="h-4 w-4 mr-2" />
//                             Cash
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="GooglePay">
//                           <div className="flex items-center">
//                             <Smartphone className="h-4 w-4 mr-2" />
//                             Google Pay
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="PhonePe">
//                           <div className="flex items-center">
//                             <Smartphone className="h-4 w-4 mr-2" />
//                             PhonePe
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="Card">
//                           <div className="flex items-center">
//                             <CardIcon className="h-4 w-4 mr-2" />
//                             Debit/Credit Card
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="UPI">
//                           <div className="flex items-center">
//                             <Smartphone className="h-4 w-4 mr-2" />
//                             UPI
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="NetBanking">
//                           <div className="flex items-center">
//                             <CreditCard className="h-4 w-4 mr-2" />
//                             Net Banking
//                           </div>
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="flex items-center text-sm text-green-700">
//                     {getPaymentMethodIcon(paymentMethod)}
//                     <span className="ml-2">
//                       Payment completed via {paymentMethod}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-between text-lg font-bold text-red-600">
//                 <span>Pending Amount</span>
//                 <span>₹{totals.pendingAmount.toLocaleString()}</span>
//               </div>
//             </div>

//             <Separator />

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <Button
//                 className="w-full"
//                 onClick={handleBookingCreation}
//                 disabled={loading}
//               >
//                 <CreditCard className="h-4 w-4 mr-2" />
//                 {loading ? "Creating Booking..." : "Create Booking"}
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full"
//                 onClick={onCancel}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default BookingCheckout;

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  Plus,
  Minus,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { getAllMenus } from "@/api/Services/Hotel/hotel";
import { createOfflineBooking } from "@/api/Services/Booking/booking";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddOn {
  serviceName: string;
  cost: number;
  status: "active" | "inactive";
  quantity?: number;
}

interface MenuItem {
  _id: string;
  menuname: string;
  price: number;
  category: string;
  isavailable: boolean;
}

interface BookingData {
  hotelId: string;
  roomId: string[];
  checkInDate: string;
  checkOutDate: string;
  userInfo: Array<{
    name: string;
    phone: string;
    email: string;
    age: number;
    gender: string;
  }>;
  guests: {
    adults: number;
    children: number;
  };
  roomPrice: number;
  nights: number;
  bookingSource: String;
  bookingId: String;
}

interface BookingCheckoutProps {
  bookingData: BookingData;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookingCheckout: React.FC<BookingCheckoutProps> = ({
  bookingData,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending">(
    "Pending"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "GooglePay" | "PhonePe" | "Card" | "UPI" | "NetBanking"
  >("Cash");
  const [paidAmount, setPaidAmount] = useState<number>(0);

  useEffect(() => {
    loadMenuItems();
  }, []);

  // Reset paid amount when payment status changes
  useEffect(() => {
    if (paymentStatus === "Pending") {
      setPaidAmount(0);
    }
  }, [paymentStatus]);

  const loadMenuItems = async () => {
    try {
      setMenuLoading(true);
      const response = await getAllMenus();
      if (response.success) {
        setMenuItems(response.data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setMenuLoading(false);
    }
  };

  const addMenuItemAsAddOn = (menuItem: MenuItem) => {
    const existingAddOn = selectedAddOns.find(
      (addon) => addon.serviceName === menuItem.menuname
    );

    if (existingAddOn) {
      setSelectedAddOns((prev) =>
        prev.map((addon) =>
          addon.serviceName === menuItem.menuname
            ? { ...addon, quantity: (addon.quantity || 1) + 1 }
            : addon
        )
      );
    } else {
      setSelectedAddOns((prev) => [
        ...prev,
        {
          serviceName: menuItem.menuname,
          cost: menuItem.price,
          status: "active",
          quantity: 1,
        },
      ]);
    }
  };

  const updateAddOnQuantity = (serviceName: string, increment: boolean) => {
    setSelectedAddOns((prev) =>
      prev
        .map((addon) => {
          if (addon.serviceName === serviceName) {
            const newQuantity = (addon.quantity || 1) + (increment ? 1 : -1);
            return newQuantity > 0
              ? { ...addon, quantity: newQuantity }
              : addon;
          }
          return addon;
        })
        .filter((addon) => (addon.quantity || 1) > 0)
    );
  };

  const removeAddOn = (serviceName: string) => {
    setSelectedAddOns((prev) =>
      prev.filter((addon) => addon.serviceName !== serviceName)
    );
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "summer25") {
      setDiscountAmount(300);
      toast({
        title: "Coupon Applied",
        description: "₹300 discount applied successfully!",
      });
    } else if (couponCode.toLowerCase() === "welcome10") {
      setDiscountAmount(500);
      toast({
        title: "Coupon Applied",
        description: "₹500 discount applied successfully!",
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code",
        variant: "destructive",
      });
    }
  };

  const calculateTotals = () => {
    const baseAmount = bookingData.roomPrice * bookingData.nights;
    const addOnsTotal = selectedAddOns.reduce(
      (total, addon) => total + addon.cost * (addon.quantity || 1),
      0
    );
    const subtotal = baseAmount + addOnsTotal;
    const taxAmount = 0;
    const totalAmount = subtotal + taxAmount - discountAmount;
    const finalTotalAmount = Math.max(0, totalAmount);

    // Calculate pending amount based on payment status and paid amount
    let pendingAmount = 0;
    if (paymentStatus === "Pending") {
      pendingAmount = finalTotalAmount;
    } else if (paymentStatus === "Paid") {
      pendingAmount = Math.max(0, finalTotalAmount - paidAmount);
    }

    return {
      baseAmount,
      addOnsTotal,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount: finalTotalAmount,
      pendingAmount,
      paidAmount: paymentStatus === "Paid" ? paidAmount : 0,
    };
  };

  const handlePaidAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const totals = calculateTotals();
    // Ensure paid amount doesn't exceed total amount
    const maxAmount = totals.totalAmount;
    setPaidAmount(Math.min(amount, maxAmount));
  };

  const handleBookingCreation = async () => {
    try {
      setLoading(true);
      const totals = calculateTotals();

      // Validation for paid amount
      if (paymentStatus === "Paid" && paidAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid paid amount",
          variant: "destructive",
        });
        return;
      }

      if (paymentStatus === "Paid" && paidAmount > totals.totalAmount) {
        toast({
          title: "Invalid Amount",
          description: "Paid amount cannot exceed total amount",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        hotelId: bookingData.hotelId,
        roomId: bookingData.roomId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        userInfo: bookingData.userInfo,
        guests: bookingData.guests,
        addOns: selectedAddOns.map((addon) => ({
          serviceName: addon.serviceName,
          cost: addon.cost * (addon.quantity || 1),
          status: addon.status,
        })),
        couponCode: couponCode || undefined,
        discountAmount: totals.discountAmount,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        amountPaid: totals.paidAmount,
        pendingAmount: totals.pendingAmount,
        paymentstatus: totals.pendingAmount > 0 ? "pending" : paymentStatus,
        paymentMethod: paymentStatus === "Paid" ? paymentMethod : undefined,
        bookingSource: bookingData.bookingSource,
        bookingId: bookingData.bookingId,
      };

      const response = await createOfflineBooking(payload);

      if (response.status) {
        toast({
          title: "Booking Created",
          description: "Booking has been created successfully!",
        });
        onSuccess();
      } else {
        throw new Error(response.message || "Booking failed");
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Cash":
        return <Banknote className="h-4 w-4" />;
      case "GooglePay":
        return <Smartphone className="h-4 w-4" />;
      case "PhonePe":
        return <Smartphone className="h-4 w-4" />;
      case "Card":
        return <CreditCard className="h-4 w-4" />;
      case "UPI":
        return <Smartphone className="h-4 w-4" />;
      case "NetBanking":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const totals = calculateTotals();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add-ons Selection */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Available Add-ons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {menuLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {menuItems
                  .filter((item) => item.isavailable)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{item.menuname}</h4>
                        <p className="text-sm text-gray-600">₹{item.price}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addMenuItemAsAddOn(item)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected Add-ons */}
        {selectedAddOns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedAddOns.map((addon, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{addon.serviceName}</h4>
                      <p className="text-sm text-gray-600">
                        ₹{addon.cost} × {addon.quantity || 1}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateAddOnQuantity(addon.serviceName, false)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">
                        {addon.quantity || 1}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateAddOnQuantity(addon.serviceName, true)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeAddOn(addon.serviceName)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coupon Code */}
        <Card>
          <CardHeader>
            <CardTitle>Coupon Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button onClick={applyCoupon} variant="outline">
                Apply
              </Button>
            </div>
            {discountAmount > 0 && (
              <p className="text-sm text-green-600 mt-2">
                Discount applied: ₹{discountAmount}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Booking Details */}
            <div className="space-y-2">
              <h4 className="font-medium">Stay Details</h4>
              <div className="text-sm text-gray-600">
                <p>
                  Check-in:{" "}
                  {new Date(bookingData.checkInDate).toLocaleDateString()}
                </p>
                <p>
                  Check-out:{" "}
                  {new Date(bookingData.checkOutDate).toLocaleDateString()}
                </p>
                <p>Nights: {bookingData.nights}</p>
                <p>
                  Guests: {bookingData.guests.adults} Adults,{" "}
                  {bookingData.guests.children} Children
                </p>
              </div>
            </div>

            <Separator />

            {/* Cost Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Room charges ({bookingData.nights} nights)</span>
                <span>₹{totals.baseAmount.toLocaleString()}</span>
              </div>

              {selectedAddOns.length > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Add-ons</span>
                    <span>₹{totals.addOnsTotal.toLocaleString()}</span>
                  </div>
                  {selectedAddOns.map((addon, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600 ml-4"
                    >
                      <span>
                        {addon.serviceName} × {addon.quantity || 1}
                      </span>
                      <span>
                        ₹{(addon.cost * (addon.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{totals.taxAmount.toLocaleString()}</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{totals.discountAmount.toLocaleString()}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{totals.totalAmount.toLocaleString()}</span>
              </div>

              {/* Payment Status Selection */}
              <div className="flex items-center space-x-2">
                <span>Payment Status</span>
                <Select
                  value={paymentStatus}
                  onValueChange={(value) =>
                    setPaymentStatus(value as "Paid" | "Pending")
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="Paid">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Paid
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Details - Only show when Paid is selected */}
              {paymentStatus === "Paid" && (
                <div className="space-y-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  {/* Paid Amount Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-green-800">
                      Paid Amount (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter paid amount"
                      value={paidAmount || ""}
                      onChange={(e) => handlePaidAmountChange(e.target.value)}
                      max={totals.totalAmount}
                      className="border-green-300 focus:border-green-500"
                    />
                    <p className="text-xs text-green-600">
                      Maximum: ₹{totals.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-green-800">
                      Payment Method
                    </span>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setPaymentMethod(
                          value as
                            | "Cash"
                            | "GooglePay"
                            | "PhonePe"
                            | "Card"
                            | "UPI"
                            | "NetBanking"
                        )
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">
                          <div className="flex items-center">
                            <Banknote className="h-4 w-4 mr-2" />
                            Cash
                          </div>
                        </SelectItem>
                        <SelectItem value="GooglePay">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Google Pay
                          </div>
                        </SelectItem>
                        <SelectItem value="PhonePe">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            PhonePe
                          </div>
                        </SelectItem>
                        <SelectItem value="Card">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Debit/Credit Card
                          </div>
                        </SelectItem>
                        <SelectItem value="UPI">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            UPI
                          </div>
                        </SelectItem>
                        <SelectItem value="NetBanking">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Net Banking
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Summary */}
                  {paidAmount > 0 && (
                    <div className="space-y-1 p-3 bg-white rounded border">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Amount Paid:</span>
                        <span className="font-medium text-green-700">
                          ₹{paidAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-green-700">
                        {getPaymentMethodIcon(paymentMethod)}
                        <span className="ml-2">via {paymentMethod}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pending Amount Display */}
              <div className="flex justify-between text-lg font-bold">
                <span
                  className={
                    totals.pendingAmount > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  Pending Amount
                </span>
                <span
                  className={
                    totals.pendingAmount > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  ₹{totals.pendingAmount.toLocaleString()}
                </span>
              </div>

              {totals.pendingAmount === 0 && paymentStatus === "Paid" && (
                <div className="flex items-center justify-center p-2 bg-green-100 text-green-800 rounded text-sm">
                  ✓ Fully Paid
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={handleBookingCreation}
                disabled={loading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loading ? "Creating Booking..." : "Create Booking"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCheckout;
