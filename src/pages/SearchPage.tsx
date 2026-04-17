// src/pages/SearchPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { DonghuaCard } from "@/components/shared/DonghuaCard";
import { seriesService } from "@/lib/api.service";
import type { Series } from "@/types";
import { Search, Loader2 } from "lucide-react";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await seriesService.getAll(0, 24, searchQuery);
      setResults(data.content);
    } catch (err) {
      setError("Failed to fetch search results");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, fetchResults]);

  return (
    <div className="min-h-screen bg-[var(--color-dark-background)]">
      <Navbar />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[var(--color-dark-primary)]/10 rounded-xl">
            <Search className="w-6 h-6 text-[var(--color-dark-primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-dark-foreground)]">
              Search Results
            </h1>
            <p className="text-[var(--color-dark-muted-foreground)]">
              {query
                ? `Found ${results.length} results for "${query}"`
                : "Type to search for donghua"}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[var(--color-dark-primary)] animate-spin mb-4" />
            <p className="text-[var(--color-dark-muted-foreground)]">
              Searching our archives...
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((series) => (
              <DonghuaCard key={series.id} series={series} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && query && results.length === 0 && (
          <div className="panel-glass p-12 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4 text-[var(--color-dark-muted-foreground)]">
              <Search className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-dark-foreground)] mb-2">
              No results found
            </h3>
            <p className="text-[var(--color-dark-muted-foreground)]">
              We couldn't find any donghua matching "{query}". Try different
              keywords or check for typos.
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !query && (
          <div className="text-center py-20">
            <p className="text-[var(--color-dark-muted-foreground)]">
              Start typing in the search bar above to explore our collection.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
