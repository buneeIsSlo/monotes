"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { User, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function GeneralSettings() {
  const currentUser = useQuery(api.user.currentUser);
  const updateUserName = useMutation(api.user.updateUserName);
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize name from user data
  useEffect(() => {
    if (currentUser?.name) {
      setName(currentUser.name);
      setHasChanges(false);
    }
  }, [currentUser?.name]);

  // Check if name has changed from original
  useEffect(() => {
    if (currentUser?.name !== undefined) {
      setHasChanges(name.trim() !== (currentUser.name || "").trim());
    }
  }, [name, currentUser?.name]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    // Validation
    if (trimmedName.length === 0) {
      toast.error("Name cannot be empty");
      return;
    }
    if (trimmedName.length > 100) {
      toast.error("Name must be 100 characters or less");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserName({ name: trimmedName });
      toast.success("Name updated successfully");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update name:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update name. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while user data is loading
  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show message if user is not authenticated
  if (currentUser === null) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-1">Profile</h3>
          <p className="text-xs text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <Empty className="border-none bg-secondary/50 dark:bg-card/50">
          <EmptyMedia variant="icon" className="border">
            <User className="size-5" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Sign in Required</EmptyTitle>
            <EmptyDescription>
              Please sign in to manage your account settings and sync your notes
              across devices.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => router.push("/signin")} variant="outline">
              Go to Sign In
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const displayName =
    currentUser.name || currentUser.email?.split("@")[0] || "User";
  const email = currentUser.email || "No email";

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">Profile</h3>
          <p className="text-xs text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="rounded-lg bg-secondary border border-border/50 dark:bg-card divide-y divide-border/50">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-4 p-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-sidebar-accent shrink-0 overflow-hidden border-2 border-border/50">
              {currentUser.image ? (
                <Image
                  src={currentUser.image}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                Profile Picture
              </p>
              <p className="text-sm text-muted-foreground">
                Profile pictures are managed by your authentication provider.
              </p>
            </div>
          </div>

          {/* Email Section */}
          <div className="p-4 space-y-2">
            <Label htmlFor="email" className="text-xs font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-input/50 cursor-not-allowed"
            />
            <p className="text-[12px] text-muted-foreground">
              Email addresses cannot be changed here.
            </p>
          </div>

          {/* Name Section */}
          <div className="p-4 space-y-2">
            <Label htmlFor="name" className="text-xs font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              className="bg-background"
              disabled={isSaving}
            />
            <p className="text-[12px] text-muted-foreground">
              This is how your name will appear in the application.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || name.trim().length === 0}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}
