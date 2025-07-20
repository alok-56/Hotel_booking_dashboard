import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Search, Filter, TrendingDown, TrendingUp, Edit, FileText, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createExpense, deleteExpense, getAllExpenses, getExpenseStatistics, updateExpense, updateExpenseStatus } from '@/api/Services/Expence/expence';
import { getAllHotels } from '@/api/Services/Hotel/hotel';

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [statistics, setStatistics] = useState({
    totalAmount: 0,
    totalExpenses: 0,
    averageAmount: 0,
    categoryBreakdown: [],
    paymentMethodBreakdown: []
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    hotelId: '',
    paymentMethod: '',
    month: '',
    year: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalExpenses: 0,
    limit: 10
  });
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    expenseName: '',
    hotelId: '',
    category: 'Other',
    amount: '',
    paymentMethod: 'Cash',
    expenseDate: new Date().toISOString().split('T')[0],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    notes: '',
    status: 'Approved'
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, [pagination.currentPage, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Create query params from filters - only include non-empty values
      const queryParams = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value && value !== '') acc[key] = value;
        return acc;
      }, {});

      // Add pagination params
      queryParams.page = pagination.currentPage;
      queryParams.limit = pagination.limit;

      // Load expenses
      const expensesResponse = await getAllExpenses(queryParams);
      if (expensesResponse.status) {
        setExpenses(expensesResponse.data || []);
        if (expensesResponse.pagination) {
          setPagination(prev => ({
            ...prev,
            ...expensesResponse.pagination
          }));
        }
      }

      // Load statistics
      const statsResponse = await getExpenseStatistics();
      if (statsResponse.status) {
        setStatistics(statsResponse.data || {});
      }

      // Load hotels if not already loaded
      if (hotels.length === 0) {
        const hotelsResponse = await getAllHotels();
        if (hotelsResponse.status) {
          setHotels(hotelsResponse.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for new/edit expense
  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        month: parseInt(newExpense.month),
        year: parseInt(newExpense.year)
      };

      let response;
      if (editingExpense) {
        response = await updateExpense(editingExpense._id, expenseData);
      } else {
        response = await createExpense(expenseData);
      }

      if (response.status) {
        setShowAddExpenseModal(false);
        setEditingExpense(null);
        resetForm();
        loadData();
      } else {
        alert(response.message || 'Error saving expense');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense');
    }
  };

  const resetForm = () => {
    setNewExpense({
      expenseName: '',
      hotelId: '',
      category: 'Other',
      amount: '',
      paymentMethod: 'Cash',
      expenseDate: new Date().toISOString().split('T')[0],
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      notes: '',
      status: 'Approved'
    });
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      expenseName: expense.expenseName || '',
      hotelId: expense.hotelId?._id || expense.hotelId || '',
      category: expense.category || 'Other',
      amount: expense.amount?.toString() || '',
      paymentMethod: expense.paymentMethod || 'Cash',
      expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split('T')[0] : '',
      month: expense.month || new Date().getMonth() + 1,
      year: expense.year || new Date().getFullYear(),
      notes: expense.notes || '',
      status: expense.status || 'Approved'
    });
    setShowAddExpenseModal(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await deleteExpense(id);
        if (response.status) {
          loadData();
        } else {
          alert(response.message || 'Error deleting expense');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateExpenseStatus(id, status);
      if (response.status) {
        loadData();
      } else {
        alert(response.message || 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Calculate status-based statistics from current expenses
  const getApprovedAmount = () => {
    return expenses
      .filter(expense => expense.status === 'Approved')
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  };

  const getPendingAmount = () => {
    return expenses
      .filter(expense => expense.status === 'Pending')
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  };

  const getRejectedAmount = () => {
    return expenses
      .filter(expense => expense.status === 'Rejected')
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  };

  const getTotalAmount = () => {
    return expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      hotelId: '',
      paymentMethod: '',
      month: '',
      year: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading expenses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
        <p className="text-gray-600">Track and manage all hotel expenses</p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search expenses..." 
              className="pl-10 w-64"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        
          
          <select 
            className="px-3 py-2 border rounded-md"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select 
            className="px-3 py-2 border rounded-md"
            value={filters.hotelId}
            onChange={(e) => handleFilterChange('hotelId', e.target.value)}
          >
            <option value="">All Hotels</option>
            {hotels.map(hotel => (
              <option key={hotel._id} value={hotel._id}>{hotel.hotelName}</option>
            ))}
          </select>

          {/* <select 
            className="px-3 py-2 border rounded-md"
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
          >
            <option value="">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Cheque">Cheque</option>
          </select> */}

          {Object.values(filters).some(filter => filter !== '') && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        
        <Button onClick={() => { resetForm(); setShowAddExpenseModal(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Date Range Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input 
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input 
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <select 
            className="px-3 py-2 border rounded-md"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <select 
            className="px-3 py-2 border rounded-md"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Expense Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalAmount())}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(getApprovedAmount())}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((getApprovedAmount() / (getTotalAmount() || 1)) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(getPendingAmount())}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((getPendingAmount() / (getTotalAmount() || 1)) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(getRejectedAmount())}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((getRejectedAmount() / (getTotalAmount() || 1)) * 100)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Track and manage your hotel expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Hotel</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Payment</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? expenses.map((expense) => (
                  <tr key={expense._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{expense.expenseName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{expense.category}</Badge>
                    </td>
                    <td className="py-3 px-4">{expense.hotelId?.name || expense.hotelId?.hotelName || 'N/A'}</td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(expense.amount)}</td>
                    <td className="py-3 px-4">
                      {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">{expense.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <select
                        className={`px-2 py-1 rounded text-sm border ${getStatusColor(expense.status)}`}
                        value={expense.status}
                        onChange={(e) => handleStatusChange(expense._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-gray-500">
                      No expenses found. Try adjusting your filters or add a new expense.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalExpenses)} of {pagination.totalExpenses} expenses
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expense Name*</label>
                  <Input
                    required
                    value={newExpense.expenseName}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, expenseName: e.target.value }))}
                    placeholder="Enter expense name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel*</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={newExpense.hotelId}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, hotelId: e.target.value }))}
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel._id} value={hotel._id}>{hotel.hotelName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category*</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Utilities">Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Rent">Rent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount*</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Method*</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    value={newExpense.paymentMethod}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date*</label>
                  <Input
                    required
                    type="date"
                    value={newExpense.expenseDate}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setNewExpense(prev => ({ 
                        ...prev, 
                        expenseDate: e.target.value,
                        month: date.getMonth() + 1,
                        year: date.getFullYear()
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={newExpense.status}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  rows="3"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any additional notes"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddExpenseModal(false);
                    setEditingExpense(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmitExpense}>
                  {editingExpense ? 'Update' : 'Create'} Expense
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;