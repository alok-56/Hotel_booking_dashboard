import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Briefcase, Eye, Search, Building, Mail, Phone, Calendar, User, Globe } from 'lucide-react';
import { getB2B } from '@/api/Services/Website/web';

interface B2BContact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  companyWebsite?: string;
  subject?: string;
  message?: string;
  industry?: string;
  companySize?: string;
  createdAt: string;
  updatedAt: string;
}



const B2BManagement = () => {
  const [contacts, setContacts] = useState<B2BContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<B2BContact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await getB2B();
      
      if (res.status) {
        setContacts(res.data);
        setError(null);
      } else {
      
        setError('Invalid data format received from server');
        setContacts([]);
      }
    } catch (err) {
      setError('Failed to fetch B2B contacts. Please check your network connection.');
      console.error('Error fetching B2B contacts:', err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = Array.isArray(contacts) ? contacts.filter(contact => {
    const matchesSearch = 
      (contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.companyName && contact.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.industry && contact.industry.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  }) : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const contactDate = new Date(dateString);
    return today.toDateString() === contactDate.toDateString();
  };

  const getTodayContacts = () => {
    if (!Array.isArray(contacts)) return [];
    return contacts.filter(contact => isToday(contact.createdAt));
  };

  const getIndustryStats = () => {
    if (!Array.isArray(contacts)) return {};
    const industries: { [key: string]: number } = {};
    contacts.forEach(contact => {
      if (contact.industry) {
        industries[contact.industry] = (industries[contact.industry] || 0) + 1;
      }
    });
    return industries;
  };

  const getCompanySizeStats = () => {
    if (!Array.isArray(contacts)) return {};
    const sizes: { [key: string]: number } = {};
    contacts.forEach(contact => {
      if (contact.companySize) {
        sizes[contact.companySize] = (sizes[contact.companySize] || 0) + 1;
      }
    });
    return sizes;
  };

  const todayContacts = getTodayContacts();
  const industryStats = getIndustryStats();
  const companySizeStats = getCompanySizeStats();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading B2B contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button onClick={fetchContacts} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const ContactCard = ({ contact, isNew = false }: { contact: B2BContact; isNew?: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{contact.companyName}</h3>
            {isNew && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-700">{contact.name}</p>
          <p className="text-sm text-gray-600">{contact.email}</p>
          {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
          {contact.industry && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
              {contact.industry}
            </span>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedContact(contact)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>B2B Contact Details</DialogTitle>
              <DialogDescription>
                Business contact information and inquiry details
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      Company Name
                    </label>
                    <p className="text-gray-900">{selectedContact.companyName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Contact Person
                    </label>
                    <p className="text-gray-900">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </label>
                      <p className="text-gray-900">{selectedContact.phone}</p>
                    </div>
                  )}
                  {selectedContact.companyWebsite && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <Globe className="h-4 w-4 mr-1" />
                        Website
                      </label>
                      <p className="text-gray-900">
                        <a href={selectedContact.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedContact.companyWebsite}
                        </a>
                      </p>
                    </div>
                  )}
                  {selectedContact.industry && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Industry</label>
                      <p className="text-gray-900">{selectedContact.industry}</p>
                    </div>
                  )}
                  {selectedContact.companySize && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Size</label>
                      <p className="text-gray-900">{selectedContact.companySize}</p>
                    </div>
                  )}
                  {selectedContact.subject && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Subject</label>
                      <p className="text-gray-900">{selectedContact.subject}</p>
                    </div>
                  )}
                </div>
                {selectedContact.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Message</label>
                    <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedContact.message}
                    </p>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  <p>Received: {formatDate(selectedContact.createdAt)}</p>
                  {selectedContact.updatedAt !== selectedContact.createdAt && (
                    <p>Updated: {formatDate(selectedContact.updatedAt)}</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-2">
        {contact.subject && (
          <p className="font-medium text-gray-900 text-sm mb-1">
            {contact.subject}
          </p>
        )}
        {contact.message && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {contact.message.length > 100 
              ? contact.message.substring(0, 100) + '...' 
              : contact.message
            }
          </p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {formatDate(contact.createdAt)}
        </div>
        {contact.companySize && (
          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
            {contact.companySize}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">B2B Management</h1>
          <p className="text-gray-600 mt-1">Manage business-to-business contacts and inquiries</p>
        </div>
        <Button onClick={fetchContacts} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total B2B Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Inquiries</p>
                <p className="text-2xl font-bold text-green-600">{todayContacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Industries</p>
                <p className="text-2xl font-bold text-purple-600">{Object.keys(industryStats).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Messages</p>
                <p className="text-2xl font-bold text-orange-600">
                  {contacts.filter(c => c.message).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by company name, contact person, email, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Today's B2B Contacts */}
      {todayContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Today's B2B Inquiries ({todayContacts.length})
            </CardTitle>
            <CardDescription>
              New business inquiries received today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayContacts
                .filter(contact => {
                  const matchesSearch = 
                    (contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (contact.companyName && contact.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (contact.industry && contact.industry.toLowerCase().includes(searchTerm.toLowerCase()));
                  return matchesSearch;
                })
                .map((contact) => (
                  <ContactCard key={contact._id} contact={contact} isNew={true} />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry Breakdown */}
      {Object.keys(industryStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Industry Breakdown</CardTitle>
            <CardDescription>B2B contacts by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(industryStats).map(([industry, count]) => (
                <div key={industry} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{industry}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All B2B Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>All B2B Contacts ({filteredContacts.length})</CardTitle>
          <CardDescription>
            All business contact requests and inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard 
                key={contact._id} 
                contact={contact} 
                isNew={isToday(contact.createdAt)} 
              />
            ))}
          </div>
          {filteredContacts.length === 0 && (
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No B2B contacts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'No business inquiries have been received yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BManagement;