import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { updateUserProfile } from "@/lib/firebase";
import { User, Camera, Save, Mail, Phone } from "lucide-react";
import { useLocation } from "wouter";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, userProfile, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photoUrl: ''
  });

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/');
      return;
    }

    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        photoUrl: userProfile.photoUrl || ''
      });
    }
  }, [userProfile, isAuthenticated, authLoading, setLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          } else {
            reject(new Error('Failed to read file as base64'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const apiKey = 'ee4ff6776bc42710da45f222b0f15592';
      const form = new FormData();
      form.append('key', apiKey);
      form.append('image', base64);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();

      if (data?.data?.url) {
        setFormData(prev => ({
          ...prev,
          photoUrl: data.data.url
        }));

        toast({
          title: "Success!",
          description: "Profile photo uploaded successfully.",
        });
      } else {
        throw new Error('Invalid response from image server');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile photo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await updateUserProfile(user.uid, formData);

      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white rounded-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8" data-aos="fade-up">
          <h1 className="text-3xl font-bold text-gray-900 font-inter">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <Card data-aos="fade-up" data-aos-delay="100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4" data-aos="fade-up" data-aos-delay="200">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={formData.photoUrl} alt="Profile" />
                  <AvatarFallback>
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="photo" className="cursor-pointer">
                    <div className="flex items-center space-x-2 text-travel-blue hover:text-blue-700">
                      <Camera className="h-4 w-4" />
                      <span>Change Photo</span>
                    </div>
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-2" data-aos="fade-up" data-aos-delay="300">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2" data-aos="fade-up" data-aos-delay="350">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2" data-aos="fade-up" data-aos-delay="400">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full travel-blue text-white"
                data-aos="fade-up"
                data-aos-delay="450"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6" data-aos="fade-up" data-aos-delay="500">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Account Created</span>
                <span className="font-medium">
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Account Type</span>
                <span className="font-medium">
                  {userProfile?.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Email Verified</span>
                <span className="font-medium">
                  {user?.emailVerified ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
