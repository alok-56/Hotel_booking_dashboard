
import React, { useState } from 'react';
import { Settings, User, Shield, Bell, Palette, Database, Wifi, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    smsAlerts: false,
    pushNotifications: true,
    marketingEmails: false
  });

  const settingsTabs = [
    { id: 'profile', label: 'Hotel Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const hotelProfile = {
    name: 'Hotel Brill Sector 2',
    address: '123 Business District, Sector 2, Gurgaon',
    phone: '+91 124 456 7890',
    email: 'info@hotelbrill.com',
    website: 'www.hotelbrill.com',
    starRating: 4,
    rooms: 120,
    checkInTime: '14:00',
    checkOutTime: '12:00'
  };

  const integrationServices = [
    { name: 'Payment Gateway', provider: 'Razorpay', status: 'Connected', icon: CreditCard },
    { name: 'Channel Manager', provider: 'OTA Connect', status: 'Connected', icon: Wifi },
    { name: 'Email Service', provider: 'SendGrid', status: 'Disconnected', icon: Bell },
    { name: 'SMS Service', provider: 'Twilio', status: 'Connected', icon: Bell }
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your hotel configuration and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="h-5 w-5 mr-2" />
                Settings Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                        <input
                          type="text"
                          value={hotelProfile.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={hotelProfile.phone}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={hotelProfile.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <input
                          type="url"
                          value={hotelProfile.website}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={hotelProfile.address}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                          <option value="3">3 Star</option>
                          <option value="4" selected>4 Star</option>
                          <option value="5">5 Star</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                        <input
                          type="time"
                          value={hotelProfile.checkInTime}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                        <input
                          type="time"
                          value={hotelProfile.checkOutTime}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Password Security</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Enable 2FA</div>
                          <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                        </div>
                        <Button variant="outline">
                          Enable
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Login Activity</h3>
                      <div className="space-y-3">
                        {[
                          { device: 'Chrome on Mac', location: 'Mumbai, India', time: '2 hours ago', current: true },
                          { device: 'Safari on iPhone', location: 'Mumbai, India', time: '1 day ago', current: false },
                          { device: 'Chrome on Windows', location: 'Delhi, India', time: '3 days ago', current: false }
                        ].map((session, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{session.device}</div>
                              <div className="text-sm text-gray-600">{session.location} • {session.time}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {session.current && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Current</span>
                              )}
                              {!session.current && (
                                <Button variant="outline" size="sm">Revoke</Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="bg-red-600 hover:bg-red-700">
                      Update Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailBookings', label: 'Email notifications for new bookings', description: 'Get notified via email when new bookings are made' },
                          { key: 'smsAlerts', label: 'SMS alerts for cancellations', description: 'Receive SMS when bookings are cancelled' },
                          { key: 'pushNotifications', label: 'Push notifications', description: 'Browser notifications for important updates' },
                          { key: 'marketingEmails', label: 'Marketing emails', description: 'Promotional emails and feature updates' }
                        ].map((notification) => (
                          <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{notification.label}</div>
                              <div className="text-sm text-gray-600">{notification.description}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications[notification.key as keyof typeof notifications]}
                                onChange={() => handleNotificationChange(notification.key)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">
                      Save Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'integrations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-gray-600">Manage your third-party service integrations</p>
                    <div className="space-y-4">
                      {integrationServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <service.icon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{service.name}</div>
                              <div className="text-sm text-gray-600">Provider: {service.provider}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              service.status === 'Connected' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {service.status}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={service.status === 'Connected' ? 'text-red-600' : 'text-green-600'}
                            >
                              {service.status === 'Connected' ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Professional Plan</h3>
                          <p className="text-gray-600">Full access to all features</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">₹2,999</div>
                          <div className="text-sm text-gray-600">per month</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-6 w-6 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                              <div className="text-sm text-gray-600">Visa ending in 4242</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                      <div className="space-y-3">
                        {[
                          { date: '2025-01-01', amount: '₹2,999', status: 'Paid', invoice: 'INV-001' },
                          { date: '2024-12-01', amount: '₹2,999', status: 'Paid', invoice: 'INV-002' },
                          { date: '2024-11-01', amount: '₹2,999', status: 'Paid', invoice: 'INV-003' }
                        ].map((bill, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="font-medium text-gray-900">{bill.invoice}</div>
                                <div className="text-sm text-gray-600">{bill.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-medium text-gray-900">{bill.amount}</div>
                                <div className="text-sm text-green-600">{bill.status}</div>
                              </div>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
