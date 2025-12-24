"use client";

import { CounterClockwiseClockIcon, UpdateIcon } from "@radix-ui/react-icons";
import { CircleCheckBigIcon, DatabaseIcon } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SyncModal from "./sync-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NotesMetadataBarProps {
  lastEdited?: number;
  cloudStatus?: "local" | "syncing" | "synced" | "ai-enabled";
  noteId?: string;
  className?: string;
  isSyncing?: boolean;
  syncComplete?: boolean;
}

export default function NotesMetadataBar({
  lastEdited,
  cloudStatus = "local",
  noteId,
  className = "",
  isSyncing = false,
  syncComplete = false,
}: NotesMetadataBarProps) {
  const router = useRouter();
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const formatLastEdited = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, "0");
      const month = date
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase();
      const year = date.getFullYear().toString().slice(-2);
      const time = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return `${time} · ${day}-${month}-${year}`;
    } catch {
      return "unknown";
    }
  };

  return (
    <React.Fragment>
      <div
        className={`flex items-center justify-between text-xs text-muted-foreground px-2 py-4 ${className}`}
      >
        <div
          className="flex items-center gap-2"
          title="Last Edited"
          aria-label="last edited"
        >
          <CounterClockwiseClockIcon className="size-3" />
          <span>{lastEdited ? formatLastEdited(lastEdited) : "never"}</span>
        </div>

        <div className="flex items-center gap-2">
          {cloudStatus === "local" && (
            <div className="">
              <Unauthenticated>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-xs rounded-md hover:bg-muted/80 transition-colors cursor-pointer flex items-center gap-2"
                  title="Sign in to sync to cloud"
                >
                  <DatabaseIcon className="size-3" />
                  Local Only
                </button>
              </Unauthenticated>
              <Authenticated>
                <button
                  onClick={() => setSyncModalOpen(true)}
                  className="text-xs rounded-md hover:bg-muted/80 transition-colors cursor-pointer flex items-center gap-2"
                  title="Click to sync to cloud"
                >
                  <DatabaseIcon className="size-3" />
                  Local Only
                </button>
              </Authenticated>
            </div>
          )}
          {isSyncing && (
            <span className="text-muted-foreground flex items-center gap-2">
              <UpdateIcon className="size-3 animate-spin" />
              Syncing...
            </span>
          )}
          {!isSyncing && syncComplete && (
            <span
              className="text-blue-500 flex items-center gap-2"
              title="Synced to cloud"
            >
              <CircleCheckBigIcon className="size-3" />
              Synced
            </span>
          )}
        </div>
      </div>
      {noteId && (
        <SyncModal
          open={syncModalOpen}
          onOpenChange={setSyncModalOpen}
          noteId={noteId}
        />
      )}

      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              To sync your notes to the cloud and access them from anywhere, you
              need to sign in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAuthModalOpen(false)}>
              Stay Local
            </Button>
            <Button onClick={() => router.push("/signin")}>Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
