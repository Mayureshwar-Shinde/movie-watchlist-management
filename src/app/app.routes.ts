import { Routes } from '@angular/router';
import { MovieListComponent } from './movies/pages/movie-list/movie-list.component';
import { ViewMovieComponent } from './movies/pages/view-movie/view-movie.component';

export const routes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movie/:id', component: ViewMovieComponent }
];
