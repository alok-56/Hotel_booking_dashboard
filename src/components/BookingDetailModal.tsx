// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Plus, MoreVertical, Trash2 } from "lucide-react";
// import { getAllMenus } from "@/api/Services/Hotel/hotel";
// import {
//   createAddon,
//   deleteAddon,
//   updateAddon,
// } from "@/api/Services/Booking/booking";

// // Using inline button styling instead of external Button component
// const Button = ({
//   children,
//   variant = "default",
//   size = "default",
//   className = "",
//   onClick,
//   disabled,
//   ...props
// }) => {
//   const baseStyles =
//     "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

//   const variants = {
//     default: "bg-blue-600 text-white hover:bg-blue-700",
//     outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
//     ghost: "hover:bg-gray-100 text-gray-700",
//   };

//   const sizes = {
//     default: "h-9 px-4 py-2",
//     sm: "h-8 px-3 text-xs",
//     icon: "h-9 w-9",
//   };

//   return (
//     <button
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//       onClick={onClick}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const BookingDetailModal = ({
//   booking,
//   onClose,
//   handleStatusUpdate,
//   loadBookings,
// }) => {
//   const [activeSection, setActiveSection] = useState("details");
//   const [menuItems, setMenuItems] = useState([]);
//   const [addons, setAddons] = useState(booking.addOns || []);
//   const [showAddonForm, setShowAddonForm] = useState(false);
//   const [pendingAddons, setPendingAddons] = useState([]);
//   const [addonForm, setAddonForm] = useState({
//     type: "penalty",
//     serviceName: "",
//     cost: 0,
//     selectedMenu: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   // Load menu data from API
//   useEffect(() => {
//     const loadMenus = async () => {
//       try {
//         const response = await getAllMenus();
//         console.log("Menus loaded:", response);
//         if (response.status) {
//           setMenuItems(response.data);
//         }
//       } catch (error) {
//         console.error("Failed to load menus:", error);
//       }
//     };

//     loadMenus();
//   }, []);

//   const addonTypes = [
//     { value: "penalty", label: "Penalty" },
//     { value: "menu", label: "Menu" },
//     { value: "extra_hour", label: "Extra Hour" },
//     { value: "extra_day", label: "Extra Day" },
//     { value: "laundry", label: "Laundry" },
//     { value: "room_service", label: "Room Service" },
//     { value: "spa", label: "Spa Services" },
//     { value: "transportation", label: "Transportation" },
//     { value: "other", label: "Other" },
//   ];

//   const handleAddonTypeChange = (type) => {
//     setAddonForm({
//       ...addonForm,
//       type,
//       serviceName: type === "menu" ? "" : type.replace("_", " "),
//       cost: 0,
//       selectedMenu: "",
//     });
//   };

//   const handleMenuSelect = (menuId) => {
//     const selectedMenuItem = menuItems.find((item) => item._id === menuId);
//     if (selectedMenuItem) {
//       setAddonForm({
//         ...addonForm,
//         selectedMenu: menuId,
//         serviceName: selectedMenuItem.menuname,
//         cost: selectedMenuItem.price,
//       });
//     }
//   };

//   const addToPendingList = () => {
//     if (addonForm.serviceName && addonForm.cost > 0) {
//       const newPendingAddon = {
//         id: Date.now().toString(),
//         type: addonForm.type,
//         serviceName: addonForm.serviceName,
//         cost: addonForm.cost,
//         selectedMenu: addonForm.selectedMenu,
//       };

//       setPendingAddons([...pendingAddons, newPendingAddon]);
//       setAddonForm({
//         type: "penalty",
//         serviceName: "",
//         cost: 0,
//         selectedMenu: "",
//       });
//     }
//   };

//   const removePendingAddon = (id: any) => {
//     setPendingAddons(pendingAddons.filter((addon) => addon.id !== id));
//   };

//   const uploadAllPendingAddons = async () => {
//     if (pendingAddons.length === 0) return;

