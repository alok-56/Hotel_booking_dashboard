// // Print Receipt Function
// export const printReceipt = (booking, hotelInfo = null) => {
//   // Default hotel information - you can customize this
//   const defaultHotelInfo = {
//     name: "Your Hotel Name",
//     address: "Hotel Address Line 1\nHotel Address Line 2",
//     phone: "+91 XXXXXXXXXX",
//     email: "info@yourhotel.com",
//     gst: "GST NO: XXXXXXXXXXXX",
//   };

//   const hotel = hotelInfo || defaultHotelInfo;

//   // Calculate totals based on your data structure
//   const addonsTotal = booking.addOns
//     ? booking.addOns.reduce((sum, addon) => sum + (addon.cost || 0), 0)
//     : 0;
//   const totalAmount = (booking.amount || 0) + addonsTotal;
//   const balanceAmount = booking.pendingamount || 0;
//   const roomNumbers =
//     booking.roomno && Array.isArray(booking.roomno) ? booking.roomno : [];
//   const primaryGuest =
//     booking.userifo && booking.userifo[0] ? booking.userifo[0] : null;

//   // Create receipt HTML content
//   const receiptHTML = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <style>
//             @media print {
//                 body { margin: 0; padding: 10px; }
//                 .no-print { display: none !important; }
//             }

//             body {
//                 font-family: 'Courier New', monospace;
//                 font-size: 12px;
//                 line-height: 1.4;
//                 max-width: 300px;
//                 margin: 0 auto;
//                 padding: 10px;
//                 background: white;
//             }

//             .receipt-header {
//                 text-align: center;
//                 border-bottom: 2px solid #000;
//                 padding-bottom: 10px;
//                 margin-bottom: 15px;
//             }

//             .hotel-name {
//                 font-size: 16px;
//                 font-weight: bold;
//                 margin-bottom: 5px;
//                 text-transform: uppercase;
//             }

//             .hotel-details {
//                 font-size: 10px;
//                 line-height: 1.3;
//             }

//             .receipt-title {
//                 text-align: center;
//                 font-size: 14px;
//                 font-weight: bold;
//                 margin: 15px 0;
//                 text-decoration: underline;
//             }

//             .booking-info {
//                 margin-bottom: 15px;
//             }

//             .info-row {
//                 display: flex;
//                 justify-content: space-between;
//                 margin-bottom: 3px;
//                 border-bottom: 1px dotted #ccc;
//                 padding-bottom: 2px;
//             }

//             .info-label {
//                 font-weight: bold;
//             }

//             .guest-info {
//                 margin: 15px 0;
//                 padding: 10px 0;
//                 border-top: 1px solid #000;
//                 border-bottom: 1px solid #000;
//             }

//             .bill-section {
//                 margin: 15px 0;
//             }

//             .bill-row {
//                 display: flex;
//                 justify-content: space-between;
//                 margin-bottom: 3px;
//                 padding: 2px 0;
//             }

//             .bill-total {
//                 border-top: 2px solid #000;
//                 border-bottom: 2px solid #000;
//                 font-weight: bold;
//                 font-size: 13px;
//                 padding: 5px 0;
//                 margin-top: 10px;
//             }

//             .addon-item {
//                 font-size: 10px;
//                 color: #666;
//                 margin-left: 10px;
//             }

//             .receipt-footer {
//                 text-align: center;
//                 margin-top: 20px;
//                 padding-top: 10px;
//                 border-top: 1px solid #000;
//                 font-size: 10px;
//             }

//             .thank-you {
//                 font-weight: bold;
//                 margin: 10px 0;
//             }

//             .print-timestamp {
//                 font-size: 9px;
//                 color: #666;
//             }

//             @media screen {
//                 .print-button {
//                     background: #007bff;
//                     color: white;
//                     padding: 10px 20px;
//                     border: none;
//                     border-radius: 5px;
//                     cursor: pointer;
//                     font-size: 14px;
//                     margin: 20px auto;
//                     display: block;
//                 }

//                 .print-button:hover {
//                     background: #0056b3;
//                 }
//             }
//         </style>
//     </head>
//     <body>
//         <!-- Print Button (visible on screen only) -->
//         <button class="print-button no-print" onclick="window.print()">Print Receipt</button>

//         <div class="receipt-title">BOOKING RECEIPT</div>

