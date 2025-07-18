import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Eye, Search, Filter, Plus, Edit, Trash2, Building, Mail, Phone, Calendar } from 'lucide-react';

interface B2BClient {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  requirements: string;
  status: 'new' | 'negotiating' | 'contracted' | 'closed';
  value: number;
  createdAt: string;
  lastContact: string;
}

const B2BManagement = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<B2BClient[]>([
    {
      id: 1,
      companyName: 'Tech Solutions Ltd',
      contactPerson: 'David Miller',
      email: 'david.miller@techsolutions.com',
      phone: '+91-9876543220',
      industry: 'Technology',
      requirements: 'Monthly accommodation for visiting consultants. Need 10-15 rooms per month with corporate rates.',
      status: 'negotiating',
      value: 500000,
      createdAt: '2024-01-10T09:00:00Z',
      lastContact: '2024-01-15T14:30:00Z'
    },
    {
      id: 2,
      companyName: 'Global Manufacturing Inc',
      contactPerson: 'Sarah Chen',
      email: 'sarah.chen@globalmanuf.com',
      phone: '+91-9876543221',
      industry: 'Manufacturing',
      requirements: 'Quarterly business meetings and training sessions. Need conference facilities and group accommodation.',
      status: 'contracted',
      value: 750000,
      createdAt: '2024-01-05T11:20:00Z',
      lastContact: '2024-01-14T10:15:00Z'
    },
    {
      id: 3,
      companyName: 'Healthcare Partners',
      contactPerson: 'Dr. James Wilson',
      email: 'j.wilson@healthpartners.com',
      phone: '+91-9876543222',
      industry: 'Healthcare',
      requirements: 'Medical conference hosting with special dietary requirements and AV setup for 200+ attendees.',
      status: 'new',
      value: 300000,
      createdAt: '2024-01-12T16:45:00Z',
      lastContact: '2024-01-12T16:45:00Z'
    },
    {
      id: 4,
      companyName: 'Finance Corp',
      contactPerson: 'Lisa Rodriguez',
      email: 'l.rodriguez@financecorp.com',
      phone: '+91-9876543223',
      industry: 'Finance',
      requirements: 'Annual shareholder meeting venue with luxury accommodation for executives and board members.',
      status: 'closed',
      value: 450000,
      createdAt: '2024-01-08T12:30:00Z',
      lastContact: '2024-01-11T09:20:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<B2BClient | null>(null);
  const [selectedClient, setSelectedClient] = useState<B2BClient | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: '',
    requirements: '',
    status: 'new' as B2BClient['status'],
    value: 0
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: B2BClient['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'negotiating': return 'bg-yellow-100 text-yellow-800';
      case 'contracted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      industry: '',
      requirements: '',
      status: 'new',
      value: 0
    });
    setEditingClient(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (client: B2BClient) => {
    setEditingClient(client);
    setFormData({
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      industry: client.industry,
      requirements: client.requirements,
      status: client.status,
      value: client.value
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
    toast({
      title: "Client Deleted",
      description: "B2B client has been removed successfully.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      setClients(prev => prev.map(client => 
        client.id === editingClient.id 
          ? { 
              ...client, 
              ...formData,
              lastContact: new Date().toISOString()
            }
          : client
      ));
      toast({
        title: "Client Updated",
        description: "B2B client details have been updated successfully.",
      });
    } else {
      const newClient: B2BClient = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString()
      };
      setClients(prev => [...prev, newClient]);
      toast({
        title: "Client Added",
        description: "New B2B client has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusCounts = () => {
    return {
      total: clients.length,
      new: clients.filter(c => c.status === 'new').length,
      negotiating: clients.filter(c => c.status === 'negotiating').length,
      contracted: clients.filter(c => c.status === 'contracted').length,
      totalValue: clients.reduce((sum, c) => sum + c.value, 0)
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">B2B Management</h1>
          <p className="text-gray-600 mt-1">Manage business-to-business clients and partnerships</p>
        </div>
        <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add B2B Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Negotiating</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.negotiating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contracted</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.contracted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">₹{statusCounts.totalValue.toLocaleString()}</p>
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
                  placeholder="Search clients..."
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
                <option value="negotiating">Negotiating</option>
                <option value="contracted">Contracted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B2B Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>B2B Clients</CardTitle>
          <CardDescription>
            View and manage all business partnerships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.companyName}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{client.contactPerson}</TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{client.value.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(client.lastContact)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClient(client)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>B2B Client Details</DialogTitle>
                            <DialogDescription>
                              Business partnership information and requirements
                            </DialogDescription>
                          </DialogHeader>
                          {selectedClient && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Company</label>
                                  <p className="text-gray-900">{selectedClient.companyName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Contact Person</label>
                                  <p className="text-gray-900">{selectedClient.contactPerson}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Email</label>
                                  <p className="text-gray-900">{selectedClient.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Phone</label>
                                  <p className="text-gray-900">{selectedClient.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Industry</label>
                                  <p className="text-gray-900">{selectedClient.industry}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Value</label>
                                  <p className="text-gray-900">₹{selectedClient.value.toLocaleString()}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600">Requirements</label>
                                <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                                  {selectedClient.requirements}
                                </p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit B2B Client' : 'Add New B2B Client'}
            </DialogTitle>
            <DialogDescription>
              {editingClient 
                ? 'Update client details and requirements.' 
                : 'Create a new business partnership record.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Contract Value (₹)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: B2BClient['status']) => 
                setFormData(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="contracted">Contracted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Describe the client's requirements..."
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                {editingClient ? 'Update' : 'Create'} Client
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default B2BManagement;