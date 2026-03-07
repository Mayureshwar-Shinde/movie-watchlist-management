import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from '../../../movies/components/movie-card/movie-card.component';
import { Movie } from '../../models/movie';
import { AddMovieComponent } from '../add-movie/add-movie.component';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent, AddMovieComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  movie!: Movie;
  showForm: boolean = false;

  constructor(private movieService: MovieService) {
    this.resetMovie();
  }

  resetMovie() {
    this.movie = {
      id: 0,
      title: '',
      description: '',
      rating: 0.0,
      watched: false,
      thumbnail: ''
    };
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
  this.movieService.getAllMovies().subscribe({
    next: movies => this.movies = movies,
    error: err => console.error('Failed to load movies', err)
  });
}

  deleteMovie(movie: Movie) {
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => this.loadMovies(),
      error: err => console.error('Failed to delete movie', err)
    });
  }

  validateMovie(movie: Movie): boolean {
    const title = movie.title?.trim();
    const description = movie.description?.trim();
    const imageUrl = movie.thumbnail?.trim();
    const rating = movie.rating;

    if (!title || !description || !imageUrl || rating === null || rating === undefined || rating <= 0) {
      return false;
    }
    return true;
  }

  addMovie(movie: Movie) {
    if(!this.validateMovie(movie)) return;
    const { id, ...moviePayload } = movie;
    if(!movie.id) {
      this.movieService.addMovie(moviePayload).subscribe({
        next: () => this.loadMovies(),
        error: err => console.error('Failed to add movie', err)
      });
    } else {
      this.movieService.updateMovie(movie).subscribe({
        next: () => this.loadMovies(),
        error: err => console.error('Failed to update movie', err)
      });
    }
    this.resetMovie();
    this.showForm = false;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  editMovie(updatedMovie: Movie) {
    this.movie = updatedMovie;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetMovie();
    }
  }
}
