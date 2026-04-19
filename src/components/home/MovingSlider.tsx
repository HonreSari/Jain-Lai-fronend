import { useEffect, useState } from "react";
import api from "@/lib/api";
import { DonghuaCard } from "../shared/DonghuaCard";
import type { Series, PageResponse } from "@/types";

interface MovingSliderProps {
  title: string;
  endpoint: string;
}

export function MovingSlider({ title, endpoint }: MovingSliderProps) {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const { data } = await api.get<PageResponse<Series>>(endpoint);
        setSeries(data.content);
      } catch (err) {
        console.error("Failed to load moving series", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [endpoint]);

  if (loading || series.length === 0) return null;

  return (
    <section className="py-8 overflow-hidden bg-gradient-to-b from-transparent via-[var(--color-secondary)]/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="font-display text-2xl font-bold text-[var(--color-foreground)]">
          {title}
        </h2>
      </div>
      
      <div className="relative group">
        <div className="animate-auto-scroll hover:[animation-play-state:paused] flex gap-6 px-4">
          {/* Duplicate for seamless loop */}
          {[...series, ...series, ...series].map((s, index) => (
            <div 
              key={`${s.id}-${index}`} 
              className="w-[200px] shrink-0 transition-all duration-300 hover:scale-105"
            >
              <DonghuaCard series={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
