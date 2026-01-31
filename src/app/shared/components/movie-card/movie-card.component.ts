import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('hoverAnimation', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      })),
      state('hovered', style({
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
      })),
      transition('normal <=> hovered', animate('200ms ease-in-out'))
    ])
  ]
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  hoverState = 'normal';

  get ratingColor(): string {
    if (this.movie.rating >= 8) return 'high';
    if (this.movie.rating >= 6) return 'medium';
    return 'low';
  }

  onMouseEnter() {
    this.hoverState = 'hovered';
  }

  onMouseLeave() {
    this.hoverState = 'normal';
  }

  get genresPreview(): string {
    return this.movie.genre.slice(0, 2).join(', ') + 
           (this.movie.genre.length > 2 ? '...' : '');
  }
}