//     setIsLoading(true);
//     try {
//       // Format addons according to the API payload structure
//       const addOnsPayload = pendingAddons.map((addon) => ({
//         serviceName: addon.serviceName,
//         cost: addon.cost,
//       }));

//       // Create all addons in a single API call
//       const payload: any = {
//         status: "pending",
//         addOns: addOnsPayload,
//       };

//       let res = await createAddon(booking.id, payload);
//       if (res.status) {
//         loadBookings();
//         setPendingAddons([]);
//         setShowAddonForm(false);
//         onClose();
//       }
//     } catch (error) {
//       console.error("Failed to upload addons:", error);
//       alert("Failed to upload add-on services. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteAddon = async (addonIndex: any) => {
//     setIsLoading(true);
//     try {
//       const payload: any = {
//         index: addonIndex,
//         status: "pending",
//       };

//       let res = await deleteAddon(booking.id, payload);
//       if (res.status) {
//         loadBookings();
//         setPendingAddons([]);
//         setShowAddonForm(false);
//         onClose();
//       }
//     } catch (error) {
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleUpdateAddon = async (addonIndex: any, updates: any) => {
//     setIsLoading(true);
//     try {
//       const payload = {
//         index: addonIndex,
//         status: "pending",
//         ...updates,
//       };

//       await updateAddon(booking.id, payload);

//       // Update local state using index
//       const newAddons = [...addons];
//       newAddons[addonIndex] = { ...newAddons[addonIndex], ...updates };
//       setAddons(newAddons);

//       console.log("Addon updated successfully");
//     } catch (error) {
//       console.error("Failed to update addon:", error);
//       alert("Failed to update add-on service. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const calculateTotalBill = () => {
//     const addonsTotal = addons.reduce((sum, addon) => sum + addon.cost, 0);
//     const pendingTotal = pendingAddons.reduce(
//       (sum, addon) => sum + addon.cost,
//       0
//     );
//     return booking.amount + pendingTotal;
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={onClose}
//                 className="text-gray-500 hover:text-gray-700"
//                 disabled={isLoading}
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </Button>
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   {booking.guestName} + {booking.guestCount - 1}
//                 </h2>
//                 <div className="flex items-center mt-1">
//                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
//                     {booking.status === "upcoming"
//                       ? "Upcoming"
//                       : booking.status}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               {booking.status === "upcoming" ? (
//                 <>
//                   <Button
//                     onClick={() =>
//                       handleStatusUpdate?.(booking.id, "cancelled")
//                     }
//                     variant="outline"
//                     className="bg-gray-900 text-gray hover:bg-gray-800 hover:text-white"
//                     disabled={isLoading}
//                   >
//                     Cancel Booking
//                   </Button>
//                   <Button
//                     onClick={() => handleStatusUpdate?.(booking.id, "checkin")}
//                     variant="outline"
//                     className="bg-gray-900 text-gray hover:bg-gray-800 hover:text-white"
//                     disabled={
//                       isLoading ||
//                       booking.pendingamount > 0 ||
//                       booking.roomno.length === 0
//                     }
//                   >
//                     Check-in
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     disabled={isLoading}
//                     onClick={() => {}}
//                   >
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </>
//               ) : booking.status === "in-house" ? (
//                 <>
//                   <Button
//                     onClick={() => handleStatusUpdate?.(booking.id, "checkout")}
//                     variant="outline"
//                     className="bg-gray-900 text-gray hover:bg-gray-800 hover:text-white"
//                     disabled={isLoading || booking.pendingamount > 0}
//                   >
//                     Check-out
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     disabled={isLoading}
//                     onClick={() => {}}
//                   >
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </>
//               ) : null}
//             </div>
//           </div>

//           <div className="mt-4">
//             <div className="flex items-center space-x-2">
//               <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded font-medium">
//                 {booking.actualBookingId}
//               </span>
//               <span className="text-sm text-gray-500">{booking.source}</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-8">
//           {/* Stay & Room Details */}
//           <div className="bg-white rounded-lg border border-gray-200">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Stay & Room Details
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="text-sm text-gray-500">Check-in</label>
//                   <div className="mt-1 text-sm font-medium text-gray-900">
//                     {booking.checkIn}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Checkout</label>
//                   <div className="mt-1 text-sm font-medium text-gray-900">
//                     {booking.checkOut}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Room Type</label>
//                   <div className="mt-1 text-sm font-medium text-gray-900">
//                     {booking.roomType}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Guest Details - Updated with userInfo */}
//           <div className="bg-white rounded-lg border border-gray-200">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Guest details
//                 </h3>
//               </div>

//               <div className="space-y-4">
//                 {/* Primary guest info */}
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">
//                     {booking.guestName}, + {booking.guestCount - 1}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {booking.guestCount} Adults, {booking.childrencount}{" "}
//                     Children
//                   </p>
//                 </div>

//                 {/* User Info Details */}
//                 {booking.userifo && booking.userifo.length > 0 && (
//                   <div className="mt-4">
//                     <h4 className="text-sm font-medium text-gray-900 mb-3">
//                       Guest Information
//                     </h4>
//                     <div className="space-y-3">
//                       {booking.userifo &&
//                         booking.userifo.map((user, index) => (
//                           <div
//                             key={user._id}
//                             className="border border-gray-200 rounded-lg p-3 bg-gray-50"
//                           >
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                               <div>
//                                 <span className="text-xs text-gray-500">
//                                   Name:
//                                 </span>
//                                 <p className="text-sm font-medium text-gray-900">
//                                   {user.name}
//                                 </p>
//                               </div>
//                               <div>
//                                 <span className="text-xs text-gray-500">
//                                   Phone:
//                                 </span>
//                                 <p className="text-sm text-gray-700">
//                                   {user.phone}
//                                 </p>
//                               </div>
//                               <div>
//                                 <span className="text-xs text-gray-500">
//                                   Email:
//                                 </span>
//                                 <p className="text-sm text-gray-700">
//                                   {user.email}
//                                 </p>
//                               </div>
//                               <div className="flex gap-4">
//                                 <div>
//                                   <span className="text-xs text-gray-500">
//                                     Age:
//                                   </span>
//                                   <p className="text-sm text-gray-700">
//                                     {user.age}
//                                   </p>
//                                 </div>
//                                 <div>
//                                   <span className="text-xs text-gray-500">
//                                     Gender:
//                                   </span>
//                                   <p className="text-sm text-gray-700 capitalize">
//                                     {user.gender}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {booking.status === "completed" ||
//           booking.status === "upcoming" ? null : (
//             <div className="bg-white rounded-lg border border-gray-200">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Add-ons & Services
//                   </h3>
//                   <Button
//                     onClick={() => setShowAddonForm(true)}
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center gap-2"
//                     disabled={isLoading}
//                   >
//                     <Plus className="h-4 w-4" />
//                     Add Service
//                   </Button>
//                 </div>

//                 {/* Addon Form */}
//                 {showAddonForm && (
//                   <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Service Type
//                         </label>
//                         <select
//                           value={addonForm.type}
//                           onChange={(e) =>
//                             handleAddonTypeChange(e.target.value)
//                           }
//                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                           disabled={isLoading}
//                         >
//                           {addonTypes.map((type) => (
//                             <option key={type.value} value={type.value}>
//                               {type.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {addonForm.type === "menu" && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Select Menu Item
//                           </label>
//                           <select
//                             value={addonForm.selectedMenu}
//                             onChange={(e) => handleMenuSelect(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             disabled={isLoading}
//                           >
//                             <option value="">Choose a menu item</option>
//                             {menuItems &&
//                               menuItems.map((item) => (
//                                 <option key={item._id} value={item._id}>
//                                   {item.menuname} - ₹{item.price}
//                                 </option>
//                               ))}
//                           </select>
//                         </div>
//                       )}

//                       {addonForm.type !== "menu" && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Service Name
//                           </label>
//                           <input
//                             type="text"
//                             value={addonForm.serviceName}
//                             onChange={(e) =>
//                               setAddonForm({
//                                 ...addonForm,
//                                 serviceName: e.target.value,
//                               })
//                             }
//                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter service name"
//                             disabled={isLoading}
//                           />
//                         </div>
//                       )}

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Cost (₹)
//                         </label>
//                         <input
//                           type="number"
//                           value={addonForm.cost}
//                           onChange={(e) =>
//                             setAddonForm({
//                               ...addonForm,
//                               cost: Number(e.target.value),
//                             })
//                           }
//                           disabled={addonForm.type === "menu" || isLoading}
//                           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
//                           placeholder="Enter cost"
//                         />
//                       </div>

//                       <div className="flex gap-2">
//                         <Button
//                           onClick={addToPendingList}
//                           className="bg-green-600 hover:bg-green-700"
//                           disabled={isLoading}
//                         >
//                           Add to List
//                         </Button>
//                         <Button
//                           onClick={() => {
//                             setShowAddonForm(false);
//                             setPendingAddons([]);
//                           }}
//                           variant="outline"
//                           disabled={isLoading}
//                         >
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>

//                     {/* Pending Addons List */}
//                     {pendingAddons.length > 0 && (
//                       <div className="mt-4 border-t pt-4">
//                         <div className="flex items-center justify-between mb-3">
//                           <h4 className="font-medium text-gray-900">
//                             Pending Services ({pendingAddons.length})
//                           </h4>
//                           <Button
//                             onClick={uploadAllPendingAddons}
//                             className="bg-blue-600 hover:bg-blue-700"
//                             disabled={isLoading}
//                           >
//                             {isLoading ? "Uploading..." : "Upload All"}
//                           </Button>
//                         </div>
//                         <div className="space-y-2">
//                           {pendingAddons.map((addon) => (
//                             <div
//                               key={addon.id}
//                               className="flex items-center justify-between p-2 bg-yellow-50 rounded border"
//                             >
//                               <div>
//                                 <span className="font-medium text-gray-900">
//                                   {addon.serviceName}
//                                 </span>
//                                 <span className="ml-2 text-sm text-gray-500">
//                                   ₹{addon.cost}
//                                 </span>
//                               </div>
//                               <Button
//                                 onClick={() => removePendingAddon(addon.id)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="text-red-600 hover:text-red-800 hover:bg-red-50"
//                                 disabled={isLoading}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Active Addons List - Updated to pass index instead of ID */}
//                 {addons.length > 0 ? (
//                   <div className="space-y-2">
//                     <h4 className="font-medium text-gray-900 mb-2">
//                       Active Services
//                     </h4>
//                     {addons.map((addon, index) => (
//                       <div
//                         key={addon._id}
//                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                       >
//                         <div className="flex-1">
//                           <span className="font-medium text-gray-900">
//                             {addon.serviceName}
//                           </span>
//                           <span className="ml-2 text-sm text-gray-500">
//                             ₹{addon.cost}
//                           </span>
//                           {addon.status && (
//                             <span
//                               className={`ml-2 text-xs px-2 py-1 rounded ${
//                                 addon.status === "pending"
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : addon.status === "completed"
//                                   ? "bg-green-100 text-green-800"
//                                   : "bg-gray-100 text-gray-800"
//                               }`}
//                             >
//                               {addon.status}
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex gap-1">
//                           {addon.status === "pending" && (
//                             <Button
//                               onClick={() =>
//                                 handleUpdateAddon(index, {
//                                   status: "completed",
//                                 })
//                               }
//                               variant="ghost"
//                               size="sm"
//                               className="text-green-600 hover:text-green-800 hover:bg-green-50"
//                               disabled={isLoading}
//                             >
//                               Complete
//                             </Button>
//                           )}
//                           <Button
//                             onClick={() => handleDeleteAddon(index)}
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-600 hover:text-red-800 hover:bg-red-50"
//                             disabled={isLoading}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500 text-center py-4">
//                     No add-on services added yet
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Addons Section */}

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Bill Summary */}
//             <div className="bg-white rounded-lg border border-gray-200">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Bill summary
//                   </h3>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">Room charges</span>
//                     <span className="text-sm font-medium">
//                       ₹{booking.amountCollected}
//                     </span>
//                   </div>

