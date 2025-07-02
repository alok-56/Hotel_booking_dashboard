
import React, { useState } from 'react';
import { Scale, FileText, Shield, AlertTriangle, CheckCircle, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LegalCompliance = () => {
  const [activeTab, setActiveTab] = useState('documents');

  const legalDocuments = [
    {
      id: 1,
      name: 'Hotel License',
      type: 'Business License',
      status: 'Active',
      expiryDate: '2025-12-31',
      issueDate: '2024-01-15',
      authority: 'Municipal Corporation',
      description: 'Primary business license for hotel operations'
    },
    {
      id: 2,
      name: 'Fire Safety Certificate',
      type: 'Safety Compliance',
      status: 'Active',
      expiryDate: '2025-06-30',
      issueDate: '2024-07-01',
      authority: 'Fire Department',
      description: 'Fire safety compliance certificate'
    },
    {
      id: 3,
      name: 'Food License (FSSAI)',
      type: 'Food Safety',
      status: 'Expiring Soon',
      expiryDate: '2025-02-28',
      issueDate: '2023-03-01',
      authority: 'FSSAI',
      description: 'Food safety and standards license'
    },
    {
      id: 4,
      name: 'Excise License',
      type: 'Liquor License',
      status: 'Active',
      expiryDate: '2025-03-31',
      issueDate: '2024-04-01',
      authority: 'Excise Department',
      description: 'License for serving alcoholic beverages'
    }
  ];

  const complianceChecklist = [
    { item: 'Guest Registration Records', completed: true, required: true },
    { item: 'Staff Background Verification', completed: true, required: true },
    { item: 'Fire Safety Equipment Check', completed: false, required: true },
    { item: 'Health & Safety Training', completed: true, required: true },
    { item: 'Data Privacy Policy', completed: false, required: true },
    { item: 'Insurance Coverage', completed: true, required: true },
    { item: 'Tax Compliance', completed: true, required: true },
    { item: 'Environmental Clearance', completed: true, required: false }
  ];

  const policyDocuments = [
    {
      name: 'Privacy Policy',
      lastUpdated: '2024-12-15',
      version: '2.1',
      status: 'Current'
    },
    {
      name: 'Terms of Service',
      lastUpdated: '2024-11-20',
      version: '1.8',
      status: 'Current'
    },
    {
      name: 'Cancellation Policy',
      lastUpdated: '2024-10-10',
      version: '1.5',
      status: 'Current'
    },
    {
      name: 'Guest Code of Conduct',
      lastUpdated: '2024-09-05',
      version: '1.3',
      status: 'Current'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Expiring Soon': return 'text-orange-600 bg-orange-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      case 'Current': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isExpiringWithin30Days = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Legal & Compliance</h1>
            <p className="text-gray-600">Manage legal documents and compliance requirements</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <FileText className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Licenses</p>
                  <p className="text-2xl font-bold text-green-600">12</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold text-blue-600">92%</p>
                </div>
                <Scale className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Policy Updates</p>
                  <p className="text-2xl font-bold text-purple-600">4</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'documents', label: 'Legal Documents' },
              { key: 'compliance', label: 'Compliance Checklist' },
              { key: 'policies', label: 'Policies' },
              { key: 'audit', label: 'Audit Trail' }
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
        {activeTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Legal Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legalDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                          {isExpiringWithin30Days(doc.expiryDate) && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Renewal Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <div className="font-medium text-gray-900">{doc.type}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Authority:</span>
                            <div className="font-medium text-gray-900">{doc.authority}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Issue Date:</span>
                            <div className="font-medium text-gray-900">{doc.issueDate}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Expiry Date:</span>
                            <div className={`font-medium ${isExpiringWithin30Days(doc.expiryDate) ? 'text-orange-600' : 'text-gray-900'}`}>
                              {doc.expiryDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'compliance' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Compliance Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecklist.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                    item.completed ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-500' : 'bg-orange-400'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.item}</div>
                        <div className="text-sm text-gray-600">
                          {item.required ? 'Required' : 'Optional'} • 
                          {item.completed ? ' Completed' : ' Pending'}
                        </div>
                      </div>
                    </div>
                    {!item.completed && (
                      <Button variant="outline" size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'policies' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Hotel Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyDocuments.map((policy, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(policy.status)}`}>
                          v{policy.version}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Last updated: {policy.lastUpdated}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'audit' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-5 w-5 mr-2 text-gray-600" />
                Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'License Renewed', item: 'Fire Safety Certificate', user: 'Admin User', date: '2025-01-15 10:30 AM', type: 'renewal' },
                  { action: 'Document Uploaded', item: 'Insurance Policy', user: 'Manager', date: '2025-01-12 02:15 PM', type: 'upload' },
                  { action: 'Policy Updated', item: 'Privacy Policy', user: 'Legal Team', date: '2025-01-10 09:45 AM', type: 'update' },
                  { action: 'Compliance Check', item: 'Staff Verification', user: 'HR Manager', date: '2025-01-08 11:20 AM', type: 'check' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        log.type === 'renewal' ? 'bg-green-400' :
                        log.type === 'upload' ? 'bg-blue-400' :
                        log.type === 'update' ? 'bg-purple-400' :
                        'bg-orange-400'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {log.action}: {log.item}
                        </div>
                        <div className="text-sm text-gray-600">
                          By {log.user} • {log.date}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LegalCompliance;
