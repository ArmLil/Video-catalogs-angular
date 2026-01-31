export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  director: string;
  actors: string[];
  plot: string;
  poster: string;
  rating: number;
  duration: string;
  country: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}