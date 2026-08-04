"use client";

import React, { useState, useEffect } from "react";
import { Instagram, Save, RefreshCcw, Trash2, Info, Plus, Download, Hash } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface InstaDLFormProps {
  initialConfig: any;
  channels: any[];
  guildId: string;
}

export function InstaDLForm({ initialConfig, channels, guildId }: InstaDLFormProps) {
  const [config, setConfig] = useState<any>(initialConfig);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleSave = async () => {
    setSaving(true);
    const data: any = {
      enabled: config.enabled,
      delete_original: config.delete_original,
    };
    const promise = api.updateInstaDL(guildId, data);
    toast.promise(promise, {
      loading: "Saving Insta Downloader configuration...",
      success: "Settings saved successfully!",
      error: "Failed to update config",
    });
    try {
      const result = await promise;
      setConfig(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (value: boolean) => {
    setConfig((prev: any) => ({ ...prev, enabled: value }));
    try {
      const result = await api.updateInstaDL(guildId, { enabled: value });
      setConfig((prev: any) => ({ ...prev, ...result }));
      toast.success(value ? "Insta Downloader enabled" : "Insta Downloader disabled");
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const toggleDeleteOriginal = async (value: boolean) => {
    setConfig((prev: any) => ({ ...prev, delete_original: value }));
    try {
      const result = await api.updateInstaDL(guildId, { delete_original: value });
      setConfig((prev: any) => ({ ...prev, ...result }));
      toast.success(value ? "Original messages will be deleted" : "Original messages kept");
    } catch (err) {
      toast.error("Failed to update delete setting");
      console.error(err);
    }
  };

  const addChannel = async (channelId: string) => {
    if (!channelId) return;
    try {
      const result = await api.updateInstaDL(guildId, { add_channel: channelId });
      setConfig((prev: any) => ({ ...prev, channels: result.channels }));
      toast.success("Channel added");
    } catch { toast.error("Failed to add channel"); }
  };

  const removeChannel = async (channelId: string) => {
    try {
      const result = await api.updateInstaDL(guildId, { remove_channel: channelId });
      setConfig((prev: any) => ({ ...prev, channels: result.channels }));
      toast.success("Channel removed");
    } catch { toast.error("Failed to remove channel"); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl p-8 space-y-10 relative">

          {/* Enabled Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary"><Download className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold text-slate-50 text-sm">Enabled</h4>
                <p className="text-xs text-slate-400">Watch selected channels for Instagram links &amp; YouTube Shorts</p>
              </div>
            </div>
            <Switch checked={config.enabled} onCheckedChange={toggleEnabled} />
          </div>

          {config.enabled && (
            <div className="space-y-8 pl-4 border-l-2 border-slate-800">

              {/* Delete Original Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600"><Trash2 className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-bold text-slate-50 text-sm">Delete Original</h4>
                    <p className="text-xs text-slate-400">Remove the original message after the media is posted</p>
                  </div>
                </div>
                <Switch checked={config.delete_original} onCheckedChange={toggleDeleteOriginal} />
              </div>

              {/* Monitored Channels */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary"><Hash className="h-4 w-4" /></div>
                  <h4 className="font-bold text-slate-50 text-sm">Monitored Channels</h4>
                </div>
                <Select value="" onValueChange={addChannel}>
                  <SelectTrigger className="w-full h-10 bg-slate-900/50 border-slate-800">
                    <SelectValue placeholder="Add channel to monitor..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 max-h-[300px]">
                    {channels.filter((c: any) => !(config.channels || []).includes(c.id)).map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="focus:bg-slate-800">#{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                  {(config.channels || []).length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No channels monitored</span>
                  ) : (
                    config.channels?.map((chId: string) => {
                      const ch = channels.find((c: any) => c.id === chId);
                      return (
                        <div key={chId} className="flex items-center gap-2 bg-slate-800 border border-slate-700/50 px-3 py-1.5 rounded-lg text-sm">
                          <span className="text-slate-200">#{ch?.name || chId}</span>
                          <button onClick={() => removeChannel(chId)} className="text-slate-500 hover:text-red-600 transition-colors"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-6 border-t border-slate-800">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 text-base font-bold gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
            >
              {saving ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Save Insta Downloader Settings
            </Button>
          </div>

        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Instagram className="h-32 w-32 text-primary" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-50">How It Works</h3>
          </div>
          <ul className="text-xs text-slate-500 space-y-2">
            <li>â€¢ Reels and post links are downloaded automatically.</li>
            <li>â€¢ Media is reposted inline in the channel.</li>
            <li>â€¢ Files are capped at 24MB for Discord limits.</li>
            <li>â€¢ Only monitored channels are watched.</li>
          </ul>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-50">Supported Links</h3>
          </div>
          <p className="text-xs text-slate-500 mb-2">instagram.com reels, posts, stories &amp; instagr.am short links.</p>
        </div>
      </div>
    </div>
  );
}
