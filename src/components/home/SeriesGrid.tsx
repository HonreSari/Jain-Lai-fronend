// src/components/home/SeriesGrid.tsx
import { useEffect, useState } from "react";
import { DonghuaCard } from "@/components/shared/DonghuaCard";
import api from "@/lib/api";
import type { Series, PageResponse } from "@/types";

interface SeriesGridProps {
  title: string;
  endpoint: string;
}

export function SeriesGrid({ title, endpoint }: SeriesGridProps) {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<PageResponse<Series>>(endpoint);
        setSeries(data.content);
      } catch (err) {
        setError("Failed to load series");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [endpoint]);

  if (loading) {
    return (
      <section className="py-8 px-4">
        <h2 className="font-display text-2xl font-bold text-[var(--color-dark-foreground)] mb-6">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-[var(--color-dark-secondary)] rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4">
        <h2 className="font-display text-2xl font-bold text-[var(--color-dark-foreground)] mb-6">
          {title}
        </h2>
        <p className="text-[var(--color-dark-muted-foreground)]">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-[var(--color-dark-foreground)] mb-6">
          {title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {series.map((s) => (
            <DonghuaCard key={s.id} series={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
