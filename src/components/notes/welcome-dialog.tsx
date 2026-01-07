"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const WELCOME_DISMISSED_KEY = "monotes-welcome-dismissed";

export default function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(WELCOME_DISMISSED_KEY);
    if (!dismissed) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(WELCOME_DISMISSED_KEY, "true");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="sticky top-0 bg-background z-10 px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-xl">Welcome to Monotes</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <h4 className="font-semibold text-sm mb-1">Local-First Notes</h4>
            <p className="text-sm text-muted-foreground">
              Your notes are stored locally on your device using IndexedDB. They
              work offline and load instantly, with no server required for basic
              usage.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">Cloud Sync</h4>
            <p className="text-sm text-muted-foreground">
              Sign in to sync your notes across devices. Changes are
              automatically saved and synced in the background while you type.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">Vim Mode</h4>
            <p className="text-sm text-muted-foreground">
              Enable Vim keybindings in settings for a keyboard-driven editing
              experience. Custom key mappings are supported via the editor
              settings.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">Distraction-Free Mode</h4>
            <p className="text-sm text-muted-foreground">
              The UI fades away while you type, keeping you focused on your
              writing. Interface elements reappear when you pause.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-1">Markdown Editor</h4>
            <p className="text-sm text-muted-foreground">
              Write in Markdown with syntax highlighting powered by CodeMirror.
              Customize font size, tab width, and line numbers in settings.
            </p>
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-background z-10 px-6 py-4 border-t border-border/50 flex-row items-center justify-between sm:justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="size-4 rounded border-border accent-primary cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">
              Do not show again
            </span>
          </label>
          <Button onClick={handleClose}>Okay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
