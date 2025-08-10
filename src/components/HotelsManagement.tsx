// import React, { useState, useEffect } from "react";
// import {
//   Building,
//   Plus,
//   MapPin,
//   Star,
//   Users,
//   Edit,
//   Trash2,
//   X,
//   Upload,
//   Camera,
//   Loader2,
//   Eye,
//   ZoomIn,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   createHotel,
//   deleteHotel,
//   getAllHotels,
//   updateHotel,
// } from "@/api/Services/Hotel/hotel";
// import { MultipleFileUpload } from "@/api/Services/File/doc";

// const HotelsManagement = () => {
//   const [hotels, setHotels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showImagePreview, setShowImagePreview] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [modalMode, setModalMode] = useState("create");
//   const [currentHotel, setCurrentHotel] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploadingFiles, setUploadingFiles] = useState(false);
//   const [formData, setFormData] = useState({
//     hotelName: "",
//     propertyType: "",
//     brand: "",
//     description: "",
//     starRating: 1,
//     languagesSpoken: [],
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     postalCode: "",
//     latitude: "",
//     longitude: "",
//     nearbyAttractions: [],
//     contactName: "",
//     email: "",
//     phone: "",
//     website: "",
//     facilities: [],
//     accessibilityFeatures: [],
//     images: { hotel: [], rooms: [], facilities: [] },
//     policies: {
//       checkIn: "3:00 PM",
//       checkOut: "11:00 AM",
//       cancellationPolicy: "",
//       smokingPolicy: "",
//       petPolicy: "",
//       ageRestriction: "",
//       childrenPolicy: "",
//     },
//     acceptedPaymentMethods: [],
//     currency: "INR",
//     taxDetails: { taxPercentage: 0, taxIncluded: false },
//     covidMeasures: [],
//     fireSafety: false,
//     firstAidKit: false,
//     security24h: false,
//   });

//   const steps = [
//     { title: "Basic Information", icon: Building },
//     { title: "Location & Contact", icon: MapPin },
//     { title: "Facilities & Images", icon: Camera },
//     { title: "Policies & Payment", icon: Star },
//   ];

//   const facilityOptions = [
//     "Pool",
//     "Gym",
//     "Spa",
//     "Free WiFi",
//     "Parking",
//     "Restaurant",
//     "Bar",
//     "Room Service",
//     "Laundry",
//     "Conference Room",
//   ];
//   const languageOptions = [
//     "English",
//     "Hindi",
//     "Spanish",
//     "French",
//     "German",
//     "Italian",
//     "Mandarin",
//     "Japanese",
//   ];
//   const paymentMethods = [
//     "Visa",
//     "MasterCard",
//     "American Express",
//     "PayPal",
//     "UPI",
//     "Cash",
//   ];
//   const covidMeasureOptions = [
//     "Enhanced cleaning",
//     "Social distancing",
//     "Hand sanitizer available",
//     "Temperature checks",
//     "Contactless check-in",
//   ];

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   const fetchHotels = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllHotels();
//       if (response.status) {
//         setHotels(response.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching hotels:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       hotelName: "",
//       propertyType: "",
//       brand: "",
//       description: "",
//       starRating: 1,
//       languagesSpoken: [],
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       postalCode: "",
//       latitude: "",
//       longitude: "",
//       nearbyAttractions: [],
//       contactName: "",
//       email: "",
//       phone: "",
//       website: "",
//       facilities: [],
//       accessibilityFeatures: [],
//       images: { hotel: [], rooms: [], facilities: [] },
//       policies: {
//         checkIn: "3:00 PM",
//         checkOut: "11:00 AM",
//         cancellationPolicy: "",
//         smokingPolicy: "",
//         petPolicy: "",
//         ageRestriction: "",
//         childrenPolicy: "",
//       },
//       acceptedPaymentMethods: [],
//       currency: "INR",
//       taxDetails: { taxPercentage: 0, taxIncluded: false },
//       covidMeasures: [],
//       fireSafety: false,
//       firstAidKit: false,
//       security24h: false,
//     });
//     setCurrentStep(1);
//   };

//   const openCreateModal = () => {
//     resetForm();
//     setModalMode("create");
//     setCurrentHotel(null);
//     setShowModal(true);
//   };

//   const openEditModal = (hotel) => {
//     setFormData({
//       hotelName: hotel.hotelName || "",
//       propertyType: hotel.propertyType || "",
//       brand: hotel.brand || "",
//       description: hotel.description || "",
//       starRating: hotel.starRating || 1,
//       languagesSpoken: hotel.languagesSpoken || [],
//       address: hotel.address || "",
//       city: hotel.city || "",
//       state: hotel.state || "",
//       country: hotel.country || "",
//       postalCode: hotel.postalCode || "",
//       latitude: hotel.latitude || "",
//       longitude: hotel.longitude || "",
//       nearbyAttractions: hotel.nearbyAttractions || [],
//       contactName: hotel.contactName || "",
//       email: hotel.email || "",
//       phone: hotel.phone || "",
//       website: hotel.website || "",
//       facilities: hotel.facilities || [],
//       accessibilityFeatures: hotel.accessibilityFeatures || [],
//       images: hotel.images || { hotel: [], rooms: [], facilities: [] },
//       policies: hotel.policies || {
//         checkIn: "3:00 PM",
//         checkOut: "11:00 AM",
//         cancellationPolicy: "",
//         smokingPolicy: "",
//         petPolicy: "",
//         ageRestriction: "",
//         childrenPolicy: "",
//       },
//       acceptedPaymentMethods: hotel.acceptedPaymentMethods || [],
//       currency: hotel.currency || "INR",
//       taxDetails: hotel.taxDetails || { taxPercentage: 0, taxIncluded: false },
//       covidMeasures: hotel.covidMeasures || [],
//       fireSafety: hotel.fireSafety || false,
//       firstAidKit: hotel.firstAidKit || false,
//       security24h: hotel.security24h || false,
//     });
//     setModalMode("edit");
//     setCurrentHotel(hotel);
//     setShowModal(true);
//   };

//   const handleDelete = async (hotelId) => {
//     if (window.confirm("Are you sure you want to delete this hotel?")) {
//       try {
//         await deleteHotel(hotelId);
//         fetchHotels();
//       } catch (error) {
//         console.error("Error deleting hotel:", error);
//         alert("Failed to delete hotel");
//       }
//     }
//   };

//   // Enhanced image preview function
//   const openImagePreview = (image, category) => {
//     setPreviewImage({ ...image, category });
//     setShowImagePreview(true);
//   };

//   const handleFileUpload = async (files, category) => {
//     try {
//       setUploadingFiles(true);
//       const uploadedFiles = await MultipleFileUpload(files);
//       console.log(uploadedFiles);

