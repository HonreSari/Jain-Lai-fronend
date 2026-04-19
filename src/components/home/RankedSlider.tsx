import { useEffect, useState } from "react";
import api from "@/lib/api";
import { DonghuaCard } from "../shared/DonghuaCard";
import type { Series, PageResponse } from "@/types";

interface RankedSliderProps {
  title: string;
  endpoint: string;
}

export function RankedSlider({ title, endpoint }: RankedSliderProps) {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const { data } = await api.get<PageResponse<Series>>(endpoint);
        setSeries(data.content);
      } catch (err) {
        console.error("Failed to load ranked series", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [endpoint]);

  if (loading || series.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-[var(--color-foreground)] mb-10">
          {title}
        </h2>

        <div className="flex gap-12 overflow-x-auto pb-8 scrollbar-hide">
          {series.map((s, index) => (
            <div key={s.id} className="relative shrink-0 w-[240px] group">
              {/* Big Ranking Number */}
              <div className="absolute -left-8 -bottom-6 select-none pointer-events-none">
                <span className="text-[12rem] font-black leading-none italic
                               text-transparent stroke-2 stroke-[var(--color-primary)]/30
                               group-hover:stroke-[var(--color-primary)]/60
                               transition-all duration-500"
                      style={{ WebkitTextStroke: '2px rgba(196, 30, 58, 0.3)' }}>
                  {index + 1}
                </span>
              </div>
              {/* Card Container with offset to show rank */}
              <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-2">
                <DonghuaCard series={s} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