//                   {(addons.length > 0 || pendingAddons.length > 0) && (
//                     <>
//                       <div className="flex justify-between">
//                         <span className="text-sm text-gray-600">
//                           Add-on services
//                         </span>
//                         <span className="text-sm font-medium">
//                           ₹
//                           {addons.reduce((sum, addon) => sum + addon.cost, 0) +
//                             pendingAddons.reduce(
//                               (sum, addon) => sum + addon.cost,
//                               0
//                             )}
//                         </span>
//                       </div>
//                       <div className="border-t pt-2">
//                         {addons.map((addon) => (
//                           <div
//                             key={addon._id}
//                             className="flex justify-between text-xs text-gray-500 mb-1"
//                           >
//                             <span>{addon.serviceName}</span>
//                             <span>₹{addon.cost}</span>
//                           </div>
//                         ))}
//                         {pendingAddons.map((addon) => (
//                           <div
//                             key={addon.id}
//                             className="flex justify-between text-xs text-yellow-600 mb-1"
//                           >
//                             <span>{addon.serviceName} (pending)</span>
//                             <span>₹{addon.cost}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </>
//                   )}

//                   <div className="border-t pt-2">
//                     <div className="flex justify-between font-semibold">
//                       <span className="text-sm text-gray-900">Total bill</span>
//                       <span className="text-sm text-gray-900">
//                         ₹{calculateTotalBill()}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="text-xs text-gray-500">
//                     {booking.nights} Night X ₹
//                     {Math.floor((booking.amount - 80) / booking.nights)}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payments */}
//             <div className="bg-white rounded-lg border border-gray-200">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Payments
//                   </h3>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">
//                       Payment collected
//                     </span>
//                     <span className="text-sm font-medium">
//                       ₹{booking.amountCollected}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-600">
//                       Balance to collect
//                     </span>
//                     <span className="text-sm font-medium text-red-600">
//                       ₹{booking.pendingamount}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingDetailModal;

