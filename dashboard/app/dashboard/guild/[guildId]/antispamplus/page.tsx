import React from "react";
import { Ban } from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

export const revalidate = 0;

const AntiSpamPlusForm = dynamic(() => import("@/components/dashboard/antispamplus-form").then(mod => mod.AntiSpamPlusForm), {
  loading: () => <div className="h-96 w-full animate-pulse bg-[#1A1A1A]/30 rounded-[6px]" />
});

export default async function AntiSpamPlusPage({ params }: { params: { guildId: string } }) {
  const [config, channels, roles] = await Promise.all([
    api.getAntiSpamPlus(params.guildId),
    api.getChannels(params.guildId),
    api.getRoles(params.guildId)
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ban className="h-6 w-6 text-primary" />
            Anti-Spam+
          </h2>
          <p className="text-neutral-400 mt-1">Delete target messages, block commands, and prevent reaction spam.</p>
        </div>
      </div>

      <AntiSpamPlusForm
        initialConfig={config}
        channels={channels}
        roles={roles}
        guildId={params.guildId}
      />
    </div>
  );
}