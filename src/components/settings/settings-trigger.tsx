"use client";

import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SettingsContent } from "./settings-content";
import { EditorView } from "@codemirror/view";

export default function SettingsTrigger() {
  const [open, setOpen] = useState(false);
  const breakpoint = 768;
  const isMobile = useBreakpoint(breakpoint);

  const focusEditor = () => {
    const editorElement = document.querySelector<HTMLElement>(".cm-editor");
    if (editorElement) {
      const view = EditorView.findFromDOM(editorElement);
      view?.focus();
    }
  };

  return (
    <React.Fragment>
      <Button
        variant="ghost"
        size="icon"
        aria-label="settings"
        onClick={() => setOpen(true)}
      >
        <MixerHorizontalIcon className="size-4" />
      </Button>

      {isMobile && (
        <Drawer
          open={open}
          onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) {
              setTimeout(focusEditor, 0);
            }
          }}
        >
          <DrawerContent className="h-[85vh] bg-sidebar">
            <DrawerHeader className="text-left px-6 pt-6 pb-2 border-b border-border/50">
              <DrawerTitle className="text-lg font-semibold leading-none tracking-tight text-left w-fit py-2">
                Settings
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Customize your settings here.
              </DrawerDescription>
            </DrawerHeader>
            <SettingsContent isMobile={isMobile} />
          </DrawerContent>
        </Drawer>
      )}

      {!isMobile && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className="flex flex-col gap-0 overflow-hidden p-0 md:h-[80%] md:max-h-[700px] md:max-w-[700px] lg:max-w-[800px] bg-sidebar divide-y divide-border/50"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              focusEditor();
            }}
          >
            <DialogHeader className="px-6 py-4 h-fit text-left">
              <DialogTitle className="text-lg font-semibold">
                Settings
              </DialogTitle>
              <DialogDescription className="sr-only">
                Customize your settings here.
              </DialogDescription>
            </DialogHeader>
            <SettingsContent isMobile={isMobile} />
          </DialogContent>
        </Dialog>
      )}
    </React.Fragment>
  );
}
