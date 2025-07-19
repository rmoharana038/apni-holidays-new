import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertUserSchema, updateUserSchema } from "@shared/schema";
import type { User } from "@shared/schema";
import { z } from "zod";

const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  isAdmin: z.boolean(),
  isActive: z.boolean(),
  password: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  isCreate?: boolean;
}

export function UserEditDialog({ user, isOpen, onClose, isCreate = false }: UserEditDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      photoUrl: "",
      isAdmin: false,
      isActive: true,
      password: "",
    },
  });

  useEffect(() => {
    if (user && !isCreate) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        photoUrl: user.photoUrl || "",
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        password: "",
      });
    } else if (isCreate) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        photoUrl: "",
        isAdmin: false,
        isActive: true,
        password: "",
      });
    }
  }, [user, isCreate, form]);

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const userData = {
        ...data,
        phone: data.phone || undefined,
        photoUrl: data.photoUrl || undefined,
        password: data.password || "defaultpassword",
      };
      return await apiRequest("POST", "/api/users", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/stats"] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      if (!user) throw new Error("No user to update");
      const userData = {
        ...data,
        phone: data.phone || undefined,
        photoUrl: data.photoUrl || undefined,
        ...(data.password && { password: data.password }),
      };
      return await apiRequest("PATCH", `/api/users/${user.id}`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/stats"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (isCreate) {
      createUserMutation.mutate(data);
    } else {
      updateUserMutation.mutate(data);
    }
  };

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create New User" : "Edit User"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              {...form.register("name")}
              className="mt-1"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...form.register("phone")}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input
              id="photoUrl"
              {...form.register("photoUrl")}
              className="mt-1"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {isCreate && (
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                className="mt-1"
                placeholder="Enter password"
              />
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Switch
              id="isAdmin"
              checked={form.watch("isAdmin")}
              onCheckedChange={(checked) => form.setValue("isAdmin", checked)}
            />
            <Label htmlFor="isAdmin">Admin Role</Label>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active Status</Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isLoading ? "Saving..." : isCreate ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
