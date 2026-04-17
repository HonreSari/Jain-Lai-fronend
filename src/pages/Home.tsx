// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SeriesGrid } from "@/components/home/SeriesGrid";
import api from "@/lib/api";
import type { Series } from "@/types";

const GENRES = [
  "Action",
  "Adventure",
  "Fantasy",
  "Cultivation",
  "Martial Arts",
  "Romance",
  "Historical",
];

export default function Home() {
  const [featured, setFeatured] = useState<Series | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // ✅ Step 1: Get first series ID from list
        const listRes = await api.get("/series?page=0&size=1");
        const firstSeries = listRes.data.content?.[0];

        if (firstSeries?.id) {
          // ✅ Step 2: Fetch FULL detail (with seasons + episodes)
          const detailRes = await api.get(`/series/${firstSeries.id}`);
          setFeatured(detailRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch featured series:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-dark-background)]">
      <Navbar />

      <main className="pt-16">
        {featured && <HeroBanner series={featured} />}

        {/* Genre Filter */}
        <section className="pt-8 px-4 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${
                  selectedGenre === null
                    ? "bg-[var(--color-dark-primary)] text-white shadow-[0_0_12px_rgba(196,30,58,0.3)]"
                    : "bg-[var(--color-dark-secondary)] text-[var(--color-dark-muted-foreground)] hover:bg-[var(--color-dark-secondary)]/80"
                }`}
            >
              All
            </button>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${
                    selectedGenre === genre
                      ? "bg-[var(--color-dark-primary)] text-white shadow-[0_0_12px_rgba(196,30,58,0.3)]"
                      : "bg-[var(--color-dark-secondary)] text-[var(--color-dark-muted-foreground)] hover:bg-[var(--color-dark-secondary)]/80"
                  }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          {selectedGenre ? (
            <SeriesGrid
              key={selectedGenre}
              title={`✨ ${selectedGenre} Series`}
              endpoint={`/series?page=0&size=24&genre=${selectedGenre}`}
            />
          ) : (
            <>
              <SeriesGrid
                title="🔥 Trending Now"
                endpoint="/series?page=0&size=12"
              />
              <SeriesGrid
                title="🆕 Recently Updated"
                endpoint="/series?page=0&size=12"
              />
              <SeriesGrid
                title="⭐ Top Rated"
                endpoint="/series?page=0&size=12"
              />
            </>
          )}
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-[var(--color-dark-border)]/40 mt-16">
        <div className="max-w-7xl mx-auto text-center text-sm text-[var(--color-dark-muted-foreground)]">
          <p>🗡️ Sword of Coming • Donghua Streaming • School Project 2026</p>
        </div>
      </footer>
    </div>
  );
}
