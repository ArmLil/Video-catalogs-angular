import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../shared/models/movie.model';
import { Subject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('contentAnimation', [
      transition(':enter', [
        query('.movie-detail__section', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }) // Добавляем optional: true
      ])
    ])
  ]
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie = signal<Movie | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadMovie();
  }

  loadMovie(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = Number(params.get('id'));
        this.isLoading.set(true);
        return this.movieService.getMovieById(id);
      })
    ).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.isLoading.set(false);
        this.error.set(null);
      },
      error: (error) => {
        this.error.set(error.message || 'Failed to load movie details');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getRatingColor(rating: number): string {
    if (rating >= 8) return 'high';
    if (rating >= 6) return 'medium';
    return 'low';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}