// src/pages/LibraryPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navbar } from "@/components/layout/Navbar";
import { DonghuaCard } from "@/components/shared/DonghuaCard";
import api from "@/lib/api";
import type { Series } from "@/types";
import { BookOpen, Clock, Heart, Loader2 } from "lucide-react";

type Tab = "favorites" | "history";

export default function LibraryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>("favorites");
  const [favorites, setFavorites] = useState<Series[]>([]);
  const [history, setHistory] = useState<any[]>([]); // Progress items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/library" } });
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch favorites (library)
        const libRes = await api.get<Series[]>("/library");
        setFavorites(libRes.data);

        // Fetch watch history (progress)
        const progRes = await api.get<any[]>("/progress");
        setHistory(progRes.data);
      } catch (err) {
        setError("Failed to load library data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated()) return null;
  if (loading) return <LibrarySkeleton />;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-[var(--color-dark-background)]">
      <Navbar />

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-[var(--color-dark-foreground)]">
              My Library
            </h1>
            <p className="text-[var(--color-dark-muted-foreground)] mt-1">
              Your favorites and watch history
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[var(--color-dark-border)]">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                activeTab === "favorites"
                  ? "text-[var(--color-dark-primary)] border-b-2 border-[var(--color-dark-primary)]"
                  : "text-[var(--color-dark-muted-foreground)] hover:text-[var(--color-dark-foreground)]"
              }`}
            >
              <Heart className="w-4 h-4" />
              Favorites ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                activeTab === "history"
                  ? "text-[var(--color-dark-primary)] border-b-2 border-[var(--color-dark-primary)]"
                  : "text-[var(--color-dark-muted-foreground)] hover:text-[var(--color-dark-foreground)]"
              }`}
            >
              <Clock className="w-4 h-4" />
              Watch History ({history.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === "favorites" ? (
            favorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favorites.map((series) => (
                  <DonghuaCard key={series.id} series={series} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Heart className="w-12 h-12" />}
                title="No favorites yet"
                description="Add series to your library to see them here"
                actionLabel="Browse Series"
                onAction={() => navigate("/")}
              />
            )
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item) => (
                <HistoryItem key={item.id} progress={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock className="w-12 h-12" />}
              title="No watch history"
              description="Start watching episodes to build your history"
              actionLabel="Start Watching"
              onAction={() => navigate("/")}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Skeleton Loader Component
function LibrarySkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-dark-background)]">
      <Navbar />
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-[var(--color-dark-secondary)] rounded animate-pulse mb-8" />
          <div className="flex gap-2 mb-6">
            <div className="h-10 w-32 bg-[var(--color-dark-secondary)] rounded animate-pulse" />
            <div className="h-10 w-40 bg-[var(--color-dark-secondary)] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-[var(--color-dark-secondary)] rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="panel-glass p-12 text-center">
      <div className="flex justify-center mb-4 text-[var(--color-dark-muted-foreground)]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-dark-foreground)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--color-dark-muted-foreground)] mb-6">
        {description}
      </p>
      <button onClick={onAction} className="btn-crimson">
        {actionLabel}
      </button>
    </div>
  );
}

// History Item Component
function HistoryItem({ progress }: { progress: any }) {
  const navigate = useNavigate();

  // Calculate progress percentage
  const totalDuration = progress.totalDuration || 1440; // 24 min default
  const watched = progress.watchedDuration || 0;
  const percent = Math.min(100, Math.round((watched / totalDuration) * 100));

  return (
    <div
      className="panel-glass p-4 flex gap-4 hover:border-[var(--color-dark-primary)]/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/watch/${progress.episodeId}`)}
    >
      {/* Cover Image */}
      <img
        src={progress.coverImageUrl}
        alt={progress.seriesTitle}
        className="w-24 h-32 object-cover rounded-lg"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--color-dark-foreground)] truncate">
          {progress.seriesTitle}
        </h4>
        <p className="text-sm text-[var(--color-dark-muted-foreground)]">
          Episode {progress.episodeNumber}: {progress.episodeTitle}
        </p>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[var(--color-dark-muted-foreground)] mb-1">
            <span>{Math.floor(watched / 60)}m watched</span>
            <span>{percent}%</span>
          </div>
          <div className="progress-ink">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-dark-muted-foreground)]">
          <span>{new Date(progress.lastWatchedAt).toLocaleDateString()}</span>
          {progress.isCompleted && (
            <span className="text-green-500 flex items-center gap-1">
              ✓ Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
