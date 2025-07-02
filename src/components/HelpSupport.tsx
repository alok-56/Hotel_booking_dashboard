
import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState('tickets');

  const supportTickets = [
    {
      id: 'TKT-001',
      title: 'Payment Gateway Issue',
      description: 'Unable to process credit card payments for room bookings',
      priority: 'High',
      status: 'Open',
      createdAt: '2025-01-15 10:30 AM',
      category: 'Technical',
      assignee: 'Tech Support Team'
    },
    {
      id: 'TKT-002',
      title: 'Room Assignment Problem',
      description: 'System showing occupied rooms as available',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '2025-01-14 02:15 PM',
      category: 'System',
      assignee: 'John Smith'
    },
    {
      id: 'TKT-003',
      title: 'Guest Complaint Resolution',
      description: 'Guest reported AC not working in room 205',
      priority: 'Low',
      status: 'Resolved',
      createdAt: '2025-01-13 09:45 AM',
      category: 'Operations',
      assignee: 'Sarah Johnson'
    }
  ];

  const faqItems = [
    {
      question: 'How do I process a refund for a cancelled booking?',
      answer: 'Go to Bookings > Find the booking > Click Actions > Select Refund. Follow the prompts to process the refund.',
      category: 'Bookings'
    },
    {
      question: 'How to add a new room to the inventory?',
      answer: 'Navigate to Operations > Room Management > Add New Room. Fill in the required details and save.',
      category: 'Operations'
    },
    {
      question: 'How do I update room rates?',
      answer: 'Go to Pricing > Select room type > Update rates. You can set seasonal rates and special pricing rules.',
      category: 'Pricing'
    },
    {
      question: 'How to generate reports?',
      answer: 'Visit Reports section > Select report type > Set date range > Click Generate. You can export reports in PDF or Excel format.',
      category: 'Reports'
    }
  ];

  const contactChannels = [
    {
      type: 'Phone Support',
      icon: Phone,
      info: '+91 1800-123-4567',
      description: '24/7 Phone Support',
      availability: 'Available now',
      color: 'text-green-600 bg-green-100'
    },
    {
      type: 'Email Support',
      icon: Mail,
      info: 'support@oyoos.com',
      description: 'Email Support Team',
      availability: 'Response within 4 hours',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      type: 'Live Chat',
      icon: MessageSquare,
      info: 'Start Chat',
      description: 'Instant Chat Support',
      availability: 'Available 9 AM - 9 PM',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return AlertCircle;
      case 'In Progress': return Clock;
      case 'Resolved': return CheckCircle;
      default: return HelpCircle;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600">Get help or raise a support ticket</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactChannels.map((channel, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${channel.color}`}>
                    <channel.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-gray-500">{channel.availability}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{channel.type}</h3>
                <p className="text-sm text-gray-600 mb-3">{channel.description}</p>
                <Button variant="outline" className="w-full">
                  {channel.info}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'tickets', label: 'Support Tickets' },
              { key: 'faq', label: 'FAQ' },
              { key: 'guides', label: 'User Guides' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'tickets' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Your Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => {
                  const StatusIcon = getStatusIcon(ticket.status);
                  return (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-mono text-sm text-gray-600">{ticket.id}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              <StatusIcon className="h-3 w-3 inline mr-1" />
                              {ticket.status}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{ticket.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>Created: {ticket.createdAt}</span>
                            <span>Category: {ticket.category}</span>
                            <span>Assigned to: {ticket.assignee}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'faq' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-orange-600" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {faq.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">Setting up your hotel profile</h4>
                    <p className="text-sm text-gray-600">Learn how to configure your hotel details</p>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">Managing room inventory</h4>
                    <p className="text-sm text-gray-600">Add rooms and set availability</p>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">Processing bookings</h4>
                    <p className="text-sm text-gray-600">Handle reservations and check-ins</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">Dynamic pricing strategies</h4>
                    <p className="text-sm text-gray-600">Optimize your room rates</p>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">Analytics and reporting</h4>
                    <p className="text-sm text-gray-600">Generate insights and reports</p>
                  </button>
                  <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <h4 className="font-medium text-gray-900">Guest communication</h4>
                    <p className="text-sm text-gray-600">Manage guest interactions</p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSupport;
