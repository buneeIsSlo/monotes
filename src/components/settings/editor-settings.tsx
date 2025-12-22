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

export default function EditorSettings() {
  const { settings, updateSetting, isLoading } = useEditorSettings();

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1">Display</h3>
          <p className="text-xs text-muted-foreground">
            Configure how the editor looks and feels.
          </p>
        </div>

        <div className="rounded-lg bg-secondary border border-border/50 dark:bg-card divide-y divide-border/50">
          <div className="flex items-center justify-between p-4">
            <div className="space-y-0.5">
              <Label htmlFor="line-numbers">Line Numbers</Label>
              <p className="text-[12px] text-muted-foreground">
                Show line numbers in the left margin.
              </p>
            </div>
            <Switch
              id="line-numbers"
              checked={settings.lineNumbers}
              onCheckedChange={(checked) =>
                updateSetting("lineNumbers", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="space-y-0.5">
              <Label htmlFor="highlight-active-line">
                Highlight Active Line
              </Label>
              <p className="text-[12px] text-muted-foreground">
                Give the current line a subtle background.
              </p>
            </div>
            <Switch
              id="highlight-active-line"
              checked={settings.highlightActiveLine}
              onCheckedChange={(checked) =>
                updateSetting("highlightActiveLine", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <Label htmlFor="font-size">Font Size</Label>
            <Select
              value={settings.fontSize.toString()}
              onValueChange={(val) => updateSetting("fontSize", parseInt(val))}
            >
              <SelectTrigger id="font-size" className="w-[110px] h-8 text-xs">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {[12, 14, 16, 18, 20].map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="text-xs"
                  >
                    {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4">
            <Label htmlFor="tab-size">Tab Size</Label>
            <Select
              value={settings.tabSize.toString()}
              onValueChange={(val) => updateSetting("tabSize", parseInt(val))}
            >
              <SelectTrigger id="tab-size" className="w-[110px] h-8 text-xs">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {[2, 4, 8].map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="text-xs"
                  >
                    {size} spaces
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium">Vim Mode</h3>
            <p className="text-xs text-muted-foreground">
              Enable Vim keybindings for the editor.
            </p>
          </div>
          <Switch
            id="vim-mode"
            checked={settings.vimMode}
            onCheckedChange={(checked) => updateSetting("vimMode", checked)}
          />
        </div>

        <div className="space-y-3 rounded-lg border border-border/50 bg-secondary dark:bg-card p-4">
          <div className="space-y-2">
            <Label
              htmlFor="vim-commands"
              className="text-xs font-medium"
              aria-disabled={!settings.vimMode}
            >
              Custom Keybindings
            </Label>
            <Textarea
              id="vim-commands"
              placeholder="imap kj <Esc>"
              value={settings.vimCommands}
              onChange={(e) => updateSetting("vimCommands", e.target.value)}
              className="resize-none font-mono text-[13px] h-32 bg-input transition-colors border-none ring-1 ring-border/50 focus-visible:ring-ring"
              disabled={!settings.vimMode}
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Define custom Vim commands (one per line). Example:{" "}
              <code className="bg-muted px-1 rounded text-foreground">
                imap kj &lt;Esc&gt;
              </code>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
