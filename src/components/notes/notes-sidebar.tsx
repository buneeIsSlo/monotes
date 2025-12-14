"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PinLeftIcon, PlusIcon } from "@radix-ui/react-icons";
import { User, LogOut, Search } from "lucide-react";
import { createNewNote } from "@/lib/local-notes";
import { getDB } from "@/lib/local-db";
import { useLiveQuery } from "dexie-react-hooks";
import { generateSlug } from "@/lib/ids";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useNoteSync } from "@/contexts/note-sync-context";
import { cn } from "@/lib/utils";

export default function NotesSidebar() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.user.currentUser);
  const { syncNow } = useNoteSync();

  // Use Dexie's liveQuery for automatic reactivity
  const notes =
    useLiveQuery(
      () => getDB().notes.orderBy("updatedAt").reverse().toArray(),
      []
    ) || [];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const onCreateNew = async () => {
    const slug = generateSlug();
    const note = await createNewNote(slug);
    router.push(`/${note.id}`);
  };

  const onSearch = () => {
    // TODO: Implement search functionality
    console.log("Search clicked");
  };

  const userEmail = currentUser?.email || null;
  const currentNoteId = pathname?.replace(/^\//, "") || null;

  const handleNoteClick = async (
    e: MouseEvent<HTMLAnchorElement>,
    targetNoteId: string
  ) => {
    // Get current note ID from pathname
    const currentNoteIdFromPath = pathname?.replace(/^\//, "") || null;

    // If clicking a different note and sync function exists, sync before navigating
    if (
      currentNoteIdFromPath &&
      targetNoteId !== currentNoteIdFromPath &&
      syncNow
    ) {
      e.preventDefault(); // Prevent Link navigation
      try {
        await syncNow();
      } catch (error) {
        console.error("Sync failed before navigation:", error);
      }
      // Navigate after sync completes
      router.push(`/${targetNoteId}`);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-1.5 py-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <PinLeftIcon className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Monotes</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onCreateNew}>
                  <PlusIcon className="size-4 mr-2" />
                  <span>New Note</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSearch}>
                  <Search className="size-4 mr-2" />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground">
            Notes
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {notes.map((n) => (
                <SidebarMenuItem key={n.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/${n.id}`}
                      onClick={(e) => handleNoteClick(e, n.id)}
                      className={cn(
                        "[&:hover_span]:text-foreground group",
                        currentNoteId === n.id &&
                          "bg-accent [&>span]:text-foreground border"
                      )}
                    >
                      <span className="truncate text-sidebar-foreground/70 transition-colors">
                        {n.content?.trim()
                          ? (n.content.trim().match(/[^\s\n]+/g) || [])
                              .slice(0, 20)
                              .join(" ")
                          : n.id}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {notes.length === 0 && (
                <div className="text-xs text-muted-foreground px-2 py-1.5">
                  No notes yet.
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="py-4 border-t border-secondary">
        <Unauthenticated>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </Button>
            <p className="text-xs text-muted-foreground px-2">
              Sign in to sync notes to the cloud
            </p>
          </div>
        </Unauthenticated>
        <Authenticated>
          {currentUser && (
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-center size-8 rounded-full bg-sidebar-accent shrink-0">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs text-muted-foreground">
                    Signed In as
                  </span>
                  <span
                    className="text-sm font-medium truncate text-ellipsis"
                    title={userEmail || "User"}
                  >
                    {userEmail || "User"}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                title="Sign out"
                className="size-8 shrink-0"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut className="size-4 text-destructive" />
              </Button>
            </div>
          )}
        </Authenticated>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
