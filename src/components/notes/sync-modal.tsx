"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useSyncNoteToCloud } from "@/lib/sync-engine";
import { toast } from "sonner";

interface SyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
}

export default function SyncModal({
  open,
  onOpenChange,
  noteId,
}: SyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const syncNoteToCloud = useSyncNoteToCloud();

  const handleConfirm = async () => {
    setIsSyncing(true);
    try {
      await syncNoteToCloud(noteId);
      toast.success("Note synced to cloud successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to sync note:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sync note. Please try again."
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sync Note to Cloud</DialogTitle>
          <DialogDescription>
            This will upload your note to the cloud so you can access it from
            other devices. Your note will be synced automatically going forward.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSyncing}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSyncing}>
            {isSyncing ? (
              <React.Fragment>
                <Loader className="mr-2 size-4 animate-spin" />
                Syncing...
              </React.Fragment>
            ) : (
              "Sync to Cloud"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
