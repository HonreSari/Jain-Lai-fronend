// src/components/home/HeroBanner.tsx
import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import type { Series } from "@/types";

interface HeroBannerProps {
  series: Series;
}

export function HeroBanner({ series }: HeroBannerProps) {
  // ✅ Safe navigation: get first episode ID or fallback to series ID
  const firstEpisodeId = series.seasons?.[0]?.episodes?.[0]?.id;

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${series.bannerUrl || series.coverImageUrl})`,
          filter: "brightness(0.6)",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-background)] via-[var(--color-dark-background)]/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-16">
        <div className="max-w-2xl space-y-4">
          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {series.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 text-xs font-medium bg-[var(--color-dark-primary)]/20 text-[var(--color-dark-primary)] border border-[var(--color-dark-primary)]/30 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-dark-foreground)] leading-tight">
            {series.title}
          </h1>
          <p className="text-lg text-[var(--color-dark-accent)] font-medium">
            {series.chineseTitle}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-[var(--color-dark-muted-foreground)]">
            <span className="flex items-center gap-1">
              ⭐{" "}
              <span className="text-[var(--color-dark-accent)]">
                {series.rating}
              </span>
            </span>
            <span>•</span>
            <span>{series.status}</span>
            <span>•</span>
            <span>{series.totalEpisodes} Episodes</span>
          </div>

          {/* Description */}
          <p className="text-[var(--color-dark-muted-foreground)] line-clamp-3 md:line-clamp-4">
            {series.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {/* ✅ FIXED: Only show Watch button if we have an episode ID */}
            {firstEpisodeId ? (
              <Link
                to={`/watch/${firstEpisodeId}`}
                className="btn-crimson flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Watch Now
              </Link>
            ) : (
              <Link
                to={`/series/${series.id}`}
                className="btn-crimson flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                View Details
              </Link>
            )}

            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-dark-border)] 
                             text-[var(--color-dark-foreground)] hover:bg-[var(--color-dark-secondary)] 
                             hover:border-[var(--color-dark-primary)]/50 transition-all"
            >
              <Info className="w-4 h-4" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
