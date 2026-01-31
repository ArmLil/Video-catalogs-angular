import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Movie } from '../../shared/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/movies';
  private searchTerm = new BehaviorSubject<string>('');
  private cache = new Map<number, Observable<Movie>>();
  private allMoviesCache: Observable<Movie[]> | null = null;
  
  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    if (!this.allMoviesCache) {
      this.allMoviesCache = this.http.get<Movie[]>(this.apiUrl).pipe(
        shareReplay(1)
      );
    }
    return this.allMoviesCache;
  }

  getMovieById(id: number): Observable<Movie> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    const movie$ = this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
      shareReplay(1)
    );

    this.cache.set(id, movie$);
    return movie$;
  }

  searchMovies(term: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}?title_like=${term}`);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.next(term);
  }

  getSearchTerm(): Observable<string> {
    return this.searchTerm.asObservable();
  }

  clearCache(): void {
    this.cache.clear();
    this.allMoviesCache = null;
  }
}