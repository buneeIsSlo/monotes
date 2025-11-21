"use client";

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { Authenticated, Unauthenticated } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SyncModal from "./sync-modal";

interface NotesMetadataBarProps {
  lastEdited?: number;
  cloudStatus?: "local" | "syncing" | "synced" | "ai-enabled";
  noteId?: string;
  className?: string;
}

export default function NotesMetadataBar({
  lastEdited,
  cloudStatus = "local",
  noteId,
  className = "",
}: NotesMetadataBarProps) {
  const router = useRouter();
  const [syncModalOpen, setSyncModalOpen] = useState(false);

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

        {/* Cloud status badge */}
        <div className="flex items-center gap-2">
          {cloudStatus === "local" && (
            <div className="">
              <Unauthenticated>
                <button
                  onClick={() => router.push("/signin")}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
                  title="Sign in to sync to cloud"
                >
                  📱 Local Only
                </button>
              </Unauthenticated>
              <Authenticated>
                <button
                  onClick={() => setSyncModalOpen(true)}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
                  title="Click to sync to cloud"
                >
                  📱 Local Only
                </button>
              </Authenticated>
            </div>
          )}
          {cloudStatus === "syncing" && (
            <span className="text-xs px-2 py-1 rounded-md bg-muted flex items-center gap-1">
              <span className="animate-spin">⏳</span>
              Syncing...
            </span>
          )}
          {cloudStatus === "synced" && (
            <span className="text-xs px-2 py-1 rounded-md bg-muted">
              ☁️ Synced
            </span>
          )}
          {cloudStatus === "ai-enabled" && (
            <span className="text-xs px-2 py-1 rounded-md bg-muted">
              ✨ AI Enabled
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
    </React.Fragment>
  );
}
