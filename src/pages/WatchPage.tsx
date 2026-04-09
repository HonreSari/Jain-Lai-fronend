// src/pages/WatchPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle, Clock } from "lucide-react"; // Added Youtube icon
import api from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import type { Episode } from "@/types";

export default function WatchPage() {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const { data } = await api.get("/series/1");
        let foundEp: Episode | undefined;
        for (const season of data.seasons || []) {
          foundEp = season.episodes.find((e: Episode) => e.id.toString() === episodeId);
          if (foundEp) break;
        }

        if (foundEp) {
          setEpisode(foundEp);
        } else {
          setEpisode({
            id: Number(episodeId),
            title: "Demo Episode",
            episodeNumber: 1,
            duration: "24m",
            videoUrl: "https://www.youtube.com/embed/videoseries?list=PLMX26aiIvX5oBwyvcxES9P7OvCtHcPny5"
          } as Episode);
        }
      } catch (err) {
        console.error("Failed to load episode", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisode();
  }, [episodeId]);

  const saveProgress = async () => {
    if (!episode) return;
    setSaving(true);
    try {
      await api.post("/progress", {
        episodeId: episode.id,
        watchedDuration: 1440,
        isCompleted: true
      });
      setIsCompleted(true);
    } catch (err) {
      console.error("Failed to save progress", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[var(--color-dark-background)] text-white flex items-center justify-center">Loading Player...</div>;
  if (!episode) return <div className="min-h-screen bg-[var(--color-dark-background)] text-white flex items-center justify-center">Episode not found</div>;

  const isYouTube = episode.videoUrl?.includes("youtube") || episode.videoUrl?.includes("youtu.be");

  return (
    <div className="min-h-screen bg-[var(--color-dark-background)] flex flex-col">
      <Navbar />

      {/* Back Button */}
      <div className="absolute top-24 left-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-[var(--color-dark-primary)] text-white rounded-full backdrop-blur-md transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Player Container */}
      <div className="flex-1 flex items-center justify-center bg-black p-4 pt-24 pb-8">
        <div className="w-full max-w-6xl aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[var(--color-dark-border)] relative">
          {isYouTube ? (
            <iframe
              src={episode.videoUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <video src={episode.videoUrl} className="w-full h-full" controls autoPlay onEnded={saveProgress} />
          )}
        </div>
      </div>

      {/* Info & Actions */}
      <div className="max-w-6xl mx-auto w-full px-4 pb-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-dark-border)] pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-[var(--color-dark-foreground)]">
              {episode.title}
            </h1>
            <p className="text-[var(--color-dark-muted-foreground)] flex items-center gap-2">
              <span className="text-[var(--color-dark-primary)] font-bold">EPISODE {episode.episodeNumber}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {episode.duration}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mark as Watched Button */}
            <button
              onClick={saveProgress}
              disabled={saving || isCompleted}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${isCompleted
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-[var(--color-dark-secondary)] text-white border border-[var(--color-dark-border)] hover:border-[var(--color-dark-primary)]"
                }`}
            >
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {isCompleted ? "Completed" : "Mark Watched"}
            </button>

            {/* NEW: Watch on YouTube Button */}
            {isYouTube && (
              <a
                href={episode.videoUrl?.replace("embed/", "watch?v=")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#FF0000] hover:bg-[#CC0000] text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20"
              >
                <Play className="w-5 h-5" />
                Watch on YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
