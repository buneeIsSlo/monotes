"use client";

import { useEffect, useState, type MouseEvent } from "react";
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
import { Cross1Icon } from "@radix-ui/react-icons";
import { User, LogOut } from "lucide-react";
import { listNotes } from "@/lib/local-notes";
import type { NoteContent } from "@/lib/local-db";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useNoteSync } from "@/contexts/note-sync-context";
import { cn } from "@/lib/utils";

export default function NotesSidebar() {
  const [notes, setNotes] = useState<NoteContent[]>([]);
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.user.currentUser);
  const { syncNow } = useNoteSync();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const all = await listNotes();
        if (isMounted) setNotes(all);
      } catch {
        // do nuffin
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
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
        <div className="flex items-center justify-between px-2 py-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Cross1Icon className="size-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Monotes</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
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
                        {n.content?.trim() ? n.content.split("\n")[0] : n.id}
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
      <SidebarFooter className="py-4">
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
                  <span className="text-sm font-medium truncate text-ellipsis">
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
