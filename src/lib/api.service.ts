import { SeriesListDTO } from "@/types";
import api from "./api";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  Series,
  PaginatedResponse,
  Episode,
  EpisodeStream,
  LibraryItem,
  CheckLibraryResponse,
  UserProgressRequest,
  UserProgress,
} from "./api.types";

// ==================== Auth Service ====================
export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("jwt_token");
  },
};

// ==================== Series Service ====================
export const seriesService = {
  getAll: async (
    page = 0,
    size = 12,
    query?: string,
    genre?: string,
  ): Promise<PaginatedResponse<Series>> => {
    const response = await api.get<PaginatedResponse<Series>>("/series", {
      params: { page, size, q: query, genre },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Series> => {
    const response = await api.get<Series>(`/series/${id}`);
    return response.data;
  },
};

// ==================== Episode Service ====================
export const episodeService = {
  getStream: async (id: number): Promise<EpisodeStream> => {
    const response = await api.get<EpisodeStream>(`/episodes/${id}/stream`);
    return response.data;
  },
};

// ==================== Library Service ====================
export const libraryService = {
  getLibrary: async (): Promise<SeriesListDTO[]> => {
    const response = await api.get<SeriesListDTO[]>("/library");
    return response.data;
  },

  addToLibrary: async (seriesId: number): Promise<SeriesListDTO> => {
    const response = await api.post<SeriesListDTO>(`/library/${seriesId}`, {});
    return response.data;
  },

  removeFromLibrary: async (seriesId: number): Promise<void> => {
    await api.delete(`/library/${seriesId}`);
  },

  checkInLibrary: async (seriesId: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/library/${seriesId}/check`);
    return response.data;
  },
};

// ==================== Progress Service ====================
export const progressService = {
  saveProgress: async (data: UserProgressRequest): Promise<UserProgress> => {
    const response = await api.post<UserProgress>("/progress", data);
    return response.data;
  },

  getProgress: async (): Promise<UserProgress[]> => {
    const response = await api.get<UserProgress[]>("/progress");
    return response.data;
  },
};