import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, MoreVertical, Trash2 } from "lucide-react";
import { getAllMenus } from "@/api/Services/Hotel/hotel";
import {
  createAddon,
  deleteAddon,
  updateAddon,
} from "@/api/Services/Booking/booking";
import { printReceipt } from "@/hooks/printinvoice";

// Using inline button styling instead of external Button component
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

const BookingDetailModal = ({
  booking,
  onClose,
  handleStatusUpdate,
  loadBookings,
}) => {
  const [activeSection, setActiveSection] = useState("details");
  const [menuItems, setMenuItems] = useState([]);
  const [addons, setAddons] = useState(booking.addOns || []);
  const [showAddonForm, setShowAddonForm] = useState(false);
  const [pendingAddons, setPendingAddons] = useState([]);
  const [addonForm, setAddonForm] = useState({
    type: "penalty",
    serviceName: "",
    cost: 0,
    selectedMenu: "",
    quantity: 1,
    unitPrice: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load menu data from API
  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await getAllMenus();
        console.log("Menus loaded:", response);
        if (response.status) {
          setMenuItems(response.data);
        }
      } catch (error) {
        console.error("Failed to load menus:", error);
      }
    };

    loadMenus();
  }, []);

  const addonTypes = [
    { value: "penalty", label: "Penalty" },
    { value: "menu", label: "Menu" },
    { value: "extra_hour", label: "Extra Hour" },
    { value: "extra_day", label: "Extra Day" },
    { value: "laundry", label: "Laundry" },
    { value: "room_service", label: "Room Service" },
    { value: "spa", label: "Spa Services" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ];

  const handleAddonTypeChange = (type) => {
    setAddonForm({
      ...addonForm,
      type,
      serviceName: type === "menu" ? "" : type.replace("_", " "),
      cost: 0,
      selectedMenu: "",
      quantity: 1,
      unitPrice: 0,
    });
  };

  const handleMenuSelect = (menuId) => {
    const selectedMenuItem = menuItems.find((item) => item._id === menuId);
    if (selectedMenuItem) {
      const totalCost = selectedMenuItem.price * addonForm.quantity;
      setAddonForm({
        ...addonForm,
        selectedMenu: menuId,
        serviceName: selectedMenuItem.menuname,
        unitPrice: selectedMenuItem.price,
        cost: totalCost,
      });
    }
  };

  const handleQuantityChange = (quantity) => {
    const newQuantity = Math.max(1, parseInt(quantity) || 1);
    const totalCost = addonForm.unitPrice * newQuantity;
    setAddonForm({
      ...addonForm,
      quantity: newQuantity,
      cost: totalCost,
    });
  };

  const addToPendingList = () => {
    if (addonForm.serviceName && addonForm.cost > 0) {
      const newPendingAddon = {
        id: Date.now().toString(),
        type: addonForm.type,
        serviceName:
          addonForm.type === "menu"
            ? `${addonForm.serviceName} (x${addonForm.quantity})`
            : addonForm.serviceName,
        cost: addonForm.cost,
        selectedMenu: addonForm.selectedMenu,
        quantity: addonForm.quantity,
        unitPrice: addonForm.unitPrice,
      };

      setPendingAddons([...pendingAddons, newPendingAddon]);
      setAddonForm({
        type: "penalty",
        serviceName: "",
        cost: 0,
        selectedMenu: "",
        quantity: 1,
        unitPrice: 0,
      });
    }
  };

  const removePendingAddon = (id: any) => {
    setPendingAddons(pendingAddons.filter((addon) => addon.id !== id));
  };

  const uploadAllPendingAddons = async () => {
    if (pendingAddons.length === 0) return;

    setIsLoading(true);
    try {
      // Format addons according to the API payload structure
      const addOnsPayload = pendingAddons.map((addon) => ({
        serviceName: addon.serviceName,
        cost: addon.cost,
      }));

      // Create all addons in a single API call
      const payload: any = {
        status: "pending",
        addOns: addOnsPayload,
      };

      let res = await createAddon(booking.id, payload);
      if (res.status) {
        loadBookings();
        setPendingAddons([]);
        setShowAddonForm(false);
        onClose();
      }
    } catch (error) {
      console.error("Failed to upload addons:", error);
      alert("Failed to upload add-on services. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddon = async (addonIndex: any) => {
    setIsLoading(true);
    try {
      const payload: any = {
        index: addonIndex,
        status: "pending",
      };

      let res = await deleteAddon(booking.id, payload);
      if (res.status) {
        loadBookings();
        setPendingAddons([]);
        setShowAddonForm(false);
        onClose();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddon = async (addonIndex: any, updates: any) => {
    setIsLoading(true);
    try {
      const payload = {
        index: addonIndex,
        status: "pending",
        ...updates,
      };

      await updateAddon(booking.id, payload);

      // Update local state using index
      const newAddons = [...addons];
      newAddons[addonIndex] = { ...newAddons[addonIndex], ...updates };
      setAddons(newAddons);

      console.log("Addon updated successfully");
    } catch (error) {
      console.error("Failed to update addon:", error);
      alert("Failed to update add-on service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalBill = () => {
    const addonsTotal = addons.reduce((sum, addon) => sum + addon.cost, 0);
    const pendingTotal = pendingAddons.reduce(
      (sum, addon) => sum + addon.cost,
      0
    );
    return booking.amount + pendingTotal;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {booking.guestName} + {booking.guestCount - 1}
                </h2>
                <div className="flex items-center mt-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">
                    {booking.status === "upcoming"
                      ? "Upcoming"
                      : booking.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {booking.status === "upcoming" ? (
                <>
                  <Button
                    onClick={() =>
                      handleStatusUpdate?.(booking.id, "cancelled")
                    }
                    variant="outline"
                    className="bg-gray-900 text-gray hover:bg-gray-800 hover:text-white"
                    disabled={isLoading}
                  >
                    Cancel Booking
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate?.(booking.id, "checkin")}
                    variant="outline"
                    className="bg-gray-900 text-gray hover:bg-gray-800 hover:text-white"
                    disabled={
                      isLoading ||
                      booking.pendingamount > 0 ||
                      booking.roomno.length === 0
                    }
                  >
                    Check-in
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isLoading}
                    onClick={() => {}}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </>
              ) : booking.status === "in-house" ? (
                <>
                  <Button
                    onClick={() => handleStatusUpdate?.(booking.id, "checkout")}
                    variant="outline"
                    className="bg-gray-900 text-gray hover:bg-gray-800 hover:text-white"
                    disabled={isLoading || booking.pendingamount > 0}
                  >
                    Check-out
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isLoading}
                    onClick={() => {}}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => printReceipt(booking)}
                    variant="outline"
                    className="bg-gray-900 text-gray hover:bg-gray-800 hover:text-white"
                    disabled={isLoading}
                  >
                    Print Bill
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded font-medium">
                {booking.actualBookingId}
              </span>
              <span className="text-sm text-gray-500">{booking.source}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stay & Room Details */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Stay & Room Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Check-in</label>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {booking.checkIn}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Checkout</label>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {booking.checkOut}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Room Type</label>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {booking.roomType}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details - Updated with userInfo */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Guest details
                </h3>
              </div>

              <div className="space-y-4">
                {/* Primary guest info */}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.guestName}, + {booking.guestCount - 1}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.guestCount} Adults, {booking.childrencount}{" "}
                    Children
                  </p>
                </div>

                {/* User Info Details */}
                {booking.userifo && booking.userifo.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Guest Information
                    </h4>
                    <div className="space-y-3">
                      {booking.userifo &&
                        booking.userifo.map((user, index) => (
                          <div
                            key={user._id}
                            className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <span className="text-xs text-gray-500">
                                  Name:
                                </span>
                                <p className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">
                                  Phone:
                                </span>
                                <p className="text-sm text-gray-700">
                                  {user.phone}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">
                                  Email:
                                </span>
                                <p className="text-sm text-gray-700">
                                  {user.email}
                                </p>
                              </div>
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-xs text-gray-500">
                                    Age:
                                  </span>
                                  <p className="text-sm text-gray-700">
                                    {user.age}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">
                                    Gender:
                                  </span>
                                  <p className="text-sm text-gray-700 capitalize">
                                    {user.gender}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {booking.status === "completed" ||
          booking.status === "upcoming" ? null : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add-ons & Services
                  </h3>
                  <Button
                    onClick={() => setShowAddonForm(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                    Add Service
                  </Button>
                </div>

                {/* Addon Form */}
                {showAddonForm && (
                  <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Type
                        </label>
                        <select
                          value={addonForm.type}
                          onChange={(e) =>
                            handleAddonTypeChange(e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isLoading}
                        >
                          {addonTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {addonForm.type === "menu" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Menu Item
                          </label>
                          <select
                            value={addonForm.selectedMenu}
                            onChange={(e) => handleMenuSelect(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                          >
                            <option value="">Choose a menu item</option>
                            {menuItems &&
                              menuItems.map((item) => (
                                <option key={item._id} value={item._id}>
                                  {item.menuname} - ₹{item.price}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {addonForm.type === "menu" && addonForm.selectedMenu && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={addonForm.quantity}
                            onChange={(e) =>
                              handleQuantityChange(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter quantity"
                            disabled={isLoading}
                          />
                          <div className="mt-1 text-sm text-gray-500">
                            Unit Price: ₹{addonForm.unitPrice} ×{" "}
                            {addonForm.quantity} = ₹{addonForm.cost}
                          </div>
                        </div>
                      )}

                      {addonForm.type !== "menu" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Name
                          </label>
                          <input
                            type="text"
                            value={addonForm.serviceName}
                            onChange={(e) =>
                              setAddonForm({
                                ...addonForm,
                                serviceName: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter service name"
                            disabled={isLoading}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost (₹)
                        </label>
                        <input
                          type="number"
                          value={addonForm.cost}
                          onChange={(e) =>
                            setAddonForm({
                              ...addonForm,
                              cost: Number(e.target.value),
                            })
                          }
                          disabled={addonForm.type === "menu" || isLoading}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          placeholder="Enter cost"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={addToPendingList}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isLoading}
                        >
                          Add to List
                        </Button>
                        <Button
                          onClick={() => {
                            setShowAddonForm(false);
                            setPendingAddons([]);
                          }}
                          variant="outline"
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>

                    {/* Pending Addons List */}
                    {pendingAddons.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            Pending Services ({pendingAddons.length})
                          </h4>
                          <Button
                            onClick={uploadAllPendingAddons}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading}
                          >
                            {isLoading ? "Uploading..." : "Upload All"}
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {pendingAddons.map((addon) => (
                            <div
                              key={addon.id}
                              className="flex items-center justify-between p-2 bg-yellow-50 rounded border"
                            >
                              <div>
                                <span className="font-medium text-gray-900">
                                  {addon.serviceName}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  ₹{addon.cost}
                                </span>
                              </div>
                              <Button
                                onClick={() => removePendingAddon(addon.id)}
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
                      </div>
                    )}
                  </div>
                )}

                {/* Active Addons List - Updated to pass index instead of ID */}
                {addons.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Active Services
                    </h4>
                    {addons.map((addon, index) => (
                      <div
                        key={addon._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {addon.serviceName}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            ₹{addon.cost}
                          </span>
                          {addon.status && (
                            <span
                              className={`ml-2 text-xs px-2 py-1 rounded ${
                                addon.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : addon.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {addon.status}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {addon.status === "pending" && (
                            <Button
                              onClick={() =>
                                handleUpdateAddon(index, {
                                  status: "completed",
                                })
                              }
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              disabled={isLoading}
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteAddon(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No add-on services added yet
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Addons Section */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bill Summary */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bill summary
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Room charges</span>
                    <span className="text-sm font-medium">
                      ₹{booking.amountCollected}
                    </span>
                  </div>

                  {(addons.length > 0 || pendingAddons.length > 0) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Add-on services
                        </span>
                        <span className="text-sm font-medium">
                          ₹
                          {addons.reduce((sum, addon) => sum + addon.cost, 0) +
                            pendingAddons.reduce(
                              (sum, addon) => sum + addon.cost,
                              0
                            )}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        {addons.map((addon) => (
                          <div
                            key={addon._id}
                            className="flex justify-between text-xs text-gray-500 mb-1"
                          >
                            <span>{addon.serviceName}</span>
                            <span>₹{addon.cost}</span>
                          </div>
                        ))}
                        {pendingAddons.map((addon) => (
                          <div
                            key={addon.id}
                            className="flex justify-between text-xs text-yellow-600 mb-1"
                          >
                            <span>{addon.serviceName} (pending)</span>
                            <span>₹{addon.cost}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-sm text-gray-900">Total bill</span>
                      <span className="text-sm text-gray-900">
                        ₹{calculateTotalBill()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {booking.nights} Night X ₹
                    {Math.floor((booking.amount - 80) / booking.nights)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payments
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Payment collected
                    </span>
                    <span className="text-sm font-medium">
                      ₹{booking.amountCollected}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Balance to collect
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      ₹{booking.pendingamount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
