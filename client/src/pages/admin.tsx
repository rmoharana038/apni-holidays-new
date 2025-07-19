import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Plane,
  Package,
  Users,
  IndianRupee,
  CalendarCheck,
  LogOut,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import type { UserStats, PackageStats } from "@shared/schema";
import { Footer } from "@/components/footer";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
} from "@/lib/firebase";

// -------- Package Management Tab Component --------
function PackageManagementTab() {
  const toast = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    country: "",
    duration: "",
    price: "",
    originalPrice: "",
    description: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    imageUrl: "",
    isInternational: true,
    isActive: true
  });

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line
  }, []);

  async function fetchPackages() {
    try {
      setLoading(true);
      const data = await getPackages();
      setPackages(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch packages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(pkg: any) {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title || "",
      destination: pkg.destination || "",
      country: pkg.country || "",
      duration: (pkg.duration ?? "").toString(),
      price: (pkg.price ?? "").toString(),
      originalPrice: pkg.originalPrice?.toString() || "",
      description: pkg.description || "",
      itinerary: (pkg.itinerary || []).join("\n"),
      inclusions: (pkg.inclusions || []).join("\n"),
      exclusions: (pkg.exclusions || []).join("\n"),
      imageUrl: pkg.imageUrl || "",
      isInternational: pkg.isInternational ?? true,
      isActive: pkg.isActive ?? true
    });
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      setLoading(true);
      await deletePackage(id);
      toast({
        title: "Success",
        description: "Package deleted.",
        variant: "default"
      });
      fetchPackages();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete package.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      destination: "",
      country: "",
      duration: "",
      price: "",
      originalPrice: "",
      description: "",
      itinerary: "",
      inclusions: "",
      exclusions: "",
      imageUrl: "",
      isInternational: true,
      isActive: true
    });
  }

  function openAddModal() {
    setEditingPackage(null);
    resetForm();
    setIsModalOpen(true);
  }

  async function uploadToImgbb(file: File): Promise<string> {
    const apiKey = "ee4ff6776bc42710da45f222b0f15592";
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const formData = new FormData();
    formData.append("key", apiKey);
    formData.append("image", base64);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData
    });
    if (!response.ok) throw new Error("Failed to upload image to imgbb");
    const data = await response.json();
    return data.data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const packageData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        itinerary: formData.itinerary.split("\n").filter((item) => item.trim()),
        inclusions: formData.inclusions.split("\n").filter((item) => item.trim()),
        exclusions: formData.exclusions.split("\n").filter((item) => item.trim())
      };
      if (editingPackage) {
        await updatePackage(editingPackage.id, packageData);
        toast({ title: "Success!", description: "Package updated successfully." });
      } else {
        await createPackage(packageData);
        toast({ title: "Success!", description: "Package created successfully." });
      }
      setIsModalOpen(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save package.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
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
                        {pkg.isActive ? "Active" : "Inactive"}
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

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Package" : "Add New Package"}
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
                      } catch {
                        toast({
                          title: "Upload Failed",
                          description: "Failed to upload image. Try again.",
                          variant: "destructive"
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
                  value={formData.isInternational ? "international" : "domestic"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      isInternational: value === "international"
                    }))
                  }
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
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: value === "active"
                    }))
                  }
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="travel-blue text-white"
              >
                {loading
                  ? "Saving..."
                  : editingPackage
                  ? "Update"
                  : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------- User Management Tab Component --------
function UserManagementTab() {
  const toast = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isActive: true,
    isAdmin: false
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // Replace these with your real API logic:
  async function fetchUsers() {
    return [
      {
        id: "1",
        name: "Rajesh Kumar",
        email: "rajesh4telecom@gmail.com",
        isActive: true,
        isAdmin: true
      },
      {
        id: "2",
        name: "Priya Sharma",
        email: "priya@gmail.com",
        isActive: true,
        isAdmin: false
      }
    ];
  }
  async function updateUser(id: string, updates: any) {
    // Backend update here
  }
  async function deleteUser(id: string) {
    // Backend delete here
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      toast({
        title: "Error",
        description: "Unable to fetch users.",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  function handleEdit(user: any) {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin
    });
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    try {
      await deleteUser(id);
      toast({ title: "Deleted", description: "User deleted." });
      loadUsers();
    } catch {
      toast({
        title: "Error",
        description: "Could not delete user.",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(editingUser.id, formData);
      toast({ title: "Updated", description: "User updated." });
      setIsModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.isAdmin ? "default" : "secondary"}>
                        {user.isAdmin ? "Admin" : "User"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(user.id)}
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
      {/* Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="isActive">Status</Label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === "active"
                  }))
                }
                className="block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <Label htmlFor="isAdmin">Role</Label>
              <select
                id="isAdmin"
                name="isAdmin"
                value={formData.isAdmin ? "admin" : "user"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAdmin: e.target.value === "admin"
                  }))
                }
                className="block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------- Main Admin Component --------
export default Admin;