//       if (uploadedFiles.status) {
//         const newImages = uploadedFiles.data.map(
//           (url: any, index: string | number) => ({
//             url,
//             caption: files[index]?.name || `${category} image`,
//             uploadedAt: new Date().toISOString(),
//             ...(category === "rooms" && { roomType: "Standard" }),
//           })
//         );

//         setFormData((prev) => ({
//           ...prev,
//           images: {
//             ...prev.images,
//             [category]: [...prev.images[category], ...newImages],
//           },
//         }));
//       }
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       alert("Failed to upload files");
//     } finally {
//       setUploadingFiles(false);
//     }
//   };

//   const removeImage = (category, index) => {
//     if (window.confirm("Are you sure you want to remove this image?")) {
//       setFormData((prev) => ({
//         ...prev,
//         images: {
//           ...prev.images,
//           [category]: prev.images[category].filter((_, i) => i !== index),
//         },
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setSubmitting(true);

//       if (modalMode === "create") {
//         await createHotel(formData);
//       } else {
//         await updateHotel(currentHotel._id, formData);
//       }

//       setShowModal(false);
//       fetchHotels();
//       resetForm();
//     } catch (error) {
//       console.error("Error saving hotel:", error);
//       alert(`Failed to ${modalMode} hotel: ${error.message}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleArrayInput = (field, value) => {
//     const items = value
//       .split(",")
//       .map((item) => item.trim())
//       .filter(Boolean);
//     setFormData((prev) => ({ ...prev, [field]: items }));
//   };

//   const toggleArrayItem = (field, item) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].includes(item)
//         ? prev[field].filter((i) => i !== item)
//         : [...prev[field], item],
//     }));
//   };

//   // Enhanced image section component
//   const ImageSection = ({
//     title,
//     category,
//     images,
//     onUpload,
//     onRemove,
//     onPreview,
//   }) => (
//     <div className="space-y-3">
//       <Label className="text-base font-medium">{title}</Label>

//       {/* Upload Area */}
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={(e) => onUpload(Array.from(e.target.files), category)}
//           className="w-full"
//           id={`${category}-upload`}
//         />
//         <div className="text-center text-sm text-gray-500 mt-2">
//           <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//           Click to upload or drag and drop images
//         </div>
//       </div>

//       {/* Image Grid */}
//       {images.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {images.map((image, index) => (
//             <div key={index} className="relative group">
//               <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
//                 <img
//                   src={image.url}
//                   alt={image.caption || `${category} image`}
//                   className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
//                   onClick={() => onPreview(image, category)}
//                 />

//                 {/* Overlay with actions */}
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
//                   <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
//                     <Button
//                       size="sm"
//                       variant="secondary"
//                       className="h-8 w-8 p-0"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onPreview(image, category);
//                       }}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       className="h-8 w-8 p-0"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onRemove(category, index);
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* Image caption */}
//               <div className="mt-1 text-xs text-gray-600 truncate">
//                 {image.caption || `${category} image`}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {images.length === 0 && (
//         <div className="text-center py-8 text-gray-500">
//           <Camera className="h-12 w-12 mx-auto mb-2 text-gray-300" />
//           <p className="text-sm">No images uploaded yet</p>
//         </div>
//       )}
//     </div>
//   );

