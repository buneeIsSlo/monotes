"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { FileText, Paintbrush, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditorSettings from "./editor-settings";
import GeneralSettings from "./general-settings";
import { cn } from "@/lib/utils";

const SETTINGS_TAB_STORAGE_KEY = "monotes-settings-tab";

const SETTINGS_TABS = [
  { value: "general", label: "General", icon: Settings },
  { value: "appearance", label: "Appearance", icon: Paintbrush },
  { value: "editor", label: "Editor", icon: FileText },
] as const;

type TabType = (typeof SETTINGS_TABS)[number]["value"];

interface SettingsContentPros {
  isMobile: boolean;
}

export function SettingsContent({ isMobile }: SettingsContentPros) {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  useEffect(() => {
    const lastOpenedTab = sessionStorage.getItem(
      SETTINGS_TAB_STORAGE_KEY
    ) as TabType;
    if (lastOpenedTab) {
      setActiveTab(lastOpenedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
    sessionStorage.setItem(SETTINGS_TAB_STORAGE_KEY, value);
  };

  const content = (
    <>
      <TabsContent value="general" className="px-6 py-6 m-0 outline-none">
        <GeneralSettings />
      </TabsContent>
      <TabsContent
        value="appearance"
        className="px-6 py-6 m-0 space-y-4 outline-none"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Appearance Settings</h3>
            <p className="text-xs text-muted-foreground">
              Customize the look and feel of the application.
            </p>
          </div>
          <div className="border-border/50 bg-muted/20 h-32 rounded-xl border border-dashed flex items-center justify-center text-xs text-muted-foreground">
            Coming soon...
          </div>
        </div>
      </TabsContent>
      <TabsContent value="editor" className="px-6 py-6 m-0 outline-none">
        <EditorSettings />
      </TabsContent>
    </>
  );

  const tabTriggers = (isDesktop: boolean) =>
    SETTINGS_TABS.map(({ value, label, icon: Icon }) => (
      <TabsTrigger
        key={value}
        value={value}
        className={cn(
          "justify-start text-primary/80 rounded-md px-3 text-sm transition-all hover:bg-muted/80 data-[state=active]:bg-muted data-[state=active]:text-foreground border-none h-9 flex-none",
          isDesktop ? "w-full" : "shrink-0"
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4" />
          <span>{label}</span>
        </div>
      </TabsTrigger>
    ));

  return (
    <>
      {isMobile ? (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex flex-1 flex-col min-h-0 w-full"
        >
          <TabsList className="bg-muted/10 h-auto w-full justify-start rounded-none px-4 py-2 border-b border-border/50 overflow-x-auto no-scrollbar shrink-0 gap-2">
            {tabTriggers(false)}
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0">{content}</div>
        </Tabs>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex flex-1 flex-row gap-0 min-h-0 w-full"
        >
          <TabsList className="bg-muted/10 h-full w-44 shrink-0 flex-col justify-start rounded-none p-2 border-r border-border/50 gap-2">
            {tabTriggers(true)}
          </TabsList>

          <div className="flex-1 overflow-y-auto min-h-0">{content}</div>
        </Tabs>
      )}
    </>
  );
}
