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

export default function Admin() {
  const [, setLocation] = useLocation();
  const { userProfile, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

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
