import { useCallback, useEffect, useRef } from "react";

interface NoteUpdateMessage {
  type: "note-update";
  noteId: string;
  content: string;
  senderId: string;
}

const CHANNEL_NAME = "monotes-note-sync";

export function useCrossTabSync(
  noteId: string,
  onReceive: (content: string) => void
) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const senderIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    // Create the channel
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);

    // Listen for messages from other tabs
    channelRef.current.onmessage = (event: MessageEvent<NoteUpdateMessage>) => {
      const { type, noteId: msgNoteId, content, senderId } = event.data;

      // Ignore own messages and messages for different notes
      if (type !== "note-update") return;
      if (senderId === senderIdRef.current) return;
      if (msgNoteId !== noteId) return;

      onReceive(content);
    };

    return () => {
      channelRef.current?.close();
    };
  }, [noteId, onReceive]);

  const broadcast = useCallback(
    (content: string) => {
      channelRef.current?.postMessage({
        type: "note-update",
        noteId,
        content,
        senderId: senderIdRef.current,
      } satisfies NoteUpdateMessage);
    },
    [noteId]
  );

  return { broadcast };
}
