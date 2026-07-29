"use client";

import { useState, useEffect } from "react";
import { SmilePlus, RefreshCcw, Plus, Trash2, Loader, Search, PenLine, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function EmojiManagerPage() {
  const [emojis, setEmojis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [newVar, setNewVar] = useState("");
  const [newName, setNewName] = useState("");
  const [newId, setNewId] = useState("");
  const [newAnimated, setNewAnimated] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editId, setEditId] = useState("");

  const fetchEmojis = async () => {
    try {
      const data = await api.request<any>("/admin/emojis");
      setEmojis(data.emojis);
    } catch {
      toast.error("Failed to load emojis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmojis(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.syncEmojis();
      toast.success("Emoji sync triggered! May need restart to apply.");
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleAdd = async () => {
    if (!newVar || !newName || !newId) {
      toast.error("Fill all fields");
      return;
    }
    try {
      await api.request<any>(`/admin/emojis?var_name=${encodeURIComponent(newVar)}&name=${encodeURIComponent(newName)}&emoji_id=${encodeURIComponent(newId)}&animated=${newAnimated}`, { method: "POST" });
      toast.success("Emoji added");
      setNewVar(""); setNewName(""); setNewId(""); setNewAnimated(false);
      fetchEmojis();
    } catch (e: any) {
      toast.error(e.message || "Failed to add");
    }
  };

  const handleDelete = async (varName: string) => {
    try {
      await api.request<any>(`/admin/emojis/${encodeURIComponent(varName)}`, { method: "DELETE" });
      toast.success("Emoji deleted");
      fetchEmojis();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (emoji: any) => {
    setEditing(emoji.var_name);
    setEditName(emoji.name);
    setEditId(emoji.emoji_id);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditName("");
    setEditId("");
  };

  const saveEdit = async (varName: string) => {
    try {
      await api.request<any>(`/admin/emojis/${encodeURIComponent(varName)}?name=${encodeURIComponent(editName)}&emoji_id=${encodeURIComponent(editId)}`, { method: "PATCH" });
      toast.success("Emoji updated");
      setEditing(null);
      fetchEmojis();
    } catch {
      toast.error("Failed to update");
    }
  };

  const filtered = emojis.filter(
    (e) =>
      e.var_name.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.emoji_id.includes(search)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Emoji Manager</h1>
          <p className="text-sm text-slate-400">{emojis.length} emojis defined</p>
        </div>
        <Button onClick={handleSync} disabled={syncing} className="gap-2">
          {syncing ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          Sync All
        </Button>
      </div>

      {/* Add new emoji */}
      <div className="bg-[#141B2D] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Plus className="h-4 w-4 text-green-400" /> Add Emoji</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Variable name (e.g. MY_EMOJI)" value={newVar} onChange={(e) => setNewVar(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))} className="bg-slate-900/50 border-slate-800" />
          <Input placeholder="Emoji name (e.g. myemoji)" value={newName} onChange={(e) => setNewName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className="bg-slate-900/50 border-slate-800" />
          <Input placeholder="Discord emoji ID (numbers)" value={newId} onChange={(e) => setNewId(e.target.value.replace(/\D/g, ""))} className="bg-slate-900/50 border-slate-800" />
          <div className="flex gap-2">
            <Button variant={newAnimated ? "default" : "secondary"} onClick={() => setNewAnimated(!newAnimated)} className="flex-1">{newAnimated ? "Animated" : "Static"}</Button>
            <Button onClick={handleAdd} className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input placeholder="Search emojis..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-slate-900/50 border-slate-800" />
      </div>

      {/* Emoji list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((emoji) => (
          <div key={emoji.var_name} className="bg-[#141B2D] border border-slate-800 rounded-xl p-4 flex items-center gap-4 group hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={`https://cdn.discordapp.com/emojis/${emoji.emoji_id}.${emoji.animated ? "gif" : "webp"}`}
                alt={emoji.name}
                className="w-8 h-8 object-contain"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'><text y='20' font-size='20'>❓</text></svg>"; }}
              />
            </div>
            {editing === emoji.var_name ? (
              <div className="flex-1 min-w-0 space-y-2">
                <Input value={editName} onChange={(e) => setEditName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} className="h-8 text-xs bg-slate-900/50 border-slate-700" placeholder="Name" />
                <Input value={editId} onChange={(e) => setEditId(e.target.value.replace(/\D/g, ""))} className="h-8 text-xs bg-slate-900/50 border-slate-700 font-mono" placeholder="ID" />
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 text-green-400" onClick={() => saveEdit(emoji.var_name)}><Check className="h-3 w-3" /></Button>
                  <Button size="sm" variant="ghost" className="h-7 text-red-400" onClick={cancelEdit}><X className="h-3 w-3" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{emoji.var_name}</p>
                <p className="text-xs text-slate-400 truncate">:{emoji.name}:</p>
                <p className="text-xs text-slate-500 font-mono truncate">{emoji.emoji_id}</p>
              </div>
            )}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all h-8 w-8"
                onClick={() => startEdit(emoji)}
              >
                <PenLine className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all h-8 w-8"
                onClick={() => handleDelete(emoji.var_name)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          {search ? "No emojis match your search" : "No emojis defined yet"}
        </div>
      )}
    </div>
  );
}