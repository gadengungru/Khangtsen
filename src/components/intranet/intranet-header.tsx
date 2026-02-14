"use client";

import { useAuth } from "@/contexts/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

function getBuildVersion(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "p" : "a";
  hours = hours % 12 || 12;
  return `v${yy}${mm}${dd}.${hours}${minutes > "00" ? ":" + minutes : ""} ${ampm === "a" ? "am" : "pm"}`;
}

export function IntranetHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lang = (params.lang as string) || "en";
  const version = useMemo(() => getBuildVersion(), []);

  const handleSignOut = async () => {
    await signOut();
    router.replace(`/${lang}`);
  };

  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">Khangtsen</span>
          <span className="text-xs text-slate-400">{version}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
