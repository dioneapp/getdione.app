"use client";

import { useEffect, useState } from "react";
import ExploreCarousel from "./ExploreCarousel";
import ExploreCarouselSkeleton from "./ExploreCarouselSkeleton";

type ScriptItem = {
  id: number;
  name: string;
  description: string;
  author: string;
  author_url: string;
  logo_url: string;
  banner_url: string;
  script_url: string;
  version: string;
  tags: string[];
  likes: number;
  downloads: number;
  created_at: string;
  updated_at: string;
};

export default function AppCarousel() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchScripts = async () => {
      try {
        const res = await fetch(`/api/scripts?limit=50`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load scripts");
        const data = await res.json();
        if (!cancelled) setScripts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setScripts([]);
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchScripts();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && scripts.length === 0) {
    return <ExploreCarouselSkeleton />;
  }

  return <ExploreCarousel scripts={scripts} />;
}


