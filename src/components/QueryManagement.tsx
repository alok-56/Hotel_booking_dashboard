import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Eye, Search, Calendar, Mail, User, Phone } from 'lucide-react';
import { getContactus } from '@/api/Services/Website/web';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}



const ContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await getContactus();
      
      // Ensure data is an array
      if (res.status) {
        setContacts(res.data);
        setError(null);
      } else {
       
        setContacts([]);
      }
    } catch (err) {
      setError('Failed to fetch contacts. Please check your network connection.');
      console.error('Error fetching contacts:', err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = Array.isArray(contacts) ? contacts.filter(contact => {
    const matchesSearch = 
      contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const getPastContacts = () => {
    if (!Array.isArray(contacts)) return [];
    return contacts.filter(contact => !isToday(contact.createdAt));
  };

  const todayContacts = getTodayContacts();
  const pastContacts = getPastContacts();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
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

  const ContactCard = ({ contact, isNew = false }: { contact: Contact; isNew?: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
            {isNew && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{contact.email}</p>
          {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
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
              <DialogTitle>Contact Details</DialogTitle>
              <DialogDescription>
                Customer contact information and message
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Name
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
                  <div>
                    <label className="text-sm font-medium text-gray-600">Subject</label>
                    <p className="text-gray-900">{selectedContact.subject || 'No subject'}</p>
                  </div>
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
        <p className="font-medium text-gray-900 text-sm">
          {contact.subject || 'No subject'}
        </p>
        {contact.message && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {contact.message.length > 100 
              ? contact.message.substring(0, 100) + '...' 
              : contact.message
            }
          </p>
        )}
      </div>
      <div className="text-xs text-gray-500">
        {formatDate(contact.createdAt)}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
          <p className="text-gray-600 mt-1">Manage customer inquiries and contact requests</p>
        </div>
        <Button onClick={fetchContacts} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
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
                <p className="text-sm font-medium text-gray-600">Today's Contacts</p>
                <p className="text-2xl font-bold text-green-600">{todayContacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Past Contacts</p>
                <p className="text-2xl font-bold text-orange-600">{pastContacts.length}</p>
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
              placeholder="Search contacts by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Today's Contacts */}
      {todayContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Today's Contacts ({todayContacts.length})
            </CardTitle>
            <CardDescription>
              New inquiries received today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayContacts
                .filter(contact => {
                  const matchesSearch = 
                    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()));
                  return matchesSearch;
                })
                .map((contact) => (
                  <ContactCard key={contact._id} contact={contact} isNew={true} />
                ))}
            </div>
            {todayContacts.filter(contact => {
              const matchesSearch = 
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()));
              return matchesSearch;
            }).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found for today</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No contact requests received today.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({filteredContacts.length})</CardTitle>
          <CardDescription>
            All customer contact requests
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
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'No contact requests have been received yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManagement;