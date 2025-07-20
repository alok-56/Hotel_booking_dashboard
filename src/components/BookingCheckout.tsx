import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, Receipt, CreditCard } from 'lucide-react';
import { getAllMenus } from '@/api/Services/Hotel/hotel';
import { createOfflineBooking } from '@/api/Services/Booking/booking';
import { useToast } from '@/hooks/use-toast';

interface AddOn {
  serviceName: string;
  cost: number;
  status: 'active' | 'inactive';
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
}

interface BookingCheckoutProps {
  bookingData: BookingData;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookingCheckout: React.FC<BookingCheckoutProps> = ({ 
  bookingData, 
  onSuccess, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

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
      addon => addon.serviceName === menuItem.menuname
    );

    if (existingAddOn) {
      setSelectedAddOns(prev => prev.map(addon => 
        addon.serviceName === menuItem.menuname 
          ? { ...addon, quantity: (addon.quantity || 1) + 1 }
          : addon
      ));
    } else {
      setSelectedAddOns(prev => [...prev, {
        serviceName: menuItem.menuname,
        cost: menuItem.price,
        status: 'active',
        quantity: 1
      }]);
    }
  };

  const updateAddOnQuantity = (serviceName: string, increment: boolean) => {
    setSelectedAddOns(prev => prev.map(addon => {
      if (addon.serviceName === serviceName) {
        const newQuantity = (addon.quantity || 1) + (increment ? 1 : -1);
        return newQuantity > 0 ? { ...addon, quantity: newQuantity } : addon;
      }
      return addon;
    }).filter(addon => (addon.quantity || 1) > 0));
  };

  const removeAddOn = (serviceName: string) => {
    setSelectedAddOns(prev => prev.filter(addon => addon.serviceName !== serviceName));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'summer25') {
      setDiscountAmount(300);
      toast({
        title: "Coupon Applied",
        description: "₹300 discount applied successfully!",
      });
    } else if (couponCode.toLowerCase() === 'welcome10') {
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
    const addOnsTotal = selectedAddOns.reduce((total, addon) => 
      total + (addon.cost * (addon.quantity || 1)), 0
    );
    const subtotal = baseAmount + addOnsTotal;
    const taxAmount = Math.round(subtotal * 0.18); // 18% tax
    const totalAmount = subtotal + taxAmount - discountAmount;

    return {
      baseAmount,
      addOnsTotal,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount: Math.max(0, totalAmount),
      pendingAmount: Math.max(0, totalAmount)
    };
  };

  const handleBookingCreation = async () => {
    try {
      setLoading(true);
      const totals = calculateTotals();

      
      
      const payload = {
        hotelId: bookingData.hotelId,
        roomId: bookingData.roomId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        userInfo: bookingData.userInfo,
        guests: bookingData.guests,
        addOns: selectedAddOns.map(addon => ({
          serviceName: addon.serviceName,
          cost: addon.cost * (addon.quantity || 1),
          status: addon.status
        })),
        couponCode: couponCode || undefined,
        discountAmount: totals.discountAmount,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount
      };

      const response = await createOfflineBooking(payload);
      
      if (response.status) {
        toast({
          title: "Booking Created",
          description: "Booking has been created successfully!",
        });
        onSuccess();
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                {menuItems.filter(item => item.isavailable).map((item) => (
                  <div key={item._id} className="flex justify-between items-center p-3 border rounded-lg">
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
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{addon.serviceName}</h4>
                      <p className="text-sm text-gray-600">₹{addon.cost} × {addon.quantity || 1}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAddOnQuantity(addon.serviceName, false)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{addon.quantity || 1}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAddOnQuantity(addon.serviceName, true)}
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
                <p>Check-in: {new Date(bookingData.checkInDate).toLocaleDateString()}</p>
                <p>Check-out: {new Date(bookingData.checkOutDate).toLocaleDateString()}</p>
                <p>Nights: {bookingData.nights}</p>
                <p>Guests: {bookingData.guests.adults} Adults, {bookingData.guests.children} Children</p>
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
                    <div key={index} className="flex justify-between text-sm text-gray-600 ml-4">
                      <span>{addon.serviceName} × {addon.quantity || 1}</span>
                      <span>₹{(addon.cost * (addon.quantity || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax (18%)</span>
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
              
              <div className="flex justify-between text-lg font-bold text-red-600">
                <span>Pending Amount</span>
                <span>₹{totals.pendingAmount.toLocaleString()}</span>
              </div>
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
                {loading ? 'Creating Booking...' : 'Create Booking'}
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