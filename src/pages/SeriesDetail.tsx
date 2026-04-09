// src/pages/SeriesDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Star, Calendar, Clock, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import api from "@/lib/api";
import type { Series, Season } from "@/types";

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await api.get(`/series/${id}`);
        setSeries(data);
      } catch (err) {
        setError("Failed to load series details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[var(--color-dark-background)] flex items-center justify-center">Loading...</div>;
  if (error || !series) return <div className="min-h-screen bg-[var(--color-dark-background)] flex items-center justify-center text-red-400">{error}</div>;

  const activeSeason = series.seasons?.[activeSeasonIdx];
  const firstEpisode = activeSeason?.episodes?.[0];

  return (
    <div className="min-h-screen bg-[var(--color-dark-background)]">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${series.coverImageUrl})`, filter: "brightness(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-background)] via-[var(--color-dark-background)]/50 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap gap-2">
              {series.genres?.map((g) => (
                <span key={g} className="px-3 py-1 text-xs bg-[var(--color-dark-primary)]/20 text-[var(--color-dark-primary)] border border-[var(--color-dark-primary)]/30 rounded-full">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl font-bold text-[var(--color-dark-foreground)]">{series.title}</h1>
            <p className="text-lg text-[var(--color-dark-accent)]">{series.chineseTitle}</p>
            <div className="flex items-center gap-4 text-sm text-[var(--color-dark-muted-foreground)]">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[var(--color-dark-accent)]" /> {series.rating}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {series.status}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {series.totalEpisodes} EP</span>
            </div>
            <p className="text-[var(--color-dark-muted-foreground)] line-clamp-3">{series.description}</p>

            {firstEpisode && (
              <Link
                to={`/watch/${firstEpisode.id}`}
                className="inline-flex items-center gap-2 btn-crimson"
              >
                <Play className="w-4 h-4" /> Start Watching
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Season Tabs */}
        {series.seasons && series.seasons.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-[var(--color-dark-foreground)]">Episodes</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {series.seasons.map((s: Season, idx: number) => (
                <button
                  key={s.seasonOrder}
                  onClick={() => setActiveSeasonIdx(idx)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${activeSeasonIdx === idx
                      ? "bg-[var(--color-dark-primary)] text-white"
                      : "bg-[var(--color-dark-secondary)] text-[var(--color-dark-muted-foreground)] hover:bg-[var(--color-dark-secondary)]/80"
                    }`}
                >
                  {s.seasonName}
                </button>
              ))}
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {activeSeason?.episodes?.map((ep) => (
                <Link
                  key={ep.id}
                  to={`/watch/${ep.id}`}
                  className="group relative flex items-center gap-3 p-3 rounded-xl 
                 bg-[var(--color-dark-secondary)] 
                 border border-[var(--color-dark-border)] 
                 hover:border-[var(--color-dark-primary)]/50 
                 hover:bg-[var(--color-dark-primary)]/5
                 transition-all duration-300 ease-out
                 overflow-hidden"
                >
                  {/* Decorative side accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-dark-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-bold text-[var(--color-dark-foreground)] group-hover:text-[var(--color-dark-primary)] transition-colors">
                      EP {ep.episodeNumber}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--color-dark-muted-foreground)] truncate w-full">
                      {ep.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