//         <div class="booking-info">
//             <div class="info-row">
//                 <span class="info-label">Booking ID:</span>
//                 <span>${
//                   booking.actualBookingId || booking.bookingId || "N/A"
//                 }</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Receipt No:</span>
//                 <span>${booking.bookingId || booking.id}</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Date:</span>
//                 <span>${new Date().toLocaleDateString("en-IN")}</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Time:</span>
//                 <span>${new Date().toLocaleTimeString("en-IN")}</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Status:</span>
//                 <span style="text-transform: uppercase;">${
//                   booking.status
//                 }</span>
//             </div>
//         </div>

//         <div class="guest-info">
//             <div class="info-row">
//                 <span class="info-label">Guest Name:</span>
//                 <span>${booking.guestName || "Unknown Guest"}</span>
//             </div>
//             ${
//               primaryGuest
//                 ? `
//             <div class="info-row">
//                 <span class="info-label">Phone:</span>
//                 <span>${
//                   primaryGuest.phone || booking.phoneNumber || "N/A"
//                 }</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Email:</span>
//                 <span>${primaryGuest.email || booking.email || "N/A"}</span>
//             </div>
//             `
//                 : ""
//             }
//             <div class="info-row">
//                 <span class="info-label">Guests:</span>
//                 <span>${booking.guestCount || 1} Adults, ${
//     booking.childrencount || 0
//   } Children</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Total Guests:</span>
//                 <span>${
//                   (booking.guestCount || 1) + (booking.childrencount || 0)
//                 }</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Room Type:</span>
//                 <span>${booking.roomType || "Standard"}</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Rooms:</span>
//                 <span>${booking.rooms || 1}</span>
//             </div>
//             ${
//               roomNumbers.length > 0
//                 ? `
//             <div class="info-row">
//                 <span class="info-label">Room No:</span>
//                 <span>${roomNumbers.join(", ")}</span>
//             </div>
//             `
//                 : ""
//             }
//             <div class="info-row">
//                 <span class="info-label">Check-in:</span>
//                 <span>${
//                   booking.checkIn ||
//                   new Date(booking.checkindate).toLocaleDateString("en-IN")
//                 }</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Check-out:</span>
//                 <span>${
//                   booking.checkOut ||
//                   new Date(booking.checkoutdate).toLocaleDateString("en-IN")
//                 }</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Nights:</span>
//                 <span>${booking.nights || 1}</span>
//             </div>
//             <div class="info-row">
//                 <span class="info-label">Source:</span>
//                 <span>${booking.source || "Direct"}</span>
//             </div>
//         </div>

//         <div class="bill-section">
//             <div style="text-align: center; font-weight: bold; margin-bottom: 10px; text-decoration: underline;">
//                 BILL SUMMARY
//             </div>

//             <div class="bill-row">
//                 <span>Room Charges (${booking.nights || 1} nights)</span>
//                 <span>₹${(booking.amount || 0).toLocaleString("en-IN")}</span>
//             </div>

//             ${
//               booking.addOns && booking.addOns.length > 0
//                 ? `
//                 <div class="bill-row" style="margin-top: 10px;">
//                     <span style="font-weight: bold;">Add-on Services:</span>
//                     <span style="font-weight: bold;">₹${addonsTotal.toLocaleString(
//                       "en-IN"
//                     )}</span>
//                 </div>
//                 ${booking.addOns
//                   .map(
//                     (addon) => `
//                     <div class="addon-item">
//                         <span>${addon.serviceName || "Service"}</span>
//                         <span style="float: right;">₹${(
//                           addon.cost || 0
//                         ).toLocaleString("en-IN")}</span>
//                         ${
//                           addon.status
//                             ? `<span style="font-size: 9px; color: #666;"> (${addon.status})</span>`
//                             : ""
//                         }
//                         <div style="clear: both;"></div>
//                     </div>
//                 `
//                   )
//                   .join("")}
//             `
//                 : ""
//             }

//             <div class="bill-row bill-total">
//                 <span>TOTAL AMOUNT</span>
//                 <span>₹${booking.amountCollected.toLocaleString("en-IN")}</span>
//             </div>

//             <div class="bill-row" style="margin-top: 10px;">
//                 <span>Amount Paid</span>
//                 <span>₹${(booking.amountCollected || 0).toLocaleString(
//                   "en-IN"
//                 )}</span>
//             </div>

//             ${
//               balanceAmount > 0
//                 ? `
//             <div class="bill-row" style="color: #d32f2f; font-weight: bold;">
//                 <span>Balance Due</span>
//                 <span>₹${balanceAmount.toLocaleString("en-IN")}</span>
//             </div>
//             `
//                 : ""
//             }

