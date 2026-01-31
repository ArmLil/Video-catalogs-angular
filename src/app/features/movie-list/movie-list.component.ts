import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MovieCardComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  isLoading = signal(false);
  error = signal(null);
  searchTerm = '';
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filterMovies(term);
    });
  }

  loadMovies(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.movieService.getAllMovies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (movies) => {
          this.movies = movies;
          this.filteredMovies = [...movies];
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error = error.message || 'Failed to load movies';
          this.isLoading.set(false);

        }
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredMovies = [...this.movies];
  }

  filterMovies(term: string): void {
    if (!term.trim()) {
      this.filteredMovies = [...this.movies];
      return;
    }
    
    const searchTerm = term.toLowerCase();
    this.filteredMovies = this.movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
      movie.director.toLowerCase().includes(searchTerm)
    );
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}