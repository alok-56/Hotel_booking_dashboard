import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  FileText,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
// Mock UI components for the example
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

const Button = ({ children, variant = "default", size = "default", disabled = false, onClick, className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 text-gray-700"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};



const PageSkeleton = () => (
  <div className="flex-1 p-6 bg-gray-50">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-8"></div>
      <div className="grid grid-cols-4 gap-6 mb-6">
        {Array.from({length: 4}).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded"></div>
    </div>
  </div>
);
import * as XLSX from 'xlsx';
import { getLogs } from "@/api/Services/Auth/auth";
import { useToast } from "@/hooks/use-toast";

// API function to fetch logs


const LogsManagement = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRecords: 0
  });

  // Load logs on component mount and when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs(searchTerm);
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, pagination.page]);

  const loadLogs = async (bookingSearch = '') => {
    try {
      setLoading(true);
      const response = await getLogs(bookingSearch, pagination.page, pagination.limit);
      
      if (response.success) {
        setLogs(response.data || []);
        setPagination({
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
          totalRecords: response.totalRecords
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load logs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading logs:", error);
      toast({
        title: "Error",
        description: "Failed to load logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogTypeColor = (logType) => {
    if (logType.toLowerCase().includes('creation')) return 'bg-green-100 text-green-800';
    if (logType.toLowerCase().includes('update')) return 'bg-blue-100 text-blue-800';
    if (logType.toLowerCase().includes('delete')) return 'bg-red-100 text-red-800';
    if (logType.toLowerCase().includes('payment')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Excel Export Function
  const exportToExcel = () => {
    try {
      const exportData = logs.map((log, index) => ({
        'S.No': index + 1,
        'Booking ID': log.bookingid?.slice(-8) || 'N/A',
        'Log Type': log.logtype || 'N/A',
        'User Name': log.userid?.Name || 'N/A',
        'User ID': log.userid?._id || 'N/A',
        'Description': log.description || 'No description',
        'Created At': formatDate(log.createdAt),
        'Updated At': formatDate(log.updatedAt),
        'Log ID': log._id || 'N/A'
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 8 },  // S.No
        { wch: 25 }, // Booking ID
        { wch: 30 }, // Log Type
        { wch: 15 }, // User Name
        { wch: 25 }, // User ID
        { wch: 40 }, // Description
        { wch: 20 }, // Created At
        { wch: 20 }, // Updated At
        { wch: 25 }  // Log ID
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');

      // Add summary sheet
      const summaryData = [
        { Metric: 'Total Logs', Value: pagination.totalRecords },
        { Metric: 'Current Page', Value: pagination.page },
        { Metric: 'Total Pages', Value: pagination.totalPages },
        { Metric: 'Export Date', Value: new Date().toLocaleString() },
        { Metric: 'Search Filter', Value: searchTerm || 'None' }
      ];

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `Logs-Report-${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);

    

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export logs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading && logs.length === 0) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Logs Management</h1>
        <p className="text-gray-600">View and manage system logs</p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by booking ID..."
            className="pl-10 w-80"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalRecords}</div>
            <p className="text-xs text-muted-foreground">System logs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Page</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.page}</div>
            <p className="text-xs text-muted-foreground">of {pagination.totalPages} pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Showing</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">logs on this page</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {logs.length > 0 ? formatDate(logs[0].updatedAt).split(' ')[1] : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Latest log time</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>
            All system activities and booking-related logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-medium text-gray-700">S.No</th>
                    <th className="text-left p-4 font-medium text-gray-700">Booking ID</th>
                    <th className="text-left p-4 font-medium text-gray-700">Log Type</th>
                    <th className="text-left p-4 font-medium text-gray-700">User</th>
                    <th className="text-left p-4 font-medium text-gray-700">Description</th>
                    <th className="text-left p-4 font-medium text-gray-700">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-sm">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono text-blue-600">
                          {log.bookingid?.slice(-8) || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge className={`text-xs ${getLogTypeColor(log.logtype)}`}>
                          {log.logtype || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {log.userid?.Name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {log.userid?._id || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {log.description || 'No description available'}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(log.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {logs.length === 0 && !loading && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No logs found</p>
              <p className="text-gray-400 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'No logs available at the moment'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.totalRecords)} of{' '}
                {pagination.totalRecords} entries
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsManagement;