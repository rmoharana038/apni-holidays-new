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
import { getPackages, createPackage, updatePackage, deletePackage, uploadImage } from "@/lib/firebase";
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imagePath = `package-images/${Date.now()}_${file.name}`;
      const imageUrl = await uploadImage(file, imagePath);
      
      setFormData(prev => ({
        ...prev,
        imageUrl
      }));
      
      toast({
        title: "Success!",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
                    onChange={handleImageUpload}
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
