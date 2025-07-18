import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Eye, Search, Filter, Calendar, Mail, Phone, User } from 'lucide-react';

interface Query {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const QueryManagement = () => {
  const { toast } = useToast();
  const [queries, setQueries] = useState<Query[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91-9876543210',
      subject: 'Room Booking Inquiry',
      message: 'I would like to inquire about room availability for next weekend. Please provide rates and amenities.',
      status: 'new',
      createdAt: '2024-01-15T10:30:00Z',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@gmail.com',
      phone: '+91-9876543211',
      subject: 'Event Hosting',
      message: 'Can you accommodate a corporate event for 50 people? Need catering and AV equipment.',
      status: 'replied',
      createdAt: '2024-01-14T14:20:00Z',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+91-9876543212',
      subject: 'Cancellation Request',
      message: 'Need to cancel my booking for tomorrow due to emergency. Please process refund.',
      status: 'closed',
      createdAt: '2024-01-13T09:15:00Z',
      priority: 'high'
    },
    {
      id: 4,
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      phone: '+91-9876543213',
      subject: 'Facilities Inquiry',
      message: 'What facilities do you have for disabled guests? Need wheelchair accessible rooms.',
      status: 'new',
      createdAt: '2024-01-12T16:45:00Z',
      priority: 'medium'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Query['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Query['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateQueryStatus = (id: number, status: Query['status']) => {
    setQueries(prev => prev.map(query => 
      query.id === id ? { ...query, status } : query
    ));
    toast({
      title: "Status Updated",
      description: "Query status has been updated successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCounts = () => {
    return {
      total: queries.length,
      new: queries.filter(q => q.status === 'new').length,
      replied: queries.filter(q => q.status === 'replied').length,
      closed: queries.filter(q => q.status === 'closed').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Query Management</h1>
          <p className="text-gray-600 mt-1">Manage customer inquiries and support requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Queries</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.replied}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.closed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Queries</CardTitle>
          <CardDescription>
            View and manage all customer inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{query.name}</div>
                      <div className="text-sm text-gray-500">{query.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{query.subject}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(query.priority)}>
                      {query.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(query.status)}>
                      {query.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(query.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuery(query)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Query Details</DialogTitle>
                            <DialogDescription>
                              Customer inquiry information and message
                            </DialogDescription>
                          </DialogHeader>
                          {selectedQuery && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Name</label>
                                  <p className="text-gray-900">{selectedQuery.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Email</label>
                                  <p className="text-gray-900">{selectedQuery.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Phone</label>
                                  <p className="text-gray-900">{selectedQuery.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Subject</label>
                                  <p className="text-gray-900">{selectedQuery.subject}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Message</label>
                                <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                  {selectedQuery.message}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => updateQueryStatus(selectedQuery.id, 'replied')}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                  Mark as Replied
                                </Button>
                                <Button
                                  onClick={() => updateQueryStatus(selectedQuery.id, 'closed')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark as Closed
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueryManagement;