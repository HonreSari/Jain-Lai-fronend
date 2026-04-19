// src/pages/WatchPage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/api";
import { progressService } from "@/lib/api.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navbar } from "@/components/layout/Navbar";
import type { Episode } from "@/types";

export default function WatchPage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const hasSaved = useRef<string | null>(null);

  // 1. Fetch Episode Data
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        hasSaved.current = null;
        // ✅ Direct endpoint - returns EpisodeStreamDTO with all fields
        const { data } = await api.get(`/episodes/${episodeId}`);
        setEpisode(data);
      } catch (err) {
        console.error("Failed to load episode", err);
        // ✅ Fallback mock data
        setEpisode({
          id: Number(episodeId),
          title: "Preview Episode",
          episodeNumber: 1,
          duration: "24m",
          videoUrl:
            "https://www.youtube.com/embed/videoseries?list=PLMX26aiIvX5oBwyvcxES9P7OvCtHcPny5",
          seriesId: 1,
          seriesTitle: "Soul Land",
          coverImageUrl:
            "https://res.cloudinary.com/dh3z96fyw/image/upload/v1775741403/Soul-Land_nydalz.jpg",
          seasonId: 1,
          seasonOrder: 1,
          nextEpisodeId: null,
          prevEpisodeId: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId]);

  // 2. Save Progress to Backend (60 seconds = preview)
  const saveProgress = async () => {
    if (!episode) return;
    setSaving(true);
    try {
      await progressService.saveProgress({
        episodeId: episode.id,
        watchedDuration: 60, // 1 minute preview
        isCompleted: true,
      });
      setIsCompleted(true);
    } catch (err) {
      console.error("Failed to save progress", err);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Auto-save progress once episode is loaded
  useEffect(() => {
    if (
      episode &&
      !loading &&
      isAuthenticated() &&
      hasSaved.current !== episodeId
    ) {
      hasSaved.current = episodeId || null;
      saveProgress();
    }
  }, [episode, loading, isAuthenticated, episodeId]);

  // 3. Build Preview URL (1-minute limit for YouTube Playlist)
  const getPreviewUrl = (fullUrl: string) => {
    if (!fullUrl) return "";
    if (fullUrl.includes("youtube.com/embed")) {
      const separator = fullUrl.includes("?") ? "&" : "?";
      return `${fullUrl}${separator}start=0&end=60&rel=0&modestbranding=1`;
    }
    return fullUrl;
  };

  // 4. Build Full YouTube URL (for external link)
  const getFullYouTubeUrl = (embedUrl: string) => {
    if (!embedUrl) return "https://www.youtube.com";
    if (embedUrl.includes("/embed/videoseries")) {
      const listMatch = embedUrl.match(/list=([^&]+)/);
      if (listMatch) {
        return `https://www.youtube.com/watch?list=${listMatch[1]}`;
      }
    }
    if (embedUrl.includes("/embed/")) {
      const videoId = embedUrl.split("/embed/")[1].split("?")[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return embedUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] text-white flex items-center justify-center">
        Loading Preview...
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] text-white flex items-center justify-center">
        Episode not found
      </div>
    );
  }

  const previewUrl = getPreviewUrl(episode.videoUrl);
  const fullYouTubeUrl = getFullYouTubeUrl(episode.videoUrl);
  const isYouTube = episode.videoUrl?.includes("youtube");

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar />

      {/* Back Button */}
      <div className="absolute top-20 left-4 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-[var(--color-primary)] text-white rounded-full backdrop-blur-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Preview Player */}
      <div className="flex-1 flex items-center justify-center bg-black p-4 pt-24 pb-8">
        <div className="w-full max-w-6xl aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-[var(--color-border)] relative">
          {isYouTube && previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-foreground)]">
              Preview not available
            </div>
          )}

          {/* Preview Badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-[var(--color-primary)]/90 text-white text-sm font-medium rounded-full backdrop-blur-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            1-Min Preview
          </div>
        </div>
      </div>

      {/* Episode Info + Actions */}
      <div className="max-w-6xl mx-auto w-full px-4 pb-12 space-y-6">
        {/* Title & Meta */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            {episode.title}
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            {episode.seriesTitle} • Season {episode.seasonOrder} • Episode{" "}
            {episode.episodeNumber}
          </p>
        </div>

        {/* ✅ Next/Prev Navigation (separate section, fixed layout) */}
        <div className="flex justify-between pt-2">
          {episode.prevEpisodeId ? (
            <Link
              to={`/watch/${episode.prevEpisodeId}`}
              className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 rounded-lg text-[var(--color-foreground)] transition-colors"
            >
              ← Previous
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-[var(--color-secondary)]/50 rounded-lg text-[var(--color-muted-foreground)] cursor-not-allowed"
            >
              ← Previous
            </button>
          )}

          {episode.nextEpisodeId ? (
            <Link
              to={`/watch/${episode.nextEpisodeId}`}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 rounded-lg text-white transition-colors"
            >
              Next →
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-[var(--color-primary)]/50 rounded-lg text-white/50 cursor-not-allowed"
            >
              Next →
            </button>
          )}
        </div>

        {/* Description Placeholder */}
        <p className="text-[var(--color-muted-foreground)] leading-relaxed">
          This is a 1-minute preview. Continue watching the full episode on
          YouTube.
        </p>

        {/* Watch Full Episode Button */}
        <a
          href={fullYouTubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-crimson inline-flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <ExternalLink className="w-4 h-4" />
          Watch Full Episode on YouTube
        </a>

        {/* Helpful Note */}
        <p className="text-xs text-[var(--color-muted-foreground)] text-center">
          Clicking above will open YouTube in a new tab. Support the creators by
          watching on their official channel! 🎌
        </p>
      </div>
    </div>
  );
}
