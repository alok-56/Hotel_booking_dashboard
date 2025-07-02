
import React, { useState } from 'react';
import { Settings, Users, ClipboardCheck, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HotelCard from './HotelCard';

interface OperationsManagementProps {
  hotels: any[];
  userRole: string;
}

const OperationsManagement: React.FC<OperationsManagementProps> = ({ hotels, userRole }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const operationalMetrics = [
    { title: 'Active Staff', value: '48', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Maintenance Tasks', value: '12', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Quality Score', value: '4.7', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Pending Issues', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  const maintenanceTasks = [
    { id: 1, room: '201', issue: 'AC not working', priority: 'High', status: 'In Progress', assignee: 'John Doe' },
    { id: 2, room: '315', issue: 'Bathroom leak', priority: 'Medium', status: 'Pending', assignee: 'Jane Smith' },
    { id: 3, room: '102', issue: 'TV remote missing', priority: 'Low', status: 'Completed', assignee: 'Mike Johnson' },
    { id: 4, room: '420', issue: 'WiFi connectivity', priority: 'High', status: 'Assigned', assignee: 'Sarah Wilson' }
  ];

  const staffSchedule = [
    { name: 'Alice Johnson', role: 'Front Desk', shift: '6 AM - 2 PM', status: 'On Duty' },
    { name: 'Bob Smith', role: 'Housekeeping', shift: '8 AM - 4 PM', status: 'On Duty' },
    { name: 'Carol Brown', role: 'Maintenance', shift: '10 AM - 6 PM', status: 'Break' },
    { name: 'David Wilson', role: 'Security', shift: '6 PM - 6 AM', status: 'Off Duty' }
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
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Assigned': return 'text-purple-600 bg-purple-100';
      case 'Pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operations Management</h1>
            <p className="text-gray-600">Monitor and manage hotel operations efficiently</p>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {operationalMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bg}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Hotel Overview' },
              { key: 'maintenance', label: 'Maintenance' },
              { key: 'staff', label: 'Staff Management' },
              { key: 'quality', label: 'Quality Control' }
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} userRole={userRole} />
            ))}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-orange-600" />
                Maintenance Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Room</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Issue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Priority</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Assignee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceTasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">#{task.room}</td>
                        <td className="py-3 px-4">{task.issue}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{task.assignee}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'staff' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Staff Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffSchedule.map((staff, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{staff.name}</h3>
                      <p className="text-sm text-gray-600">{staff.role}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{staff.shift}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        staff.status === 'On Duty' ? 'bg-green-100 text-green-800' :
                        staff.status === 'Break' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {staff.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'quality' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2 text-green-600" />
                  Quality Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: 'Room cleanliness inspection', completed: true },
                    { task: 'Amenities stock check', completed: true },
                    { task: 'Equipment functionality test', completed: false },
                    { task: 'Guest feedback review', completed: true },
                    { task: 'Safety compliance check', completed: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cleanliness Score</span>
                    <span className="font-bold text-green-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service Quality</span>
                    <span className="font-bold text-blue-600">4.6/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amenities Rating</span>
                    <span className="font-bold text-purple-600">4.5/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Score</span>
                    <span className="font-bold text-gray-900">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsManagement;