//   const renderStep1 = () => (
//     <div className="space-y-4">
//       <div>
//         <Label>Hotel Name *</Label>
//         <Input
//           value={formData.hotelName}
//           onChange={(e) =>
//             setFormData((prev) => ({ ...prev, hotelName: e.target.value }))
//           }
//           placeholder="Enter hotel name"
//         />
//       </div>
//       <div>
//         <Label>Property Type *</Label>
//         <Select
//           value={formData.propertyType}
//           onValueChange={(value) =>
//             setFormData((prev) => ({ ...prev, propertyType: value }))
//           }
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Select property type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Hotel">Hotel</SelectItem>
//             <SelectItem value="Resort">Resort</SelectItem>
//             <SelectItem value="Motel">Motel</SelectItem>
//             <SelectItem value="Boutique">Boutique</SelectItem>
//             <SelectItem value="Hostel">Hostel</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div>
//         <Label>Brand</Label>
//         <Input
//           value={formData.brand}
//           onChange={(e) =>
//             setFormData((prev) => ({ ...prev, brand: e.target.value }))
//           }
//           placeholder="Hotel brand"
//         />
//       </div>
//       <div>
//         <Label>Description</Label>
//         <Textarea
//           value={formData.description}
//           onChange={(e) =>
//             setFormData((prev) => ({ ...prev, description: e.target.value }))
//           }
//           placeholder="Hotel description"
//           rows={3}
//         />
//       </div>
//       <div>
//         <Label>Star Rating</Label>
//         <Select
//           value={formData.starRating.toString()}
//           onValueChange={(value) =>
//             setFormData((prev) => ({ ...prev, starRating: parseInt(value) }))
//           }
//         >
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             {[1, 2, 3, 4, 5].map((rating) => (
//               <SelectItem key={rating} value={rating.toString()}>
//                 {rating} Star
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div>
//         <Label>Languages Spoken</Label>
//         <div className="grid grid-cols-2 gap-2 mt-2">
//           {languageOptions.map((language) => (
//             <div key={language} className="flex items-center space-x-2">
//               <Checkbox
//                 checked={formData.languagesSpoken.includes(language)}
//                 onCheckedChange={() =>
//                   toggleArrayItem("languagesSpoken", language)
//                 }
//               />
//               <Label className="text-sm">{language}</Label>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="space-y-4">
//       <div>
//         <Label>Address *</Label>
//         <Input
//           value={formData.address}
//           onChange={(e) =>
//             setFormData((prev) => ({ ...prev, address: e.target.value }))
//           }
//           placeholder="Street address"
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>City *</Label>
//           <Input
//             value={formData.city}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, city: e.target.value }))
//             }
//             placeholder="City"
//           />
//         </div>
//         <div>
//           <Label>State *</Label>
//           <Input
//             value={formData.state}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, state: e.target.value }))
//             }
//             placeholder="State"
//           />
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>Country *</Label>
//           <Input
//             value={formData.country}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, country: e.target.value }))
//             }
//             placeholder="Country"
//           />
//         </div>
//         <div>
//           <Label>Postal Code</Label>
//           <Input
//             value={formData.postalCode}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, postalCode: e.target.value }))
//             }
//             placeholder="Postal code"
//           />
//         </div>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>Latitude</Label>
//           <Input
//             type="number"
//             value={formData.latitude}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, latitude: e.target.value }))
//             }
//             placeholder="Latitude"
//           />
//         </div>
//         <div>
//           <Label>Longitude</Label>
//           <Input
//             type="number"
//             value={formData.longitude}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, longitude: e.target.value }))
//             }
//             placeholder="Longitude"
//           />
//         </div>
//       </div>
//       <div>
//         <Label>Near by Attractions</Label>
//         <Input
//           value={formData.nearbyAttractions.join(", ")}
//           onChange={(e) =>
//             handleArrayInput("nearbyAttractions", e.target.value)
//           }
//           placeholder="Comma-separated attractions"
//         />
//       </div>
//       <div>
//         <Label>Contact Name</Label>
//         <Input
//           value={formData.contactName}
//           onChange={(e) =>
//             setFormData((prev) => ({ ...prev, contactName: e.target.value }))
//           }
//           placeholder="Contact person name"
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>Email</Label>
//           <Input
//             type="email"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, email: e.target.value }))
//             }
//             placeholder="Email"
//           />
//         </div>
//         <div>
//           <Label>Phone</Label>
//           <Input
//             value={formData.phone}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, phone: e.target.value }))
//             }
//             placeholder="Phone number"
//           />
//         </div>
//       </div>
//       <div>
//         <Label>Website</Label>
//         <Input
//           type="url"
//           value={formData.website}
//           onChange={(e) =>
//             setFormData((prev) => ({ ...prev, website: e.target.value }))
//           }
//           placeholder="Website URL"
//         />
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="space-y-6">
//       <div>
//         <Label>Facilities</Label>
//         <div className="grid grid-cols-2 gap-2 mt-2">
//           {facilityOptions.map((facility) => (
//             <div key={facility} className="flex items-center space-x-2">
//               <Checkbox
//                 checked={formData.facilities.includes(facility)}
//                 onCheckedChange={() => toggleArrayItem("facilities", facility)}
//               />
//               <Label className="text-sm">{facility}</Label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div>
//         <Label>Accessibility Features</Label>
//         <Input
//           value={formData.accessibilityFeatures.join(", ")}
//           onChange={(e) =>
//             handleArrayInput("accessibilityFeatures", e.target.value)
//           }
//           placeholder="Comma-separated accessibility features"
//         />
//       </div>

//       {/* Enhanced Image Sections */}
//       <ImageSection
//         title="Hotel Images"
//         category="hotel"
//         images={formData.images.hotel}
//         onUpload={handleFileUpload}
//         onRemove={removeImage}
//         onPreview={openImagePreview}
//       />

//       <ImageSection
//         title="Room Images"
//         category="rooms"
//         images={formData.images.rooms}
//         onUpload={handleFileUpload}
//         onRemove={removeImage}
//         onPreview={openImagePreview}
//       />

//       <ImageSection
//         title="Facility Images"
//         category="facilities"
//         images={formData.images.facilities}
//         onUpload={handleFileUpload}
//         onRemove={removeImage}
//         onPreview={openImagePreview}
//       />
//     </div>
//   );

//   const renderStep4 = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>Check-in Time</Label>
//           <Input
//             value={formData.policies.checkIn}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 policies: { ...prev.policies, checkIn: e.target.value },
//               }))
//             }
//             placeholder="3:00 PM"
//           />
//         </div>
//         <div>
//           <Label>Check-out Time</Label>
//           <Input
//             value={formData.policies.checkOut}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 policies: { ...prev.policies, checkOut: e.target.value },
//               }))
//             }
//             placeholder="11:00 AM"
//           />
//         </div>
//       </div>
//       <div>
//         <Label>Cancellation Policy</Label>
//         <Textarea
//           value={formData.policies.cancellationPolicy}
//           onChange={(e) =>
//             setFormData((prev) => ({
//               ...prev,
//               policies: {
//                 ...prev.policies,
//                 cancellationPolicy: e.target.value,
//               },
//             }))
//           }
//           placeholder="Cancellation policy details"
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label>Smoking Policy</Label>
//           <Select
//             value={formData.policies.smokingPolicy}
//             onValueChange={(value) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 policies: { ...prev.policies, smokingPolicy: value },
//               }))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select smoking policy" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Non-smoking property">
//                 Non-smoking property
//               </SelectItem>
//               <SelectItem value="Smoking allowed">Smoking allowed</SelectItem>
//               <SelectItem value="Designated smoking areas">
//                 Designated smoking areas
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Pet Policy</Label>
//           <Input
//             value={formData.policies.petPolicy}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 policies: { ...prev.policies, petPolicy: e.target.value },
//               }))
//             }
//             placeholder="Pet policy"
//           />
//         </div>
//       </div>
//       <div>
//         <Label>Accepted Payment Methods</Label>
//         <div className="grid grid-cols-3 gap-2 mt-2">
//           {paymentMethods.map((method) => (
//             <div key={method} className="flex items-center space-x-2">
//               <Checkbox
//                 checked={formData.acceptedPaymentMethods.includes(method)}
//                 onCheckedChange={() =>
//                   toggleArrayItem("acceptedPaymentMethods", method)
//                 }
//               />
//               <Label className="text-sm">{method}</Label>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="grid grid-cols-3 gap-4">
//         <div>
//           <Label>Currency</Label>
//           <Select
//             value={formData.currency}
//             onValueChange={(value) =>
//               setFormData((prev) => ({ ...prev, currency: value }))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="INR">INR</SelectItem>
//               <SelectItem value="USD">USD</SelectItem>
//               <SelectItem value="EUR">EUR</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Tax Percentage</Label>
//           <Input
//             type="number"
//             value={formData.taxDetails.taxPercentage}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 taxDetails: {
//                   ...prev.taxDetails,
//                   taxPercentage: parseFloat(e.target.value) || 0,
//                 },
//               }))
//             }
//             placeholder="0"
//           />
//         </div>
//         <div>
//           <div className="flex items-center space-x-2 mt-6">
//             <Checkbox
//               checked={formData.taxDetails.taxIncluded}
//               onCheckedChange={(checked) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   taxDetails: {
//                     ...prev.taxDetails,
//                     taxIncluded: Boolean(checked),
//                   },
//                 }))
//               }
//             />
//             <Label>Tax Included</Label>
//           </div>
//         </div>
//       </div>
//       <div>
//         <Label>COVID Measures</Label>
//         <div className="grid grid-cols-2 gap-2 mt-2">
//           {covidMeasureOptions.map((measure) => (
//             <div key={measure} className="flex items-center space-x-2">
//               <Checkbox
//                 checked={formData.covidMeasures.includes(measure)}
//                 onCheckedChange={() =>
//                   toggleArrayItem("covidMeasures", measure)
//                 }
//               />
//               <Label className="text-sm">{measure}</Label>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div>
//         <Label>Safety Features</Label>
//         <div className="space-y-2 mt-2">
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               checked={formData.fireSafety}
//               onCheckedChange={(checked) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   fireSafety: Boolean(checked),
//                 }))
//               }
//             />
//             <Label>Fire Safety</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               checked={formData.firstAidKit}
//               onCheckedChange={(checked) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   firstAidKit: Boolean(checked),
//                 }))
//               }
//             />
//             <Label>First Aid Kit</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               checked={formData.security24h}
//               onCheckedChange={(checked) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   security24h: Boolean(checked),
//                 }))
//               }
//             />
//             <Label>24h Security</Label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading hotels...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 bg-gray-50">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Hotels Management</h1>
//         <p className="text-gray-600">
//           Manage your hotel properties and locations
//         </p>
//       </div>

//       {/* Header Actions */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex space-x-4"></div>
//         <Button onClick={openCreateModal}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Hotel
//         </Button>
//       </div>

//       {/* Hotels Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
//             <Building className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{hotels.length}</div>
//             <p className="text-xs text-muted-foreground">
//               Registered properties
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Hotels</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {hotels.filter((h) => h.status !== "inactive").length}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Currently operational
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Countries</CardTitle>
//             <MapPin className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {new Set(hotels.map((h) => h.country).filter(Boolean)).size}
//             </div>
//             <p className="text-xs text-muted-foreground">Different countries</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Average Rating
//             </CardTitle>
//             <Star className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {hotels.length > 0
//                 ? (
//                     hotels.reduce(
//                       (sum, hotel) => sum + (hotel.starRating || 0),
//                       0
//                     ) / hotels.length
//                   ).toFixed(1)
//                 : "0.0"}
//             </div>
//             <p className="text-xs text-muted-foreground">Stars average</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Hotels Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {hotels.map((hotel) => (
//           <Card key={hotel._id} className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="text-lg">{hotel.hotelName}</CardTitle>
//                   <CardDescription className="flex items-center mt-1">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     {hotel.city}, {hotel.country}
//                   </CardDescription>
//                 </div>
//                 <div className="flex items-center">
//                   {[...Array(hotel.starRating || 1)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="h-4 w-4 fill-yellow-400 text-yellow-400"
//                     />
//                   ))}
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {/* Hotel Image Preview */}
//               {hotel.images?.hotel?.length > 0 && (
//                 <div className="mb-4">
//                   <img
//                     src={hotel.images.hotel[0].url}
//                     alt={hotel.hotelName}
//                     className="w-full h-32 object-cover rounded-md cursor-pointer"
//                     onClick={() =>
//                       openImagePreview(hotel.images.hotel[0], "hotel")
//                     }
//                   />
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Building className="h-4 w-4 mr-2" />
//                   {hotel.propertyType || "Hotel"}
//                 </div>

//                 {hotel.facilities && hotel.facilities.length > 0 && (
//                   <div className="flex flex-wrap gap-1">
//                     {hotel.facilities.slice(0, 3).map((facility, index) => (
//                       <Badge
//                         key={index}
//                         variant="secondary"
//                         className="text-xs"
//                       >
//                         {facility}
//                       </Badge>
//                     ))}
//                     {hotel.facilities.length > 3 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{hotel.facilities.length - 3} more
//                       </Badge>
//                     )}
//                   </div>
//                 )}

//                 {hotel.description && (
//                   <p className="text-sm text-gray-600 line-clamp-2">
//                     {hotel.description}
//                   </p>
//                 )}

//                 <div className="flex justify-between items-center pt-2">
//                   <div className="text-sm text-gray-500">
//                     {hotel.email && (
//                       <span className="block">{hotel.email}</span>
//                     )}
//                     {hotel.phone && (
//                       <span className="block">{hotel.phone}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <div className="px-6 pb-4">
//               <div className="flex justify-end space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => openEditModal(hotel)}
//                 >
//                   <Edit className="h-4 w-4 mr-1" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => handleDelete(hotel._id)}
//                 >
//                   <Trash2 className="h-4 w-4 mr-1" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Empty State */}
//       {hotels.length === 0 && (
//         <Card className="text-center py-12">
//           <CardContent>
//             <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No hotels found
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Get started by adding your first hotel property.
//             </p>
//             <Button onClick={openCreateModal}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Hotel
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {/* Modal */}
//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>
//               {modalMode === "create" ? "Add New Hotel" : "Edit Hotel"}
//             </DialogTitle>
//           </DialogHeader>

//           {/* Step Navigation */}
//           <div className="flex items-center justify-between mb-6">
//             {steps.map((step, index) => {
//               const StepIcon = step.icon;
//               const stepNumber = index + 1;
//               const isActive = currentStep === stepNumber;
//               const isCompleted = currentStep > stepNumber;

//               return (
//                 <div
//                   key={stepNumber}
//                   className={`flex items-center ${
//                     index !== steps.length - 1 ? "flex-1" : ""
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <div
//                       className={`
//                       flex items-center justify-center w-8 h-8 rounded-full border-2
//                       ${
//                         isActive
//                           ? "bg-blue-500 border-blue-500 text-white"
//                           : isCompleted
//                           ? "bg-green-500 border-green-500 text-white"
//                           : "border-gray-300 text-gray-500"
//                       }
//                     `}
//                     >
//                       {isCompleted ? (
//                         <span className="text-sm">✓</span>
//                       ) : (
//                         <StepIcon className="h-4 w-4" />
//                       )}
//                     </div>
//                     <span
//                       className={`ml-2 text-sm font-medium ${
//                         isActive
//                           ? "text-blue-600"
//                           : isCompleted
//                           ? "text-green-600"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       {step.title}
//                     </span>
//                   </div>
//                   {index !== steps.length - 1 && (
//                     <div
//                       className={`flex-1 h-px mx-4 ${
//                         isCompleted ? "bg-green-300" : "bg-gray-300"
//                       }`}
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Step Content */}
//           <div className="mb-6">
//             {currentStep === 1 && renderStep1()}
//             {currentStep === 2 && renderStep2()}
//             {currentStep === 3 && renderStep3()}
//             {currentStep === 4 && renderStep4()}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between">
//             <Button
//               variant="outline"
//               onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//               disabled={currentStep === 1}
//             >
//               Previous
//             </Button>

//             <div className="flex space-x-2">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowModal(false);
//                   resetForm();
//                 }}
//                 disabled={submitting}
//               >
//                 Cancel
//               </Button>

//               {currentStep < 4 ? (
//                 <Button
//                   onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
//                 >
//                   Next
//                 </Button>
//               ) : (
//                 <Button onClick={handleSubmit} disabled={submitting}>
//                   {submitting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       {modalMode === "create" ? "Creating..." : "Updating..."}
//                     </>
//                   ) : modalMode === "create" ? (
//                     "Create Hotel"
//                   ) : (
//                     "Update Hotel"
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Image Preview Modal */}
//       <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
//         <DialogContent className="max-w-4xl max-h-[90vh] p-0">
//           <DialogHeader className="p-6 pb-2">
//             <div className="flex items-center justify-between">
//               <DialogTitle className="flex items-center">
//                 <ZoomIn className="h-5 w-5 mr-2" />
//                 {previewImage?.category} Image Preview
//               </DialogTitle>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowImagePreview(false)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </DialogHeader>

//           {previewImage && (
//             <div className="p-6 pt-2">
//               <div className="bg-gray-100 rounded-lg p-4">
//                 <img
//                   src={previewImage.url}
//                   alt={previewImage.caption || "Preview"}
//                   className="w-full h-auto max-h-[60vh] object-contain mx-auto"
//                 />
//               </div>

//               <div className="mt-4 space-y-2">
//                 <h4 className="font-medium text-gray-900">Image Details</h4>
//                 <div className="text-sm text-gray-600 space-y-1">
//                   <p>
//                     <strong>Caption:</strong>{" "}
//                     {previewImage.caption || "No caption"}
//                   </p>
//                   <p>
//                     <strong>Category:</strong> {previewImage.category}
//                   </p>
//                   {previewImage.roomType && (
//                     <p>
//                       <strong>Room Type:</strong> {previewImage.roomType}
//                     </p>
//                   )}
//                   {previewImage.uploadedAt && (
//                     <p>
//                       <strong>Uploaded:</strong>{" "}
//                       {new Date(previewImage.uploadedAt).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Upload Progress */}
//       {uploadingFiles && (
//         <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border">
//           <div className="flex items-center space-x-3">
//             <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
//             <span className="text-sm font-medium">Uploading images...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HotelsManagement;

import React, { useState, useEffect } from "react";
import {
  Building,
  Plus,
  MapPin,
  Star,
  Users,
  Edit,
  Trash2,
  X,
  Upload,
  Camera,
  Loader2,
  Eye,
  ZoomIn,
  FileText,
  Power,
  PowerOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createHotel,
  deleteHotel,
  getAllHotels,
  getCompanyHotels,
  updateHotel,
} from "@/api/Services/Hotel/hotel";
import { MultipleFileUpload } from "@/api/Services/File/doc";

const HotelsManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [currentHotel, setCurrentHotel] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    propertyType: "",
    brand: "",
    description: "",
    starRating: 1,
    languagesSpoken: [],
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    nearbyAttractions: [],
    contactName: "",
    email: "",
    phone: "",
    website: "",
    facilities: [],
    accessibilityFeatures: [],
    images: { hotel: [], rooms: [], facilities: [], document: [] },
    policies: {
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellationPolicy: "",
      smokingPolicy: "",
      petPolicy: "",
      ageRestriction: "",
      childrenPolicy: "",
    },
    acceptedPaymentMethods: [],
    currency: "INR",
    taxDetails: { taxPercentage: 0, taxIncluded: false },
    covidMeasures: [],
    fireSafety: false,
    firstAidKit: false,
    security24h: false,
    isactive: true,
  });

  // Updated steps to include Preview
  const steps = [
    { title: "Basic Information", icon: Building },
    { title: "Location & Contact", icon: MapPin },
    { title: "Facilities & Files", icon: Camera },
    { title: "Policies & Payment", icon: Star },
    { title: "Preview", icon: Eye },
  ];

  const facilityOptions = [
    "Pool",
    "Gym",
    "Spa",
    "Free WiFi",
    "Parking",
    "Restaurant",
    "Bar",
    "Room Service",
    "Laundry",
    "Conference Room",
  ];
  const languageOptions = [
  "Hindi",
  "English",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Odia",
  "Punjabi",
  "Assamese",
  "Urdu",
  "Konkani",
  "Manipuri",
  "Sanskrit",
];

  const paymentMethods = [
    "Cash",
    "GooglePay",
    "PhonePe",
    "Card",
    "UPI",
    "NetBanking",
    "Paytm",
    "Cheque"
  ];
  const covidMeasureOptions = [
    "Enhanced cleaning",
    "Social distancing",
    "Hand sanitizer available",
    "Temperature checks",
    "Contactless check-in",
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await getCompanyHotels();
      if (response.status) {
        setHotels(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHotelStatus = async (hotelId, currentStatus) => {
    try {
      const updatedData = { isactive: !currentStatus };
      await updateHotel(hotelId, updatedData);
      fetchHotels();
    } catch (error) {
      console.error("Error updating hotel status:", error);
      alert("Failed to update hotel status");
    }
  };

  const resetForm = () => {
    setFormData({
      hotelName: "",
      propertyType: "",
      brand: "",
      description: "",
      starRating: 1,
      languagesSpoken: [],
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      latitude: "",
      longitude: "",
      nearbyAttractions: [],
      contactName: "",
      email: "",
      phone: "",
      website: "",
      facilities: [],
      accessibilityFeatures: [],
      images: { hotel: [], rooms: [], facilities: [], document: [] },
      policies: {
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        cancellationPolicy: "",
        smokingPolicy: "",
        petPolicy: "",
        ageRestriction: "",
        childrenPolicy: "",
      },
      acceptedPaymentMethods: [],
      currency: "INR",
      taxDetails: { taxPercentage: 0, taxIncluded: false },
      covidMeasures: [],
      fireSafety: false,
      firstAidKit: false,
      security24h: false,
      isactive: true,
    });
    setCurrentStep(1);
  };

  const openCreateModal = () => {
    resetForm();
    setModalMode("create");
    setCurrentHotel(null);
    setShowModal(true);
  };

  const openEditModal = (hotel) => {
    setFormData({
      hotelName: hotel.hotelName || "",
      propertyType: hotel.propertyType || "",
      brand: hotel.brand || "",
      description: hotel.description || "",
      starRating: hotel.starRating || 1,
      languagesSpoken: hotel.languagesSpoken || [],
      address: hotel.address || "",
      city: hotel.city || "",
      state: hotel.state || "",
      country: hotel.country || "",
      postalCode: hotel.postalCode || "",
      latitude: hotel.latitude || "",
      longitude: hotel.longitude || "",
      nearbyAttractions: hotel.nearbyAttractions || [],
      contactName: hotel.contactName || "",
      email: hotel.email || "",
      phone: hotel.phone || "",
      website: hotel.website || "",
      facilities: hotel.facilities || [],
      accessibilityFeatures: hotel.accessibilityFeatures || [],
      images: hotel.images || {
        hotel: [],
        rooms: [],
        facilities: [],
        document: [],
      },
      policies: hotel.policies || {
        checkIn: "3:00 PM",
        checkOut: "11:00 AM",
        cancellationPolicy: "",
        smokingPolicy: "",
        petPolicy: "",
        ageRestriction: "",
        childrenPolicy: "",
      },
      acceptedPaymentMethods: hotel.acceptedPaymentMethods || [],
      currency: hotel.currency || "INR",
      taxDetails: hotel.taxDetails || { taxPercentage: 0, taxIncluded: false },
      covidMeasures: hotel.covidMeasures || [],
      fireSafety: hotel.fireSafety || false,
      firstAidKit: hotel.firstAidKit || false,
      security24h: hotel.security24h || false,
      isactive: hotel.isactive !== undefined ? hotel.isactive : true,
    });
    setModalMode("edit");
    setCurrentHotel(hotel);
    setShowModal(true);
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await deleteHotel(hotelId);
        fetchHotels();
      } catch (error) {
        console.error("Error deleting hotel:", error);
        alert("Failed to delete hotel");
      }
    }
  };

  const openImagePreview = (image, category) => {
    setPreviewImage({ ...image, category });
    setShowImagePreview(true);
  };

  const handleFileUpload = async (files, category) => {
    try {
      setUploadingFiles(true);
      const uploadedFiles = await MultipleFileUpload(files);
      

      if (uploadedFiles.status) {
        const newImages = uploadedFiles.data.map((url, index) => ({
          url,
          caption: files[index]?.name || `${category} file`,
          uploadedAt: new Date().toISOString(),
          ...(category === "rooms" && { roomType: "Standard" }),
        }));

        setFormData((prev) => ({
          ...prev,
          images: {
            ...prev.images,
            [category]: [...prev.images[category], ...newImages],
          },
        }));
      }else{
         alert(uploadedFiles.message);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files");
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeImage = (category, index) => {
    if (window.confirm("Are you sure you want to remove this file?")) {
      setFormData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [category]: prev.images[category].filter((_, i) => i !== index),
        },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (modalMode === "create") {
        await createHotel(formData);
      } else {
        await updateHotel(currentHotel._id, formData);
      }

      setShowModal(false);
      fetchHotels();
      resetForm();
    } catch (error) {
      console.error("Error saving hotel:", error);
      alert(`Failed to ${modalMode} hotel: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  // Enhanced File Section Component
  const FileSection = ({
    title,
    category,
    files,
    onUpload,
    onRemove,
    onPreview,
    acceptType = "image/*",
    isDocument = false,
  }) => (
    <div className="space-y-3">
      <Label className="text-base font-medium">{title}</Label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
        <input
          type="file"
          multiple
          accept={acceptType}
          onChange={(e) => onUpload(Array.from(e.target.files), category)}
          className="w-full"
          id={`${category}-upload`}
        />
        <div className="text-center text-sm text-gray-500 mt-2">
          {isDocument ? (
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          ) : (
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          )}
          Click to upload or drag and drop {isDocument ? "documents" : "images"}
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {isDocument ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <FileText  className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-xs text-center px-2 truncate">
                      {file.caption}
                    </span>
                  </div>
                ) : (
                  <img
                    src={file.url}
                    alt={file.caption || `${category} image`}
                    className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                    onClick={() => onPreview(file, category)}
                  />
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreview(file, category);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(category, index);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-1 text-xs text-gray-600 truncate">
                {file.caption || `${category} file`}
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {isDocument ? (
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          ) : (
            <Camera className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          )}
          <p className="text-sm">
            No {isDocument ? "documents" : "images"} uploaded yet
          </p>
        </div>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label>Hotel Name *</Label>
        <Input
          value={formData.hotelName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, hotelName: e.target.value }))
          }
          placeholder="Enter hotel name"
        />
      </div>
      <div>
        <Label>Property Type *</Label>
        <Select
          value={formData.propertyType}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, propertyType: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Hotel">Hotel</SelectItem>
            <SelectItem value="Resort">Resort</SelectItem>
            <SelectItem value="Motel">Motel</SelectItem>
            <SelectItem value="Boutique">Boutique</SelectItem>
            <SelectItem value="Hostel">Hostel</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Brand</Label>
        <Input
          value={formData.brand}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, brand: e.target.value }))
          }
          placeholder="Hotel brand"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Hotel description"
          rows={3}
        />
      </div>
      <div>
        <Label>Star Rating</Label>
        <Select
          value={formData.starRating.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, starRating: parseInt(value) }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Languages Spoken</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {languageOptions.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.languagesSpoken.includes(language)}
                onCheckedChange={() =>
                  toggleArrayItem("languagesSpoken", language)
                }
              />
              <Label className="text-sm">{language}</Label>
            </div>
          ))}
        </div>
      </div>
      {/* IsActive Option */}
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={formData.isactive}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({
              ...prev,
              isactive: Boolean(checked),
            }))
          }
        />
        <Label>Hotel is Active</Label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label>Address *</Label>
        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          placeholder="Street address"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>City *</Label>
          <Input
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
            placeholder="City"
          />
        </div>
        <div>
          <Label>State *</Label>
          <Input
            value={formData.state}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, state: e.target.value }))
            }
            placeholder="State"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Country *</Label>
          <Input
            value={formData.country}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, country: e.target.value }))
            }
            placeholder="Country"
          />
        </div>
        <div>
          <Label>Postal Code</Label>
          <Input
            value={formData.postalCode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, postalCode: e.target.value }))
            }
            placeholder="Postal code"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            value={formData.latitude}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, latitude: e.target.value }))
            }
            placeholder="Latitude"
          />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            value={formData.longitude}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, longitude: e.target.value }))
            }
            placeholder="Longitude"
          />
        </div>
      </div>
      <div>
        <Label>Near by Attractions</Label>
        <Input
        type="text"
          value={formData.nearbyAttractions.join(", ")}
          onChange={(e) =>
            handleArrayInput("nearbyAttractions", e.target.value)
          }
          placeholder="Comma-separated attractions"
        />
      </div>
      <div>
        <Label>Contact Name</Label>
        <Input
          value={formData.contactName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, contactName: e.target.value }))
          }
          placeholder="Contact person name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Phone number"
          />
        </div>
      </div>
      <div>
        <Label>Website</Label>
        <Input
          type="url"
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
          placeholder="Website URL"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label>Facilities</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {facilityOptions.map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.facilities.includes(facility)}
                onCheckedChange={() => toggleArrayItem("facilities", facility)}
              />
              <Label className="text-sm">{facility}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Accessibility Features</Label>
        <Input
          value={formData.accessibilityFeatures.join(", ")}
          onChange={(e) =>
            handleArrayInput("accessibilityFeatures", e.target.value)
          }
          placeholder="Comma-separated accessibility features"
        />
      </div>

      {/* File Upload Sections */}
      <FileSection
        title="Hotel Images"
        category="hotel"
        files={formData.images.hotel}
        onUpload={handleFileUpload}
        onRemove={removeImage}
        onPreview={openImagePreview}
        acceptType="image/*"
      />

      <FileSection
        title="Room Images"
        category="rooms"
        files={formData.images.rooms}
        onUpload={handleFileUpload}
        onRemove={removeImage}
        onPreview={openImagePreview}
        acceptType="image/*"
      />

      <FileSection
        title="Facility Images"
        category="facilities"
        files={formData.images.facilities}
        onUpload={handleFileUpload}
        onRemove={removeImage}
        onPreview={openImagePreview}
        acceptType="image/*"
      />

      {/* Documents Section */}
      <FileSection
        title="Documents"
        category="document"
        files={formData.images.document}
        onUpload={handleFileUpload}
        onRemove={removeImage}
        onPreview={openImagePreview}
        acceptType=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        isDocument={true}
      />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Check-in Time</Label>
          <Input
            value={formData.policies.checkIn}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                policies: { ...prev.policies, checkIn: e.target.value },
              }))
            }
            placeholder="3:00 PM"
          />
        </div>
        <div>
          <Label>Check-out Time</Label>
          <Input
            value={formData.policies.checkOut}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                policies: { ...prev.policies, checkOut: e.target.value },
              }))
            }
            placeholder="11:00 AM"
          />
        </div>
      </div>
      <div>
        <Label>Cancellation Policy</Label>
        <Textarea
          value={formData.policies.cancellationPolicy}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              policies: {
                ...prev.policies,
                cancellationPolicy: e.target.value,
              },
            }))
          }
          placeholder="Cancellation policy details"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Smoking Policy</Label>
          <Select
            value={formData.policies.smokingPolicy}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                policies: { ...prev.policies, smokingPolicy: value },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select smoking policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Non-smoking property">
                Non-smoking property
              </SelectItem>
              <SelectItem value="Smoking allowed">Smoking allowed</SelectItem>
              <SelectItem value="Designated smoking areas">
                Designated smoking areas
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Pet Policy</Label>
          <Input
            value={formData.policies.petPolicy}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                policies: { ...prev.policies, petPolicy: e.target.value },
              }))
            }
            placeholder="Pet policy"
          />
        </div>
      </div>
      <div>
        <Label>Accepted Payment Methods</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {paymentMethods.map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.acceptedPaymentMethods.includes(method)}
                onCheckedChange={() =>
                  toggleArrayItem("acceptedPaymentMethods", method)
                }
              />
              <Label className="text-sm">{method}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, currency: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tax Percentage</Label>
          <Input
            type="number"
            value={formData.taxDetails.taxPercentage}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                taxDetails: {
                  ...prev.taxDetails,
                  taxPercentage: parseFloat(e.target.value) || 0,
                },
              }))
            }
            placeholder="0"
          />
        </div>
        <div>
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              checked={formData.taxDetails.taxIncluded}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  taxDetails: {
                    ...prev.taxDetails,
                    taxIncluded: Boolean(checked),
                  },
                }))
              }
            />
            <Label>Tax Included</Label>
          </div>
        </div>
      </div>
      <div>
        <Label>COVID Measures</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {covidMeasureOptions.map((measure) => (
            <div key={measure} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.covidMeasures.includes(measure)}
                onCheckedChange={() =>
                  toggleArrayItem("covidMeasures", measure)
                }
              />
              <Label className="text-sm">{measure}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Safety Features</Label>
        <div className="space-y-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.fireSafety}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  fireSafety: Boolean(checked),
                }))
              }
            />
            <Label>Fire Safety</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.firstAidKit}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  firstAidKit: Boolean(checked),
                }))
              }
            />
            <Label>First Aid Kit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.security24h}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  security24h: Boolean(checked),
                }))
              }
            />
            <Label>24h Security</Label>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 5 - Preview
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Preview Hotel Information
        </h3>
        <p className="text-gray-600">Review all details before saving</p>
      </div>

      {/* Basic Information Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Building className="h-4 w-4 mr-2" />
          Basic Information
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Hotel Name:</strong> {formData.hotelName || "Not specified"}
          </div>
          <div>
            <strong>Property Type:</strong>{" "}
            {formData.propertyType || "Not specified"}
          </div>
          <div>
            <strong>Brand:</strong> {formData.brand || "Not specified"}
          </div>
          <div>
            <strong>Star Rating:</strong> {formData.starRating} Star
          </div>
          <div>
            <strong>Status:</strong> {formData.isactive ? "Active" : "Inactive"}
          </div>
          <div>
            <strong>Languages:</strong>{" "}
            {formData.languagesSpoken.join(", ") || "None selected"}
          </div>
        </div>
        {formData.description && (
          <div className="mt-3">
            <strong>Description:</strong>
            <p className="text-gray-600 mt-1">{formData.description}</p>
          </div>
        )}
      </div>

      {/* Location & Contact Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Location & Contact
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Address:</strong> {formData.address || "Not specified"}
          </div>
          <div>
            <strong>City:</strong> {formData.city || "Not specified"}
          </div>
          <div>
            <strong>State:</strong> {formData.state || "Not specified"}
          </div>
          <div>
            <strong>Country:</strong> {formData.country || "Not specified"}
          </div>
          <div>
            <strong>Contact Name:</strong>{" "}
            {formData.contactName || "Not specified"}
          </div>
          <div>
            <strong>Email:</strong> {formData.email || "Not specified"}
          </div>
          <div>
            <strong>Phone:</strong> {formData.phone || "Not specified"}
          </div>
          <div>
            <strong>Website:</strong> {formData.website || "Not specified"}
          </div>
        </div>
      </div>

      {/* Facilities & Files Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Camera className="h-4 w-4 mr-2" />
          Facilities & Files
        </h4>
        <div className="space-y-3">
          <div>
            <strong>Facilities:</strong>{" "}
            {formData.facilities.join(", ") || "None selected"}
          </div>
          <div>
            <strong>Accessibility:</strong>{" "}
            {formData.accessibilityFeatures.join(", ") || "None specified"}
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Hotel Images:</strong> {formData.images.hotel.length}{" "}
              files
            </div>
            <div>
              <strong>Room Images:</strong> {formData.images.rooms.length} files
            </div>
            <div>
              <strong>Facility Images:</strong>{" "}
              {formData.images.facilities.length} files
            </div>
            <div>
              <strong>Documents:</strong> {formData.images.document.length}{" "}
              files
            </div>
          </div>
        </div>
      </div>

      {/* Policies & Payment Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2" />
          Policies & Payment
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Check-in:</strong> {formData.policies.checkIn}
          </div>
          <div>
            <strong>Check-out:</strong> {formData.policies.checkOut}
          </div>
          <div>
            <strong>Currency:</strong> {formData.currency}
          </div>
          <div>
            <strong>Tax:</strong> {formData.taxDetails.taxPercentage}%{" "}
            {formData.taxDetails.taxIncluded ? "(Included)" : "(Excluded)"}
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <div>
            <strong>Payment Methods:</strong>{" "}
            {formData.acceptedPaymentMethods.join(", ") || "None selected"}
          </div>
          <div>
            <strong>COVID Measures:</strong>{" "}
            {formData.covidMeasures.join(", ") || "None selected"}
          </div>
          <div>
            <strong>Safety Features:</strong>
            {[
              formData.fireSafety && "Fire Safety",
              formData.firstAidKit && "First Aid Kit",
              formData.security24h && "24h Security",
            ]
              .filter(Boolean)
              .join(", ") || "None selected"}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hotels Management</h1>
        <p className="text-gray-600">
          Manage your hotel properties and locations
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4"></div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      {/* Hotels Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotels.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered properties
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hotels</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotels.filter((h) => h.isactive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(hotels.map((h) => h.country).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">Different countries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotels.length > 0
                ? (
                    hotels.reduce(
                      (sum, hotel) => sum + (hotel.starRating || 0),
                      0
                    ) / hotels.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Stars average</p>
          </CardContent>
        </Card>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{hotel.hotelName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hotel.city}, {hotel.country}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(hotel.starRating || 1)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <Button
                    variant={hotel.isactive ? "default" : "secondary"}
                    size="sm"
                    onClick={() => toggleHotelStatus(hotel._id, hotel.isactive)}
                    className={`h-8 px-2 ${
                      hotel.isactive
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {hotel.isactive ? (
                      <>
                        <Power className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <PowerOff className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Hotel Image Preview */}
              {hotel.images?.hotel?.length > 0 && (
                <div className="mb-4">
                  <img
                    src={hotel.images.hotel[0].url}
                    alt={hotel.hotelName}
                    className="w-full h-32 object-cover rounded-md cursor-pointer"
                    onClick={() =>
                      openImagePreview(hotel.images.hotel[0], "hotel")
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  {hotel.propertyType || "Hotel"}
                </div>

                {hotel.facilities && hotel.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hotel.facilities.slice(0, 3).map((facility, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {facility}
                      </Badge>
                    ))}
                    {hotel.facilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.facilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {hotel.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {hotel.description}
                  </p>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm text-gray-500">
                    {hotel.email && (
                      <span className="block">{hotel.email}</span>
                    )}
                    {hotel.phone && (
                      <span className="block">{hotel.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 pb-4">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(hotel)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(hotel._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {hotels.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hotels found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first hotel property.
            </p>
            <Button onClick={openCreateModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "create" ? "Add New Hotel" : "Edit Hotel"}
            </DialogTitle>
          </DialogHeader>

          {/* Step Navigation */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;

              return (
                <div
                  key={stepNumber}
                  className={`flex items-center ${
                    index !== steps.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 
                      ${
                        isActive
                          ? "bg-blue-500 border-blue-500 text-white"
                          : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 text-gray-500"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <span className="text-sm">✓</span>
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-4 ${
                        isCompleted ? "bg-green-300" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="mb-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {/* Enhanced Upload Progress with Details */}
            {uploadingFiles && (
              <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg border border-gray-200 overflow-hidden z-50 min-w-[320px]">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">
                        Uploading Files
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white text-xs"
                    >
                      Processing...
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-blue-600 font-medium">
                        Uploading to server
                      </span>
                    </div>

                    {/* Progress bar animation */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse"
                        style={{ width: "70%" }}
                      ></div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Upload className="h-3 w-3" />
                      <span>Please wait while we process your files...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Cancel
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {modalMode === "create" ? "Creating..." : "Updating..."}
                    </>
                  ) : modalMode === "create" ? (
                    "Create Hotel"
                  ) : (
                    "Update Hotel"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Image Preview Modal */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-gray-900">
          <DialogHeader className="p-4 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-between text-white">
              <DialogTitle className="flex items-center text-lg">
                {previewImage?.category === "document" ? (
                  <FileText className="h-5 w-5 mr-2" />
                ) : (
                  <ZoomIn className="h-5 w-5 mr-2" />
                )}
                {previewImage?.category?.charAt(0).toUpperCase() +
                  previewImage?.category?.slice(1)}{" "}
                Preview
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImagePreview(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {previewImage && (
            <div className="flex flex-col lg:flex-row h-full">
              {/* Main Preview Area */}
              <div className="flex-1 flex items-center justify-center p-6 bg-gray-900">
                {previewImage.category === "document" ? (
                  <div className="text-center bg-white rounded-lg p-12 max-w-md mx-auto shadow-2xl">
                    <div className="mb-6">
                      <FileText className="h-20 w-20 mx-auto text-blue-500 mb-4" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {previewImage.caption}
                        </h3>
                        <Badge variant="outline" className="text-sm">
                          {previewImage.caption
                            ?.split(".")
                            .pop()
                            ?.toUpperCase() || "DOCUMENT"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm">
                        Click below to open and view the document
                      </p>
                      <div className="flex space-x-2 justify-center">
                        <Button
                          onClick={() =>
                            window.open(previewImage.url, "_blank")
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open Document
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = previewImage.url;
                            link.download = previewImage.caption || "document";
                            link.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative max-w-full max-h-full">
                    <img
                      src={previewImage.url}
                      alt={previewImage.caption || "Preview"}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                      style={{ minHeight: "300px" }}
                    />
                  </div>
                )}
              </div>

              {/* Details Sidebar */}
              <div className="lg:w-80 bg-white border-l border-gray-200">
                <div className="p-6 h-full overflow-y-auto">
                  <div className="space-y-6">
                    {/* File Info Card */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        File Information
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-start">
                          <span className="text-gray-600 font-medium">
                            Name:
                          </span>
                          <span className="text-gray-900 text-right max-w-[60%] truncate">
                            {previewImage.caption || "Untitled"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Category:
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {previewImage.category}
                          </Badge>
                        </div>
                        {previewImage.roomType && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Room Type:
                            </span>
                            <span className="text-gray-900">
                              {previewImage.roomType}
                            </span>
                          </div>
                        )}
                        {previewImage.uploadedAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-medium">
                              Uploaded:
                            </span>
                            <span className="text-gray-900">
                              {new Date(
                                previewImage.uploadedAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <ZoomIn className="h-4 w-4 mr-2" />
                        Actions
                      </h4>
                      <div className="space-y-2">
                        {previewImage.category !== "document" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() =>
                              window.open(previewImage.url, "_blank")
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Size
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = previewImage.url;
                            link.download = previewImage.caption || "file";
                            link.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Download File
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => {
                            navigator.clipboard.writeText(previewImage.url);
                            // You could add a toast notification here
                          }}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Copy URL
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelsManagement;
