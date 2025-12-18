"use client";

import * as React from "react";
import { FileText, Paintbrush, Settings } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";

import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import EditorSettings from "./editor-settings";

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="settings">
          <MixerHorizontalIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-hidden p-0 md:h-[80%] md:max-h-[700px] md:max-w-[700px] lg:max-w-[800px] bg-sidebar">
        <DialogHeader className="px-6 py-4 border-border border-b h-fit">
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          <DialogDescription className="sr-only">
            Customize your settings here.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="general"
          className="flex h-full w-full flex-row gap-0"
        >
          <TabsList className="bg-transparent h-full w-48 shrink-0 flex-col justify-start rounded-none px-4 pt-4 border-r">
            <div className="flex w-full flex-col gap-2">
              <TabsTrigger
                value="general"
                className="w-full justify-start rounded-md px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <Settings className="size-4" />
                  <span>General</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="w-full justify-start rounded-md px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <Paintbrush className="size-4" />
                  <span>Appearance</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="editor"
                className="w-full justify-start rounded-md px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="size-4" />
                  <span>Editor</span>
                </div>
              </TabsTrigger>
            </div>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="general" className="p-6 m-0 space-y-4">
              <div className="border-sidebar-border/50 bg-muted/20 h-32 rounded-xl border border-dashed" />
              <div className="border-sidebar-border/50 bg-muted/20 h-32 rounded-xl border border-dashed" />
              <div className="border-sidebar-border/50 bg-muted/20 h-32 rounded-xl border border-dashed" />
              <div className="border-sidebar-border/50 bg-muted/20 h-32 rounded-xl border border-dashed" />
              <div className="border-sidebar-border/50 bg-muted/20 h-32 rounded-xl border border-dashed" />
            </TabsContent>
            <TabsContent value="appearance" className="p-6 m-0 space-y-4">
              <div className="border-sidebar-border/50 bg-muted/20 h-32 rounded-xl border border-dashed" />
              <div className="border-sidebar-border/50 bg-muted/20 h-32 rounded-xl border border-dashed" />
            </TabsContent>
            <TabsContent value="editor" className="p-6 m-0 space-y-4">
              <EditorSettings />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
