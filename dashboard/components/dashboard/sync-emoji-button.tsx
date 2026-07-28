"use client";

import { useState } from "react";
import { RefreshCcw, Loader } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function SyncEmojiButton() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await api.syncEmojis();
      toast.success("Emojis synced! Restart bot to apply.");
    } catch {
      toast.error("Emoji sync failed");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={syncing}
      variant="secondary"
      size="sm"
      className="w-full gap-2"
    >
      {syncing ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      {syncing ? "Syncing..." : "Sync Emojis Now"}
    </Button>
  );
}