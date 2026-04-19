// src/pages/SeriesDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Play,
  Star,
  Calendar,
  Clock,
  Heart,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/api";
import { libraryService } from "@/lib/api.service";
import type { SeriesDetailDTO, SeasonDTO, SeriesListDTO } from "@/types";
import { getGenreColor } from "@/lib/genre-colors";

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [series, setSeries] = useState<SeriesDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);

  // ✅ Library state
  const [inLibrary, setInLibrary] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryMessage, setLibraryMessage] = useState<string | null>(null);

  // ✅ Auth state
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // ✅ Fetch series detail
        const { data } = await api.get<SeriesDetailDTO>(`/series/${id}`);

        // ✅ Sort seasons and episodes client-side BEFORE setting state
        const sortedSeries: SeriesDetailDTO = {
          ...data,
          seasons: data.seasons
            .sort((a, b) => a.seasonOrder - b.seasonOrder) // Sort seasons by order
            .map((season) => ({
              ...season,
              episodes: season.episodes.sort(
                (a, b) => a.episodeNumber - b.episodeNumber,
              ), // Sort episodes by number
            })),
        };

        setSeries(sortedSeries); // ✅ Set the sorted data

        // ✅ Check library status using efficient /check endpoint
        if (isAuthenticated() && token) {
          try {
            const isCurrentlyInLibrary = await libraryService.checkInLibrary(
              Number(id),
            );
            setInLibrary(isCurrentlyInLibrary);
          } catch (err) {
            console.warn("Could not check library status", err);
          }
        }
      } catch (err) {
        setError("Failed to load series details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, isAuthenticated, token]); // ✅ Toggle library status - matches backend endpoints exactly

  const toggleLibrary = async () => {
    if (!isAuthenticated()) {
      setLibraryMessage("Please login to save to library");
      setTimeout(() => setLibraryMessage(null), 3000);
      return;
    }

    setLibraryLoading(true);
    setLibraryMessage(null);

    try {
      if (inLibrary) {
        // ✅ DELETE /api/v1/library/{seriesId}
        await libraryService.removeFromLibrary(Number(id));
        setInLibrary(false);
        setLibraryMessage("✅ Removed from library");
      } else {
        // ✅ POST /api/v1/library/{seriesId} - returns SeriesListDTO
        await libraryService.addToLibrary(Number(id));
        setInLibrary(true);
        setLibraryMessage("✅ Added to library!");
      }
      setTimeout(() => setLibraryMessage(null), 3000);
    } catch (err: any) {
      console.error("Library toggle failed", err);
      setLibraryMessage("❌ Failed to update library");
      setTimeout(() => setLibraryMessage(null), 3000);
    } finally {
      setLibraryLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center text-[var(--color-muted-foreground)]">
        Loading series...
      </div>
    );
  if (error || !series)
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center text-red-400">
        {error || "Series not found"}
      </div>
    );

  const activeSeason = series.seasons?.[activeSeasonIdx];
  const firstEpisode = activeSeason?.episodes?.[0];
  const totalEpisodes = series.seasons.reduce(
    (acc, s) => acc + (s.episodes?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${series.coverImageUrl})`,
            filter: "brightness(0.4)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/50 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-8">
          <div className="space-y-4 max-w-2xl">
            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {series.genres?.map((g) => {
                const colors = getGenreColor(g);
                return (
                  <span
                    key={g}
                    className={`px-3 py-1 text-xs border rounded-full font-medium transition-colors ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    {g}
                  </span>
                );
              })}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl font-bold text-[var(--color-foreground)]">
              {series.title}
            </h1>
            <p className="text-lg text-[var(--color-accent)]">
              {series.chineseTitle}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[var(--color-accent)]" />
                {series.rating}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {series.seasons.length} Seasons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {totalEpisodes} EP
              </span>
            </div>

            {/* Description */}
            <p className="text-[var(--color-muted-foreground)] leading-relaxed line-clamp-3 md:line-clamp-4">
              {series.description || "No description available."}
            </p>

            {/* ✅ Simple Feedback Message */}
            {libraryMessage && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] bg-[var(--color-secondary)]/50 px-4 py-2 rounded-lg border border-[var(--color-border)]">
                <CheckCircle className="w-4 h-4" />
                {libraryMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {/* Watch Button */}
              {firstEpisode && (
                <Link
                  to={`/watch/${firstEpisode.id}`}
                  className="btn-crimson inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Start Watching
                </Link>
              )}

              {/* ✅ Add to Library Button */}
              <button
                onClick={toggleLibrary}
                disabled={libraryLoading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-all
                  ${
                    inLibrary
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                      : "border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:bg-[var(--color-secondary)]"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {libraryLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart
                    className={`w-4 h-4 ${inLibrary ? "fill-white" : ""}`}
                  />
                )}
                {inLibrary ? "In Library" : "Add to Library"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Season Tabs */}
        {series.seasons && series.seasons.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-[var(--color-foreground)]">
              Episodes
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {series.seasons.map((s: SeasonDTO, idx: number) => (
                <button
                  key={s.seasonOrder}
                  onClick={() => setActiveSeasonIdx(idx)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${
                      activeSeasonIdx === idx
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)]/80"
                    }`}
                >
                  {s.seasonName}
                </button>
              ))}
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {activeSeason?.episodes?.map((ep) => (
                <Link
                  key={ep.id}
                  to={`/watch/${ep.id}`}
                  className="group bg-[var(--color-secondary)] rounded-md border border-[var(--color-border)] 
                             hover:border-[var(--color-primary)] hover:shadow-[0_0_10px_rgba(196,30,58,0.2)] transition-all flex flex-col items-center justify-center py-2 px-1 text-center"
                >
                  <span className="text-sm font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)]">
                    {ep.episodeNumber}
                  </span>
                  <span className="text-[10px] text-[var(--color-muted-foreground)] mt-0.5 line-clamp-1">
                    EP
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
