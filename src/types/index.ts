export interface Series {
  id: number;
  title: string;
  chineseTitle: string;
  coverImageUrl: string;
  description: string;
  rating: number;
  genres: string[];
  status: string;
  totalEpisodes: number;
  seasons: Season[];
}

export interface Season {
  seasonOrder: number;
  seasonName: string;
  episodes: Episode[];
}

// src/types/index.ts

export interface Episode {
  // ✅ Core episode fields
  id: number;
  title: string;
  episodeNumber: number;
  duration: string;
  videoUrl: string; // YouTube embed URL

  // ✅ Context fields (for display in WatchPage)
  seriesId: number;
  seriesTitle: string;
  coverImageUrl: string;
  seasonId: number;
  seasonOrder: number;

  // ✅ Navigation fields (for next/prev buttons)
  nextEpisodeId: number | null;
  prevEpisodeId: number | null;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  creditBalance: number;
} // ✅ SeriesListDTO - matches backend response for library endpoints

// ✅ Add these interfaces
export interface SeriesDetailDTO {
  "@class"?: string;
  id: number;
  title: string;
  chineseTitle: string;
  description?: string;
  coverImageUrl: string;
  rating: number;
  genres: string[];
  seasons: SeasonDTO[];
}

export interface SeasonDTO {
  "@class"?: string;
  seasonOrder: number;
  seasonName: string;
  episodes: EpisodeListItemDTO[];
}

export interface EpisodeListItemDTO {
  "@class"?: string;
  id: number;
  title: string;
  duration: string;
  episodeNumber: number;
}

// ✅ Keep existing SeriesListDTO (already correct)
export interface SeriesListDTO {
  id: number;
  title: string;
  chineseTitle: string;
  coverImageUrl: string;
  rating: number;
  status: string;
  totalEpisodes: number;
  genres: string[];
}
