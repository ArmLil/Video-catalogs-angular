import { Routes } from '@angular/router';
import { MovieListComponent } from './features/movie-list/movie-list.component';
import { MovieDetailComponent } from './features/movie-detail/movie-detail.component';

export const routes: Routes = [
  { 
    path: '', 
    component: MovieListComponent,
    title: 'Movie Catalog - Browse Films'
  },
  { 
    path: 'movie/:id', 
    component: MovieDetailComponent,
    title: 'Movie Details'
  },
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  }
];