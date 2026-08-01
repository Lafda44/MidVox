import React from "react";
import { Instagram } from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

export const revalidate = 0;

const InstaDLForm = dynamic(() => import("@/components/dashboard/instadl-form").then(mod => mod.InstaDLForm), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-800/20 rounded-xl" />
});

export default async function InstaDLPage({ params }: { params: { guildId: string } }) {
  const [config, channels] = await Promise.all([
    api.getInstaDL(params.guildId),
    api.getChannels(params.guildId)
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Instagram className="h-6 w-6 text-primary" />
            Insta Downloader
          </h2>
          <p className="text-slate-400 mt-1">
            Auto-download Instagram links posted in specific channels and repost the media inline.
          </p>
        </div>
      </div>

      <InstaDLForm
        initialConfig={config}
        channels={channels}
        guildId={params.guildId}
      />
    </div>
  );
}
