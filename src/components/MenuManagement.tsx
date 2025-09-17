import React, { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PageSkeleton, CardSkeleton, StatsCardSkeleton } from "./SkeletonLoader";
import * as XLSX from 'xlsx';

// Import your API functions (adjust the path as needed)
import {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  getAllHotels,
} from "@/api/Services/Hotel/hotel";

const MenuManagement = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    hotelId: "",
    menuname: "",
    price: "",
    category: "Main Course",
    isavailable: true,
  });

  const categories = [
    "All",
    "Breakfast",
    "Main Course",
    "Salads",
    "Desserts",
    "Beverages",
  ];

  // Load data on component mount
  useEffect(() => {
    loadMenus();
    loadHotels();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await getAllMenus();
      if (response.status) {
        setMenuItems(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load menus",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading menus:", error);
      toast({
        title: "Error",
        description: "Failed to load menus. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadHotels = async () => {
    try {
      const response = await getAllHotels();
      if (response.status) {
        setHotels(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load hotels",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading hotels:", error);
      toast({
        title: "Error",
        description: "Failed to load hotels. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateMenu = async () => {
    try {
      const payload = {
        hotelId: formData.hotelId,
        menuname: formData.menuname,
        price: Number(formData.price),
        isavailable: formData.isavailable,
        category: formData.category,
      };

      const response = await createMenu(payload);
      if (response.status) {
        loadMenus(); // Refresh the menu list
        resetForm();
        setIsModalOpen(false);
        toast({
          title: "Success",
          description: "Menu item created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create menu item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating menu:", error);
      toast({
        title: "Error",
        description: "Failed to create menu item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu) return;

    try {
      const payload = {
        hotelId: formData.hotelId,
        menuname: formData.menuname,
        price: Number(formData.price),
        isavailable: formData.isavailable,
        category: formData.category,
      };

      const response = await updateMenu(editingMenu._id, payload);
      if (response.status) {
        loadMenus(); 
        resetForm();
        setIsModalOpen(false);
        setEditingMenu(null);
        toast({
          title: "Success",
          description: "Menu item updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update menu item",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMenu = async (id) => {
    // Replace window.confirm with a more elegant confirmation
    const confirmed = window.confirm("Are you sure you want to delete this menu item?");
    if (confirmed) {
      try {
        const response = await deleteMenu(id);
        if (response.status) {
          loadMenus(); 
          toast({
            title: "Success",
            description: "Menu item deleted successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to delete menu item",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting menu:", error);
        toast({
          title: "Error",
          description: "Failed to delete menu item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hotelId: "",
      menuname: "",
      price: "",
      category: "Main Course",
      isavailable: true,
    });
  };

  const openEditModal = (menu) => {
    setEditingMenu(menu);
    setFormData({
      hotelId: menu.hotelId || "",
      menuname: menu.menuname || "",
      price: menu.price?.toString() || "",
      category: menu.category || "Main Course",
      isavailable: menu.isavailable !== undefined ? menu.isavailable : true,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingMenu(null);
    resetForm();
    setIsModalOpen(true);
  };

  const filteredMenus = menuItems.filter((menu) => {
    const matchesSearch =
      menu.menuname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotels
        .find((h) => h._id === menu.hotelId)
        ?.name?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || menu.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getHotelName = (hotelId) => {
    const hotel = hotels.find((h) => h._id === hotelId);
    return hotel?.name || hotel?.hotelName || "Unknown Hotel";
  };

  // Excel Export Function
  const exportToExcel = () => {
    try {
      // Prepare data for Excel export
      const exportData = filteredMenus.map((item, index) => ({
        'S.No': index + 1,
        'Menu Name': item.menuname || 'N/A',
        'Hotel Name': getHotelName(item.hotelId),
        'Category': item.category || 'N/A',
        'Price (₹)': item.price || 0,
        'Availability': item.isavailable === false ? 'Out of Stock' : 'Available',
        'Description': item.description || 'No description available',
        'Hotel ID': item.hotelId || 'N/A',
        'Menu ID': item._id || 'N/A'
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 8 },  // S.No
        { wch: 25 }, // Menu Name
        { wch: 20 }, // Hotel Name
        { wch: 15 }, // Category
        { wch: 12 }, // Price
        { wch: 15 }, // Availability
        { wch: 30 }, // Description
        { wch: 15 }, // Hotel ID
        { wch: 15 }  // Menu ID
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Menu Items');

      // Add summary sheet with statistics
      const summaryData = [
        { Metric: 'Total Menu Items', Value: menuItems.length },
        { Metric: 'Available Items', Value: menuItems.filter(item => item.isavailable !== false).length },
        { Metric: 'Out of Stock Items', Value: menuItems.filter(item => item.isavailable === false).length },
        { Metric: 'Average Price (₹)', Value: Math.round(menuItems.reduce((sum, item) => sum + (item.price || 0), 0) / (menuItems.length || 1)) },
        { Metric: 'Total Hotels', Value: hotels.length },
        { Metric: 'Export Date', Value: new Date().toLocaleString() },
        { Metric: 'Filter Applied', Value: selectedCategory === 'All' ? 'None' : selectedCategory },
        { Metric: 'Search Term', Value: searchTerm || 'None' }
      ];

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const categoryFilter = selectedCategory === 'All' ? 'All-Categories' : selectedCategory.replace(/\s+/g, '-');
      const filename = `Menu-Report-${categoryFilter}-${timestamp}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, filename);

      toast({
        title: "Export Successful",
        description: `Menu data exported to ${filename}`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export menu data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(
    (item) => item.isavailable !== false
  ).length;
  const outOfStockItems = totalItems - availableItems;
  const avgPrice =
    totalItems > 0
      ? Math.round(
          menuItems.reduce((sum, item) => sum + (item.price || 0), 0) /
            totalItems
        )
      : 0;

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-gray-600">Manage restaurant menus and food items</p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Menu items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {availableItems}
            </div>
            <p className="text-xs text-muted-foreground">Ready to serve</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockItems}
            </div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{avgPrice}</div>
            <p className="text-xs text-muted-foreground">Per item</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : filteredMenus.map((item) => (
          <Card key={item._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.menuname}</CardTitle>
                  <CardDescription>
                    {getHotelName(item.hotelId)}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    item.isavailable === false ? "destructive" : "default"
                  }
                >
                  {item.isavailable === false ? "Out of Stock" : "Available"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Category</span>
                  <Badge variant="outline">
                    {item.category || "Main Course"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="text-lg font-bold text-green-600">
                    ₹{item.price}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Description</span>
                  <p className="text-sm text-gray-800 mt-1">
                    {item.description || "No description available"}
                  </p>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditModal(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteMenu(item._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMenus.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No menu items found.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingMenu ? "Edit Menu Item" : "Create New Menu Item"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hotel</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.hotelId}
                  onChange={(e) =>
                    setFormData({ ...formData, hotelId: e.target.value })
                  }
                >
                  <option value="">Select Hotel</option>
                  {hotels &&
                    hotels.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.hotelName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Menu Name
                </label>
                <Input
                  value={formData.menuname}
                  onChange={(e) =>
                    setFormData({ ...formData, menuname: e.target.value })
                  }
                  placeholder="Enter menu name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Availability
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isavailable"
                    checked={formData.isavailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isavailable: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="isavailable" className="text-sm">
                    Available for ordering
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={editingMenu ? handleUpdateMenu : handleCreateMenu}
                disabled={
                  !formData.hotelId || !formData.menuname || !formData.price
                }
              >
                {editingMenu ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;