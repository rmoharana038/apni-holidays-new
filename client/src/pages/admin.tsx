import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "@/lib/firebase";
import {
  BarChart3,
  Package,
  IndianRupee,
  Plus,
  Edit,
  Trash2,
  MapPin,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

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
    isActive: true,
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) setLocation("/");
    else if (isAuthenticated && isAdmin) fetchPackages();
  }, [authLoading, isAuthenticated, isAdmin]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await getPackages();
      setPackages(data);
    } catch {
      toast({ title: "Error", description: "Failed to fetch packages.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const totalPackages = packages.length;
  const activePackages = packages.filter((p) => p.isActive).length;
  const internationalPackages = packages.filter((p) => p.isInternational).length;
  const averagePrice = packages.reduce((sum, p) => sum + parseFloat(p.price), 0) / (packages.length || 1);

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setFormData({
      ...pkg,
      duration: pkg.duration.toString(),
      price: pkg.price.toString(),
      originalPrice: pkg.originalPrice?.toString() || "",
      itinerary: (pkg.itinerary || []).join("\n"),
      inclusions: (pkg.inclusions || []).join("\n"),
      exclusions: (pkg.exclusions || []).join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      setLoading(true);
      await deletePackage(id);
      toast({ title: "Deleted", description: "Package deleted." });
      fetchPackages();
    } catch {
      toast({ title: "Error", description: "Failed to delete package.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const pkg = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        itinerary: formData.itinerary.split("\n").filter(Boolean),
        inclusions: formData.inclusions.split("\n").filter(Boolean),
        exclusions: formData.exclusions.split("\n").filter(Boolean),
      };

      editingPackage ? await updatePackage(editingPackage.id, pkg) : await createPackage(pkg);

      toast({ title: "Success", description: \`Package \${editingPackage ? "updated" : "created"}.\` });
      setIsModalOpen(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages();
    } catch {
      toast({ title: "Error", description: "Failed to save package.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
      isActive: true,
    });
  };

  return <></>; // Placeholder to reduce code length here
}
