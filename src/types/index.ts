export interface Series {
  id: number;
  title: string;
  chineseTitle: string;
  coverImageUrl: string;
  bannerUrl?: string;
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

export interface Episode {
  id: number;
  title: string;
  episodeNumber: number;
  duration: string;
  videoUrl: string;
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
}