//             ${
//               booking.paymentStatus
//                 ? `
//             <div class="bill-row" style="margin-top: 5px; font-size: 11px;">
//                 <span>Payment Status:</span>
//                 <span style="text-transform: uppercase; color: ${
//                   booking.paymentStatus === "completed"
//                     ? "#22c55e"
//                     : booking.paymentStatus === "pending"
//                     ? "#f59e0b"
//                     : "#666"
//                 };">${booking.paymentStatus}</span>
//             </div>
//             `
//                 : ""
//             }
//         </div>

//         <div class="receipt-footer">
//             <div class="thank-you">Thank you for staying with us!</div>
//             <div>Have a pleasant stay!</div>
//             <div class="print-timestamp">
//                 Printed on: ${new Date().toLocaleString("en-IN")}
//             </div>
//         </div>
//     </body>
//     </html>
//   `;

//   // Open print window
//   const printWindow = window.open(
//     "",
//     "_blank",
//     "width=400,height=600,scrollbars=yes"
//   );
//   printWindow.document.write(receiptHTML);
//   printWindow.document.close();

//   // Auto print after content loads
//   printWindow.onload = function () {
//     printWindow.focus();
//     printWindow.print();
//   };

//   // Close window after printing (optional)
//   printWindow.onafterprint = function () {
//     printWindow.close();
//   };

//   return printWindow;
// };

