import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getPackages, createPackage, updatePackage, deletePackage } from "@/lib/firebase";
import { 
  BarChart3, 
  Package, 
  Users, 
  IndianRupee, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { userProfile, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    country: '',
    duration: '',
    price: '',
    originalPrice: '',
    description: '',
    itinerary: '',
    inclusions: '',
    exclusions: '',
    imageUrl: '',
    isInternational: true,
    isActive: true
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation('/');
      return;
    }

    if (isAuthenticated && isAdmin) {
      fetchPackages();
    }
  }, [isAuthenticated, isAdmin, authLoading, setLocation]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const packagesData = await getPackages();
      setPackages(packagesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch packages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

async function uploadToImgbb(file: File): Promise<string> {
  const apiKey = 'ee4ff6776bc42710da45f222b0f15592';

  // Convert file to base64 string
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1]; // strip data: prefix
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('image', base64);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to imgbb');
  }

  const data = await response.json();
  return data.data.url;
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const packageData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        itinerary: formData.itinerary.split('\n').filter(item => item.trim()),
        inclusions: formData.inclusions.split('\n').filter(item => item.trim()),
        exclusions: formData.exclusions.split('\n').filter(item => item.trim()),
      };

      if (editingPackage) {
        await updatePackage(editingPackage.id, packageData);
        toast({
          title: "Success!",
          description: "Package updated successfully.",
        });
      } else {
        await createPackage(packageData);
        toast({
          title: "Success!",
          description: "Package created successfully.",
        });
      }

      setIsModalOpen(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save package.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      destination: pkg.destination,
      country: pkg.country,
      duration: pkg.duration.toString(),
      price: pkg.price.toString(),
      originalPrice: pkg.originalPrice?.toString() || '',
      description: pkg.description,
      itinerary: pkg.itinerary?.join('\n') || '',
      inclusions: pkg.inclusions?.join('\n') || '',
      exclusions: pkg.exclusions?.join('\n') || '',
      imageUrl: pkg.imageUrl,
      isInternational: pkg.isInternational,
      isActive: pkg.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      setLoading(true);
      await deletePackage(id);
      toast({
        title: "Success!",
        description: "Package deleted successfully.",
      });
      fetchPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete package.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      destination: '',
      country: '',
      duration: '',
      price: '',
      originalPrice: '',
      description: '',
      itinerary: '',
      inclusions: '',
      exclusions: '',
      imageUrl: '',
      isInternational: true,
      isActive: true
    });
  };

  const openAddModal = () => {
    setEditingPackage(null);
    resetForm();
    setIsModalOpen(true);
  };

  // Stats calculations
  const totalPackages = packages.length;
  const activePackages = packages.filter(pkg => pkg.isActive).length;
  const internationalPackages = packages.filter(pkg => pkg.isInternational).length;
  const averagePrice = packages.reduce((sum, pkg) => sum + parseFloat(pkg.price), 0) / packages.length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-12 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-inter">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your travel packages and business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPackages}</p>
                </div>
                <div className="w-12 h-12 bg-[var(--travel-blue)] rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Packages</p>
                  <p className="text-2xl font-bold text-gray-900">{activePackages}</p>
                </div>
                <div className="w-12 h-12 bg-[var(--tropical-green)] rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">International</p>
                  <p className="text-2xl font-bold text-gray-900">{internationalPackages}</p>
                </div>
                <div className="w-12 h-12 bg-[var(--sunset-orange)] rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{averagePrice ? Math.round(averagePrice).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Package Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Package Management</CardTitle>
              <Button onClick={openAddModal} className="travel-blue text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Package
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Package</th>
                    <th className="text-left py-3 px-4">Destination</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <img 
                            src={pkg.imageUrl} 
                            alt={pkg.title}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <div className="font-medium">{pkg.title}</div>
                            <div className="text-sm text-gray-500">{pkg.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{pkg.destination}</td>
                      <td className="py-3 px-4">{pkg.duration} Days</td>
                      <td className="py-3 px-4">₹{parseInt(pkg.price).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant={pkg.isActive ? "default" : "secondary"}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(pkg)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(pkg.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Package Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Package Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Package Image</Label>
                <div className="space-y-2">
                  <Input
  id="image"
  type="file"
  accept="image/*"
  onChange={async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const url = await uploadToImgbb(e.target.files[0]);
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      } catch (err) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Try again.",
          variant: "destructive",
        });
      }
    }
  }}
