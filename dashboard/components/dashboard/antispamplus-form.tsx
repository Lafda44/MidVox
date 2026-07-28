"use client";

import React, { useState, useEffect } from "react";
import { Ban, Save, RefreshCcw, Trash2, Plus, Info, MessageSquare, SmilePlus, UserX, Command, Hash, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AntiSpamPlusFormProps {
  initialConfig: any;
  channels: any[];
  roles: any[];
  guildId: string;
}

export function AntiSpamPlusForm({ initialConfig, channels, roles, guildId }: AntiSpamPlusFormProps) {
  const [config, setConfig] = useState<any>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newCommand, setNewCommand] = useState("");

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleSave = async () => {
    setSaving(true);
    const data: any = {
      delete_messages: config.delete_messages,
      delete_delay: config.delete_delay,
      re_limit: config.re_limit,
      re_window: config.re_window,
      re_cooldown: config.re_cooldown,
      re_delay: config.re_delay,
      timeout_duration: config.timeout_duration,
    };
    const promise = api.updateAntiSpamPlus(guildId, data);
    toast.promise(promise, {
      loading: "Saving Anti-Spam+ configuration...",
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

  const addTargetUser = async () => {
    if (!newUserId || !/^\d+$/.test(newUserId)) {
      toast.error("Enter a valid Discord user ID");
      return;
    }
    try {
      const result = await api.updateAntiSpamPlus(guildId, { add_target_user: newUserId });
      setConfig((prev: any) => ({ ...prev, target_users: result.target_users }));
      setNewUserId("");
      toast.success("Target user added");
    } catch { toast.error("Failed to add user"); }
  };

  const removeTargetUser = async (userId: string) => {
    try {
      const result = await api.updateAntiSpamPlus(guildId, { remove_target_user: userId });
      setConfig((prev: any) => ({ ...prev, target_users: result.target_users }));
      toast.success("Target user removed");
    } catch { toast.error("Failed to remove user"); }
  };

  const addBlockedCommand = async () => {
    if (!newCommand.trim()) {
      toast.error("Enter a command");
      return;
    }
    try {
      const result = await api.updateAntiSpamPlus(guildId, { add_blocked_command: newCommand.trim() });
      setConfig((prev: any) => ({ ...prev, blocked_commands: result.blocked_commands }));
      setNewCommand("");
      toast.success("Blocked command added");
    } catch { toast.error("Failed to add command"); }
  };

  const removeBlockedCommand = async (cmd: string) => {
    try {
      const result = await api.updateAntiSpamPlus(guildId, { remove_blocked_command: cmd });
      setConfig((prev: any) => ({ ...prev, blocked_commands: result.blocked_commands }));
      toast.success("Blocked command removed");
    } catch { toast.error("Failed to remove command"); }
  };

  const handleChannelToggle = async (type: "excluded_channels" | "target_channels", channelId: string, add: boolean) => {
    try {
      const key = add ? `add_${type === "excluded_channels" ? "excluded" : "target"}_channel` : `remove_${type === "excluded_channels" ? "excluded" : "target"}_channel`;
      const result = await api.updateAntiSpamPlus(guildId, { [key]: channelId });
      setConfig((prev: any) => ({ ...prev, [type]: result[type] }));
    } catch { toast.error("Failed to update channel"); }
  };

  const updateField = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-[#141B2D] border border-slate-800 rounded-[32px] shadow-2xl p-8 space-y-10 relative">

          {/* Message Deletion Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400"><MessageSquare className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold text-white text-sm">Message Deletion</h4>
                <p className="text-xs text-slate-400">Delete messages from target users or matching commands</p>
              </div>
            </div>
            <Switch checked={config.delete_messages} onCheckedChange={(v) => updateField("delete_messages", v)} />
          </div>

          {config.delete_messages && (
            <div className="space-y-8 pl-4 border-l-2 border-slate-800">

              {/* Delete Delay */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-400 w-32">Delete Delay (s)</label>
                <Input type="number" min={1} max={60} value={config.delete_delay} onChange={(e) => updateField("delete_delay", parseInt(e.target.value) || 8)} className="w-24 bg-slate-900/50 border-slate-800 h-10" />
              </div>

              {/* Target Users */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400"><UserX className="h-4 w-4" /></div>
                  <h4 className="font-bold text-white text-sm">Target Users</h4>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Discord User ID" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} className="bg-slate-900/50 border-slate-800 h-10 flex-1" />
                  <Button size="sm" onClick={addTargetUser} variant="secondary"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                  {config.target_users?.length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No target users</span>
                  ) : (
                    config.target_users?.map((uid: number) => (
                      <div key={uid} className="flex items-center gap-2 bg-slate-800 border border-slate-700/50 px-3 py-1.5 rounded-lg text-sm">
                        <span className="text-slate-200 font-mono text-xs">{uid}</span>
                        <button onClick={() => removeTargetUser(uid)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Blocked Commands */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400"><Command className="h-4 w-4" /></div>
                  <h4 className="font-bold text-white text-sm">Blocked Commands</h4>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="e.g. !play" value={newCommand} onChange={(e) => setNewCommand(e.target.value)} className="bg-slate-900/50 border-slate-800 h-10 flex-1" />
                  <Button size="sm" onClick={addBlockedCommand} variant="secondary"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                  {config.blocked_commands?.length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No blocked commands</span>
                  ) : (
                    config.blocked_commands?.map((cmd: string) => (
                      <div key={cmd} className="flex items-center gap-2 bg-slate-800 border border-slate-700/50 px-3 py-1.5 rounded-lg text-sm">
                        <span className="text-slate-200 font-mono text-xs">{cmd}</span>
                        <button onClick={() => removeBlockedCommand(cmd)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Excluded Channels */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-500/10 text-slate-400"><Hash className="h-4 w-4" /></div>
                  <h4 className="font-bold text-white text-sm">Excluded Channels</h4>
                </div>
                <Select value="" onValueChange={(val) => handleChannelToggle("excluded_channels", val, true)}>
                  <SelectTrigger className="w-full h-10 bg-slate-900/50 border-slate-800">
                    <SelectValue placeholder="Add channel to exclude..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 max-h-[300px]">
                    {channels.filter((c: any) => !(config.excluded_channels || []).includes(c.id)).map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="focus:bg-slate-800">#{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                  {(config.excluded_channels || []).length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No excluded channels</span>
                  ) : (
                    config.excluded_channels?.map((chId: string) => {
                      const ch = channels.find((c: any) => c.id === chId);
                      return (
                        <div key={chId} className="flex items-center gap-2 bg-slate-800 border border-slate-700/50 px-3 py-1.5 rounded-lg text-sm">
                          <span className="text-slate-200">#{ch?.name || chId}</span>
                          <button onClick={() => handleChannelToggle("excluded_channels", chId, false)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Reaction Anti-Spam */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400"><SmilePlus className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold text-white text-base">Reaction Anti-Spam</h4>
                <p className="text-xs text-slate-400">Detect and punish rapid reaction spam in monitored channels</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Limit (msgs)</label>
                <Input type="number" min={1} max={50} value={config.re_limit} onChange={(e) => updateField("re_limit", parseInt(e.target.value) || 5)} className="bg-slate-900/50 border-slate-800 h-10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Window (s)</label>
                <Input type="number" min={1} max={300} value={config.re_window} onChange={(e) => updateField("re_window", parseInt(e.target.value) || 30)} className="bg-slate-900/50 border-slate-800 h-10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Cooldown (s)</label>
                <Input type="number" min={1} max={300} value={config.re_cooldown} onChange={(e) => updateField("re_cooldown", parseInt(e.target.value) || 20)} className="bg-slate-900/50 border-slate-800 h-10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400">Timeout (min)</label>
                <Input type="number" min={1} max={60} value={config.timeout_duration} onChange={(e) => updateField("timeout_duration", parseInt(e.target.value) || 1)} className="bg-slate-900/50 border-slate-800 h-10" />
              </div>
            </div>

            {/* Target Channels for Reaction Spam */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2"><Users className="h-4 w-4 text-yellow-400" /> Monitored Channels</h4>
<Select value="" onValueChange={(val) => handleChannelToggle("target_channels", val, true)}>
                  <SelectTrigger className="w-full h-10 bg-slate-900/50 border-slate-800">
                    <SelectValue placeholder="Add channel to monitor..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 max-h-[300px]">
                    {channels.filter((c: any) => !(config.target_channels || []).includes(c.id)).map((c: any) => (
                      <SelectItem key={c.id} value={c.id} className="focus:bg-slate-800">#{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
                  {(config.target_channels || []).length === 0 ? (
                    <span className="text-xs text-slate-600 italic">No channels monitored</span>
                  ) : (
                    config.target_channels?.map((chId: string) => {
                      const ch = channels.find((c: any) => c.id === chId);
                    return (
                      <div key={chId} className="flex items-center gap-2 bg-slate-800 border border-slate-700/50 px-3 py-1.5 rounded-lg text-sm">
                        <span className="text-slate-200">#{ch?.name || chId}</span>
                        <button onClick={() => handleChannelToggle("target_channels", chId, false)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-slate-800">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 text-base font-bold gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
            >
              {saving ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Save Anti-Spam+ Settings
            </Button>
          </div>

        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Ban className="h-32 w-32 text-primary" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-white">How It Works</h3>
          </div>
          <ul className="text-xs text-slate-500 space-y-2">
            <li>• Messages from target users are auto-deleted.</li>
            <li>• Blocked commands are removed instantly.</li>
            <li>• Excluded channels are never affected.</li>
            <li>• Reaction spam triggers a timeout + cleanup.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}