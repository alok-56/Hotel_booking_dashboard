import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { updateAdmin } from "@/api/Services/Auth/auth";
import { getAllHotels } from "@/api/Services/Hotel/hotel";
import {
  UserCircle,
  Edit,
  Save,
  Eye,
  EyeOff,
  Building,
  Shield,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

const ProfileSection = () => {
  const { toast } = useToast();
  const { userData } = usePermissions();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        Name: userData.Name || "",
        Email: userData.Email || "",
        Password: "",
      });
    }
    loadHotels();
  }, [userData]);

  const loadHotels = async () => {
    try {
      const response = await getAllHotels();
      if (response.status) {
        setHotels(response.data || []);
      }
    } catch (error) {
      console.error("Error loading hotels:", error);
    }
  };

  const getUserHotels = () => {
    if (!userData?.Hotel) return [];
    return hotels.filter((hotel) => userData.Hotel.includes(hotel._id));
  };

  const handleSave = async () => {
    if (!userData?._id) return;

    setLoading(true);
    try {
      const updateData: any = {
        Name: formData.Name,
        Email: formData.Email,
        Permission: userData.Permission,
        Hotel: userData.Hotel,
      };

      // Only include password if it's provided
      if (formData.Password.trim()) {
        updateData.Password = formData.Password;
      }

      const response = await updateAdmin(userData._id, updateData);

      if (response.status) {
        // Update localStorage with new user data
        const updatedUserData = {
          ...userData,
          Name: formData.Name,
          Email: formData.Email,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        setEditing(false);
        setFormData((prev) => ({ ...prev, Password: "" }));

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      Name: userData?.Name || "",
      Email: userData?.Email || "",
      Password: "",
    });
    setEditing(false);
    setShowPassword(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const userHotels = getUserHotels();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        {!editing && (
          <Button onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>
                {editing
                  ? "Update your personal details"
                  : "Your account information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.Name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          Name: e.target.value,
                        }))
                      }
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.Email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          Email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      New Password (leave blank to keep current)
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.Password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Password: e.target.value,
                          }))
                        }
                        placeholder="Enter new password (optional)"
                        disabled={loading}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {userData?.Name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {userData?.Name}
                      </h3>
                      <p className="text-gray-600">{userData?.Email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Full Name
                      </Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {userData?.Name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Email Address
                      </Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {userData?.Email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Account Status
                      </Label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Member Since
                      </Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {userData?.createdAt
                          ? formatDate(userData.createdAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Permissions
              </CardTitle>
              <CardDescription>Your access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userData?.Permission?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.Permission.map((permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="text-xs"
                      >
                        {permission.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No permissions assigned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Associated Hotels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Hotels
              </CardTitle>
              <CardDescription>Hotels you have access to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userHotels.length > 0 ? (
                  userHotels.map((hotel) => (
                    <div
                      key={hotel._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{hotel.hotelName}</p>
                        <p className="text-xs text-gray-500">
                          {hotel.city}, {hotel.state}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {hotel.starRating}★
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hotels assigned</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hotels Managed</span>
                  <span className="text-sm font-medium">
                    {userHotels.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Permissions</span>
                  <span className="text-sm font-medium">
                    {userData?.Permission?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">
                    {userData?.updatedAt
                      ? formatDate(userData.updatedAt)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