/>
                  {formData.imageUrl && (
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="isInternational">Package Type</Label>
                  <Select 
                    value={formData.isInternational ? 'international' : 'domestic'}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      isInternational: value === 'international'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="domestic">Domestic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <Select 
                    value={formData.isActive ? 'active' : 'inactive'}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      isActive: value === 'active'
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="itinerary">Itinerary (one item per line)</Label>
                <Textarea
                  id="itinerary"
                  name="itinerary"
                  value={formData.itinerary}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Day 1: Arrival and city tour&#10;Day 2: Beach activities&#10;Day 3: Cultural sites visit"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inclusions">Inclusions (one item per line)</Label>
                  <Textarea
                    id="inclusions"
                    name="inclusions"
                    value={formData.inclusions}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Accommodation&#10;Meals&#10;Transportation"
                  />
                </div>
                <div>
                  <Label htmlFor="exclusions">Exclusions (one item per line)</Label>
                  <Textarea
                    id="exclusions"
                    name="exclusions"
                    value={formData.exclusions}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Personal expenses&#10;Optional activities&#10;Travel insurance"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="travel-blue text-white">
                  {loading ? 'Saving...' : editingPackage ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserManagementTab } from "@/components/admin/user-management-tab";
import { PackageManagementTab } from "@/components/admin/package-management-tab";
import { useToast } from "@/hooks/use-toast";
import { 
  Plane, 
  Package, 
  Users, 
  IndianRupee, 
  CalendarCheck,
  LogOut 
} from "lucide-react";
import type { UserStats, PackageStats } from "@shared/schema";

// Mock admin check - replace with real authentication
const useAuth = () => {
  return {
    isAuthenticated: true,
    isAdmin: true,
    loading: false,
    userProfile: {
      name: "Rajesh Kumar",
      email: "rajesh4telecom@gmail.com",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40"
    }
  };
};

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      setLocation('/');
      return;
    }
  }, [isAuthenticated, isAdmin, authLoading, setLocation]);

  // Fetch dashboard stats
  const { data: userStats } = useQuery<UserStats>({
    queryKey: ["/api/users/stats"],
    queryFn: async () => {
      const response = await fetch("/api/users/stats");
      if (!response.ok) throw new Error("Failed to fetch user stats");
      return response.json();
    }
  });

  const { data: packageStats } = useQuery<PackageStats>({
    queryKey: ["/api/packages/stats"],
    queryFn: async () => {
      const response = await fetch("/api/packages/stats");
      if (!response.ok) throw new Error("Failed to fetch package stats");
      return response.json();
    }
  });

  const handleLogout = () => {
    // Implement logout logic
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    setLocation('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Plane className="text-blue-500 text-2xl mr-3" />
              <span className="text-2xl font-bold text-slate-800">Apni Holidays</span>
              <span className="ml-3 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Admin</span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={userProfile?.photoUrl} />
                  <AvatarFallback>
                    {userProfile?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-700">
                    {userProfile?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {userProfile?.email || "admin@apniholidays.com"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-slate-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage packages, users, and monitor your travel business</p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Packages</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {packageStats?.total || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {userStats?.total || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-slate-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">₹0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Card className="overflow-hidden">
          <Tabs defaultValue="packages" className="w-full">
            <div className="border-b border-slate-200 px-6">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="packages" 
                  className="flex items-center justify-start py-4 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent bg-transparent rounded-none"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Package Management
                </TabsTrigger>
                <TabsTrigger 
                  value="users"
                  className="flex items-center justify-start py-4 px-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent bg-transparent rounded-none"
                >
                  <Users className="w-4 h-4 mr-2" />
                  User Management
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="packages" className="p-0 m-0">
              <PackageManagementTab />
            </TabsContent>

            <TabsContent value="users" className="p-0 m-0">
              <UserManagementTab />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-500">
              © 2024 Apni Holidays Admin Panel. All rights reserved.
            </div>
            <div className="text-sm text-slate-500 mt-2 md:mt-0">
              Version 2.1.0 | Last updated: July 19, 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