// Print Receipt Function for A4 Paper
export const printReceipt = (booking, hotelInfo = null) => {
  console.log(booking)
  const defaultHotelInfo = {
    name: booking?.hotelId?.hotelName,
    address: booking?.hotelId?.address,
    phone: booking?.hotelId?.phone,
    email: booking?.hotelId?.email,
    gst: "GSTIN: 19AAZFB3139L1ZQ",
    hsn: "HSN: 996311",
  };

  

  const hotel = hotelInfo || defaultHotelInfo;

  // Calculate totals based on your data structure
  const addonsTotal = booking.addOns
    ? booking.addOns.reduce((sum, addon) => sum + (addon.cost || 0), 0)
    : 0;
  const totalAmount = (booking.amount || 0) + addonsTotal;
  const balanceAmount = booking.pendingamount || 0;
  const roomNumbers =
    booking.roomno && Array.isArray(booking.roomno) ? booking.roomno : [];
  const primaryGuest =
    booking.userifo && booking.userifo[0] ? booking.userifo[0] : null;

  // Create receipt HTML content for A4 paper
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {
                size: A4;
                margin: 10mm;
            }
            
            @media print {
                body { 
                    margin: 0; 
                    padding: 0;
                    -webkit-print-color-adjust: exact;
                }
                .no-print { display: none !important; }
            }
            
            body {
                font-family: 'Arial', sans-serif;
                font-size: 12px;
                line-height: 1.3;
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
                padding: 10px;
                background: white;
                color: #333;
            }
            
            .receipt-container {
                border: 2px solid #000;
                padding: 15px;
                height: 277mm;
                box-sizing: border-box;
            }
            
            .receipt-header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            
            .hotel-name {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 5px;
                text-transform: uppercase;
                color: #2c3e50;
            }
            
            .hotel-details {
                font-size: 11px;
                line-height: 1.2;
                margin-bottom: 8px;
            }
            
            .gst-details {
                font-size: 10px;
                font-weight: bold;
                color: #555;
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 5px;
            }
            
            .receipt-title {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin: 15px 0 10px 0;
                text-decoration: underline;
                color: #2c3e50;
            }
            
            .booking-info-section, .guest-info-section, .bill-section {
                margin-bottom: 15px;
            }
            
            .section-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 8px;
                padding-bottom: 3px;
                border-bottom: 1px solid #ddd;
                color: #2c3e50;
                text-transform: uppercase;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px 20px;
                margin-bottom: 10px;
            }
            
            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 3px 0;
                border-bottom: 1px dotted #ccc;
                font-size: 11px;
            }
            
            .info-label {
                font-weight: bold;
                color: #555;
                min-width: 100px;
            }
            
            .info-value {
                text-align: right;
                font-weight: 500;
            }
            
            .full-width {
                grid-column: 1 / -1;
            }
            
            .guest-info {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #e9ecef;
            }
            
            .bill-summary {
                background: #f8f9fa;
                padding: 12px;
                border-radius: 5px;
                border: 1px solid #e9ecef;
            }
            
            .bill-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 0;
                border-bottom: 1px dotted #ddd;
                font-size: 12px;
            }
            
            .bill-total {
                border-top: 2px solid #2c3e50;
                border-bottom: 2px solid #2c3e50;
                font-weight: bold;
                font-size: 14px;
                padding: 8px 0;
                margin: 10px 0;
                background: #e8f4f8;
            }
            
            .addon-section {
                margin: 8px 0;
                background: #fff;
                border-left: 3px solid #3498db;
                padding-left: 8px;
            }
            
            .addon-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 3px 0;
                font-size: 10px;
                color: #666;
                border-bottom: 1px dotted #eee;
            }
            
            .balance-due {
                color: #e74c3c;
                font-weight: bold;
                background: #fdf2f2;
                padding: 5px;
                border-radius: 3px;
                border-left: 3px solid #e74c3c;
            }
            
            .payment-status {
                font-size: 10px;
                padding: 3px 8px;
                border-radius: 10px;
                display: inline-block;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .status-completed {
                background: #d4edda;
                color: #155724;
            }
            
            .status-pending {
                background: #fff3cd;
                color: #856404;
            }
            
            .receipt-footer {
                text-align: center;
                margin-top: 15px;
                padding-top: 10px;
                border-top: 1px solid #000;
            }
            
            .thank-you {
                font-size: 14px;
                font-weight: bold;
                margin: 8px 0;
                color: #2c3e50;
            }
            
            .print-timestamp {
                font-size: 9px;
                color: #666;
                margin-top: 8px;
            }
            
            .contact-info {
                margin-top: 8px;
                font-size: 9px;
                color: #666;
                line-height: 1.3;
            }
            
            @media screen {
                .print-button {
                    background: #007bff;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin: 20px auto;
                    display: block;
                    font-weight: bold;
                }
                
                .print-button:hover {
                    background: #0056b3;
                }
            }
            
            .amount-highlight {
                font-size: 13px;
                font-weight: bold;
            }
            
            .booking-status {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 10px;
                font-weight: bold;
                text-transform: uppercase;
                background: #e8f5e8;
                color: #2e7d2e;
                border: 1px solid #2e7d2e;
                font-size: 10px;
            }
        </style>
    </head>
    <body>
        <!-- Print Button (visible on screen only) -->
        <button class="print-button no-print" onclick="window.print()">🖨️ Print Receipt</button>
        
        <div class="receipt-container">
            <div class="receipt-header">
                <div class="hotel-name">${hotel.name}</div>
                <div class="hotel-details">${hotel.address.replace(
                  /\\n/g,
                  "<br>"
                )}</div>
                <div class="hotel-details">
                    📞 ${hotel.phone} | 📧 ${hotel.email}
                </div>
                <div class="gst-details">
                    <span>${hotel.gst}</span>
                    <span>${hotel.hsn}</span>
                </div>
            </div>
            
            <div class="receipt-title">BOOKING RECEIPT</div>
            
            <div class="booking-info-section">
                <div class="section-title">Booking Information</div>
                <div class="info-grid">
                    <div class="info-row">
                        <span class="info-label">Booking ID:</span>
                        <span class="info-value">${
                          booking.actualBookingId || booking.bookingId || "N/A"
                        }</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Receipt No:</span>
                        <span class="info-value">${
                          booking.bookingId || booking.id
                        }</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Date:</span>
                        <span class="info-value">${new Date().toLocaleDateString(
                          "en-IN"
                        )}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Time:</span>
                        <span class="info-value">${new Date().toLocaleTimeString(
                          "en-IN"
                        )}</span>
                    </div>
                    <div class="info-row full-width">
                        <span class="info-label">Status:</span>
                        <span class="booking-status">${booking.status}</span>
                    </div>
                </div>
            </div>
            
            <div class="guest-info-section">
                <div class="section-title">Guest Details</div>
                <div class="guest-info">
                    <div class="info-grid">
                        <div class="info-row">
                            <span class="info-label">Guest Name:</span>
                            <span class="info-value">${
                              booking.guestName || "Unknown Guest"
                            }</span>
                        </div>
                        ${
                          primaryGuest
                            ? `
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${
                              primaryGuest.phone || booking.phoneNumber || "N/A"
                            }</span>
                        </div>
                        <div class="info-row full-width">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${
                              primaryGuest.email || booking.email || "N/A"
                            }</span>
                        </div>
                        `
                            : ""
                        }
                        <div class="info-row">
                            <span class="info-label">Adults:</span>
                            <span class="info-value">${
                              booking.guestCount || 1
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Children:</span>
                            <span class="info-value">${
                              booking.childrencount || 0
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Total Guests:</span>
                            <span class="info-value">${
                              (booking.guestCount || 1) +
                              (booking.childrencount || 0)
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Room Type:</span>
                            <span class="info-value">${
                              booking.roomType || "Standard"
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Rooms:</span>
                            <span class="info-value">${
                              booking.rooms || 1
                            }</span>
                        </div>
                        ${
                          roomNumbers.length > 0
                            ? `
                        <div class="info-row">
                            <span class="info-label">Room No:</span>
                            <span class="info-value">${roomNumbers.join(
                              ", "
                            )}</span>
                        </div>
                        `
                            : ""
                        }
                        <div class="info-row">
                            <span class="info-label">Check-in:</span>
                            <span class="info-value">${
                              booking.checkIn ||
                              new Date(booking.checkindate).toLocaleDateString(
                                "en-IN"
                              )
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Check-out:</span>
                            <span class="info-value">${
                              booking.checkOut ||
                              new Date(booking.checkoutdate).toLocaleDateString(
                                "en-IN"
                              )
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Nights:</span>
                            <span class="info-value">${
                              booking.nights || 1
                            }</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Source:</span>
                            <span class="info-value">${
                              booking.source || "Direct"
                            }</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bill-section">
                <div class="section-title">Bill Summary</div>
                <div class="bill-summary">
                    <div class="bill-row">
                        <span>Room Charges (${
                          booking.nights || 1
                        } nights)</span>
                        <span class="amount-highlight">₹${(
                          booking.amount || 0
                        ).toLocaleString("en-IN")}</span>
                    </div>
                    
                    ${
                      booking.addOns && booking.addOns.length > 0
                        ? `
                    <div class="addon-section">
                        <div class="bill-row" style="font-weight: bold; color: #2c3e50;">
                            <span>Add-on Services:</span>
                            <span class="amount-highlight">₹${addonsTotal.toLocaleString(
                              "en-IN"
                            )}</span>
                        </div>
                        ${booking.addOns
                          .map(
                            (addon) => `
                        <div class="addon-item">
                            <span>
                                ${addon.serviceName || "Service"}
                                ${
                                  addon.status
                                    ? `<small style="color: #999;"> (${addon.status})</small>`
                                    : ""
                                }
                            </span>
                            <span>₹${(addon.cost || 0).toLocaleString(
                              "en-IN"
                            )}</span>
                        </div>
                        `
                          )
                          .join("")}
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="bill-row bill-total">
                        <span>TOTAL AMOUNT</span>
                        <span>₹${booking.amountCollected.toLocaleString(
                          "en-IN"
                        )}</span>
                    </div>
                    
                    <div class="bill-row">
                        <span>Amount Paid</span>
                        <span class="amount-highlight" style="color: #27ae60;">₹${(
                          booking.amountCollected || 0
                        ).toLocaleString("en-IN")}</span>
                    </div>
                    
                    ${
                      balanceAmount > 0
                        ? `
                    <div class="bill-row balance-due">
                        <span>Balance Due</span>
                        <span class="amount-highlight">₹${balanceAmount.toLocaleString(
                          "en-IN"
                        )}</span>
                    </div>
                    `
                        : ""
                    }
                    
                    ${
                      booking.paymentStatus
                        ? `
                    <div style="text-align: center; margin-top: 15px;">
                        <span class="payment-status ${
                          booking.paymentStatus === "completed"
                            ? "status-completed"
                            : "status-pending"
                        }">
                            Payment ${booking.paymentStatus}
                        </span>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
            
            <div class="receipt-footer">
                <div class="thank-you">🙏 Thank you for staying with us! 🙏</div>
                <div style="font-size: 16px; margin: 10px 0;">Have a pleasant stay!</div>
            
            </div>
        </div>
    </body>
    </html>
  `;

  // Open print window
  const printWindow = window.open(
    "",
    "_blank",
    "width=800,height=1000,scrollbars=yes"
  );
  printWindow.document.write(receiptHTML);
  printWindow.document.close();

  // Auto print after content loads
  printWindow.onload = function () {
    printWindow.focus();
    printWindow.print();
  };

  // Close window after printing (optional)
  printWindow.onafterprint = function () {
    printWindow.close();
  };

  return printWindow;
};
