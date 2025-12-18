"use client";

import { useEditorSettings } from "@/contexts/editor-settings-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "../ui/separator";

export default function EditorSettings() {
  const { settings, updateSetting, isLoading } = useEditorSettings();

  if (isLoading) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label className="text-xl">Display</Label>
          <Separator className="flex-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="line-numbers" className="text-muted-foreground">
            Line Numbers
          </Label>
          <Switch
            id="line-numbers"
            checked={settings.lineNumbers}
            onCheckedChange={(checked) => updateSetting("lineNumbers", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label
            htmlFor="highlight-active-line"
            className="text-muted-foreground"
          >
            Highlight Active Line
          </Label>
          <Switch
            id="highlight-active-line"
            checked={settings.highlightActiveLine}
            onCheckedChange={(checked) =>
              updateSetting("highlightActiveLine", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="font-size" className="text-muted-foreground">
            Font Size
          </Label>
          <Select
            value={settings.fontSize.toString()}
            onValueChange={(val) => updateSetting("fontSize", parseInt(val))}
          >
            <SelectTrigger id="font-size" className="w-[120px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {[12, 14, 16, 18, 20].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="tab-size" className="text-muted-foreground">
            Tab Size
          </Label>
          <Select
            value={settings.tabSize.toString()}
            onValueChange={(val) => updateSetting("tabSize", parseInt(val))}
          >
            <SelectTrigger id="tab-size" className="w-[120px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {[2, 4, 8].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} spaces
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="vim-mode" className="text-xl">
            Vim Mode
          </Label>
          <Separator className="flex-1/2" />
          <Switch
            id="vim-mode"
            checked={settings.vimMode}
            onCheckedChange={(checked) => updateSetting("vimMode", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vim-commands" className="text-muted-foreground">
            Vim Keybindings
          </Label>
          <Textarea
            id="vim-commands"
            placeholder="imap kj <Esc>"
            value={settings.vimCommands}
            onChange={(e) => updateSetting("vimCommands", e.target.value)}
            disabled={!settings.vimMode}
            className="resize-none font-mono text-sm h-32"
          />
          <p className="text-sm text-muted-foreground">
            Define custom Vim commands (one per line). Example:{" "}
            <code>imap kj &lt;Esc&gt;</code>
          </p>
        </div>
      </div>
    </div>
  );
}
