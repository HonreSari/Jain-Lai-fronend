// API Types
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

export interface Series {
  id: number
  title: string
  description: string
  coverImage: string
  releaseYear: number
  rating: number
  episodeCount: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface Episode {
  id: number
  seriesId: number
  episodeNumber: number
  title: string
  description: string
  duration: number
  releaseDate: string
  thumbnailUrl: string
}

export interface EpisodeStream {
  id: number
  streamUrl: string
  quality: string[]
  subtitles: string[]
}

export interface LibraryItem {
  id: number
  seriesId: number
  userId: number
  addedAt: string
  lastWatched: string
  series: Series
}

export interface CheckLibraryResponse {
  inLibrary: boolean
  addedAt?: string
}

export interface UserProgressRequest {
  episodeId: number
  watchedDuration: number
  isCompleted: boolean
}

export interface UserProgress {
  id: number
  userId: number
  episodeId: number
  episodeTitle: string
  episodeNumber: number
  seriesId: number
  seriesTitle: string
  coverImageUrl: string
  watchedDuration: number
  totalDuration: number
  isCompleted: boolean
  lastWatchedAt: string
}
