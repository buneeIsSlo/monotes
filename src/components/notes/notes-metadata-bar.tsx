"use client";

import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";

interface NotesMetadataBarProps {
  lastEdited?: number;
  className?: string;
}

export default function NotesMetadataBar({
  lastEdited,
  className = "",
}: NotesMetadataBarProps) {
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

      return `${day}-${month}-${year} · ${time}`;
    } catch {
      return "unknown";
    }
  };

  return (
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

      {/* Future controls will go here */}
      <div className="flex items-center gap-2">
        {/* Placeholder for public/private toggle */}
        {/* Placeholder for write/preview mode toggle */}
      </div>
    </div>
  );
}
