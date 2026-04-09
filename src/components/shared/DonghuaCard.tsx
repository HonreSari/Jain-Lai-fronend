// src/components/shared/DonghuaCard.tsx
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import type { Series } from "@/types";

interface DonghuaCardProps {
  series: Series;
}

export function DonghuaCard({ series }: DonghuaCardProps) {
  return (
    <Link to={`/series/${series.id}`} className="block group card-donghua">
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Cover Image */}
        <img
          src={series.coverImageUrl}
          alt={series.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-background)]/90 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4"
        >
          <button className="btn-crimson flex items-center justify-center gap-2 w-full mb-3">
            <Play className="w-4 h-4" />
            Watch
          </button>
        </div>

        {/* Status Badge */}
        <span
          className="absolute top-2 right-2 px-2 py-1 text-xs font-medium 
                        bg-[var(--color-dark-primary)] text-white rounded-md backdrop-blur-sm"
        >
          {series.status}
        </span>

        {/* Rating Badge */}
        <span
          className="absolute top-2 left-2 px-2 py-1 text-xs font-medium 
                        bg-[var(--color-dark-accent)]/90 text-[var(--color-dark-background)] rounded-md backdrop-blur-sm"
        >
          ⭐ {series.rating}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[var(--color-dark-foreground)] group-hover:text-[var(--color-dark-primary)] transition-colors truncate">
          {series.title}
        </h3>
        <p className="text-sm text-[var(--color-dark-muted-foreground)] truncate">
          {series.chineseTitle}
        </p>
        <div className="flex items-center justify-between text-xs text-[var(--color-dark-muted-foreground)]">
          <span>{series.totalEpisodes} EP</span>
          <span>{series.genres[0]}</span>
        </div>
      </div>
    </Link>
  );
}
